---
title: "Azure DevOps: Cleanup Docker images for your Pull Requests"
description: "If you automatically creates docker images for Pull Requests, it is quite important that you automate cleanup of these images to avoid filling your docker registry with unused images."
date: 2024-07-09T07:00:42+00:00
draft: false
categories: ["AzureDevops"]
tags: ["AzDo"]
---

This article is a prosecution of [the previous one on creating Docker Images for your Pull Requests](https://www.codewrecks.com/post/azdo/pipeline/build-and-create-docker-for-your-pr/) and deals with cleanup of your Docker Registry.

## Authentication to Azure 

In Azure DevOps you can use connected services to connect to Azure Accounts or external services, but since I'm using mainly PowerShell scripts inside my repository, **I often prefer using a Service Principal**. This is a good practice because you can limit the access of the service principal to only the resources it needs to access, and you can revoke the access at any time.

To create a service principal you can simply **create an App Registration in your Azure Entra administration portal**. Then you only need to create a secret for the application that will constitute the password of the service principal.

![Create an Entra application](../images/entra-applications.png)

***Figure 1:*** *Create an Entra application*

I like service principals because they starts having **no permission and then you can go to various resources and start adding Roles to the principal based on the resource you want it to access**. In this example I've created a single service principal that I'm using for all my Azure DevOps basic pipeline, but you can create how many you want. 

>  Using a service principal gives me two advantage, granularity of access and being able to manage everything from Azure Portal.

## The script

The script to cleanup resources is really simple, it starts authenticating to Azure with Service Principal and then get a reference for **all images inside that container registry**.

{{< highlight powershell "linenos=table,linenostart=1" >}}

# Connect to Azure
$SecurePassword = ConvertTo-SecureString -String $secret -AsPlainText -Force
$Credential = New-Object -TypeName System.Management.Automation.PSCredential -ArgumentList $ApplicationId, $SecurePassword
Connect-AzAccount -ServicePrincipal -TenantId $TenantId -Credential $Credential

# Get all images in the container registry
$images = Get-AzContainerRegistryRepository -RegistryName $registryName
{{< / highlight >}}

As you can see I need to pass ApplicationId and TenantId of the Service Principal (the entra application) I've created and then converting the secret to a secure string to create a credential object. **Then I simply connect to Azure with the service principal**. If everything is ok you will seee a message and then the call to Get-AzContainerRegistryRepository succeeds.

Now it is time to list all the tag, for all tag that have the form PRxxxx **extract pull request number and then check the status of the pull request on Azure DevOps**. If the pull request is not active, I can safely delete the image.

First of all I define a function to **get the status of a pull request**

{{< highlight powershell "linenos=table,linenostart=1" >}}
function Get-PullRequestStatus {
    [CmdletBinding()]
    param (
        [Parameter(Mandatory=$true)]
        [string]$PrId
    )

    $url = "$organizationUrl/$project/_apis/git/pullrequests/$($PrId)?api-version=6.0"
    $base64AuthInfo = [Convert]::ToBase64String([Text.Encoding]::ASCII.GetBytes(":$($pat)"))
    
    try {
        $response = Invoke-RestMethod -Uri $url -Headers @{Authorization=("Basic {0}" -f $base64AuthInfo)} -Method Get
        return $response.status
    }
    catch {
        Write-Warning "Failed to retrieve PR status for PR $PrId"
        return $null
    }
}
{{< / highlight >}}

This function is declared inside the main script, it works **with a Personal Access Token contained in $pat variable and also it uses the organizationUrl and project variables**. This function simply calls the Azure DevOps REST API to get the status of a pull request.

Given this function the script can enumerate **all the tags and delete those one that are not bound to an Active Pull Request**.

> Thanks to a simple RegEx we can identify all Docker Images bound to a Pull Request, and delete them if the correspoinding Pull Requests are not active.

{{< highlight powershell "linenos=table,linenostart=1" >}}
foreach ($image in $images) {
    Write-Host "Checking image $image for PR pattern."

    $tags = Get-AzContainerRegistryTag -RegistryName $registryName -RepositoryName $image

    foreach ($tag in $tags.Tags) {
        Write-Host "Checking tag $($tag.Name) for image $image for presence of PR pattern"
        
        if ($tag.Name -match '^PR(\d+)') {
            $prId = $matches[1]
            $prStatus = Get-PullRequestStatus -PrId $prId
            Write-Host "Image tag $($tag.Name) matches Pull Request pattern with PR ID $prId for image $image with status $prStatus"

            if ($prStatus -eq $null) {
                Write-Host "Failed to retrieve PR status for PR $prId. Skipping tag $($tag.Name) for image $image"
                $preservedImages += "$image`:$($tag.Name)"
                continue
            }
            if ($prStatus -ne "active") {
                Write-Host "Deleting tag $($tag.Name) for image $image"
                # Uncomment the following line to actually delete the tag
                Remove-AzContainerRegistryTag -RegistryName $registryName -RepositoryName $image -Name $tag.Name
                $deletedImages += "$image`:$($tag.Name)"
            }
            else {
                Write-Host "Keeping tag $($tag.Name) for image $image (PR status: $prStatus)"
                $preservedImages += "$image`:$($tag.Name)"
            }
        }
        else {
            Write-Host "Tag $($tag.Name) for image $image does not match Pull Request pattern"
            $preservedImages += "$image`:$($tag.Name)"
        }
    }
}
{{< / highlight >}}

This allows me to print a nice output like this one.

{{< highlight text "linenos=table,linenostart=1" >}}Summary:
Deleted Images:
  jarvis:PR3571-test
  jarvis:PR3571-test-arm
  jarvis:PR3574-test
  jarvis:PR3574-test-arm

Preserved Images:
  jarvis:5.32.0-develop
  jarvis:5.32.0-develop-arm
  jarvis:PR3561-test
  jarvis:PR3561-test-arm
  jarvis:PR3565-test
  jarvis:PR3565-test-arm
  jarvis:PR3589-test
  jarvis:PR3589-test-arm
  jarvis_base:arm
  jarvis_base:arm-test
  jarvis_base:latest
  jarvis_base:test
  jarvisautomation:arm
  jarvisautomation:latest

{{< / highlight >}}

Now you can schedule this script to run every night with a simple Azure DevOps pipeline.

> Once you have a PowerShell script that performs some maintenance, the easiest way to schedule it is to create a pipeline that runs the script at a specific time.

{{< highlight yaml "linenos=table,linenostart=1" >}}

trigger: none
pr: none 

schedules:
- cron: "0 23 * * *"
  displayName: Nightly cleanup
  always: true
  branches:
    include:
    - develop  # or your default branch name

jobs:
  - job: cleanup_pr_images
    displayName: "Execute cleanup script"
    pool: fast
    steps:
      - checkout: self
        clean: false
        fetchDepth: 1
      
      - task: Docker@2
        inputs:
          containerRegistry: 'Nebula'
          command: 'login'
        displayName: 'Login to nebula repository'

      - task: PowerShell@2
        inputs:
          filePath: 'docker/pr-docker-cleaner.ps1'
          arguments:  -pat $(System.AccessToken) -applicationId xxxxx -tenantId xxxxx -secret $(appsecret)
        displayName: 'Cleanup script'

{{< / highlight >}}

This pipeline runs on a special repository called **SetupScript** where we stored all setup and build script related to release. As you can see we can simply use the $(System.AccessToken) to access the Azure DevOps REST API with standard pipeline permission. The secret for the Service Principal is stored in a variable called appsecret.

This allows us to create how many images we need for our Pull Requests without the risk of filling the Docker Registry with unused images.

Gian Maria.