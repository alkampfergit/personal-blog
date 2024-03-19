---
title: "Pill: Create an environment in an AzDo pipeline"
description: "Thanks to REST api creating a pipeline that is capable to create a new environment is matter of few lines of PowerShell code."
date: 2024-03-19T08:10:42+02:00
draft: false
categories: ["AzureDevOps"]
tags: ["Security", "Release"]
---

Scenario: We have to create a new environment for a new customer, and an environment consists of some resources on Azure, plus **an environment in azure DevOps to use with deploy pipeline**. Since we are deploying with Azure DevOps pipeline, it makes sense to create everything for new customer environment with another pipeline.

{{< highlight yaml "linenos=table,hl_lines=21-28 45-53,linenostart=1" >}}
stages: 
 
  - stage: create_environment
    jobs:
      - job: create_environment
        displayName: "Create environment if not present"
        pool:
          vmImage: windows-latest
        steps:
          - powershell: |
              write-Host "We are about to create the environment with api if not present"
              
              # Need to create the token in basic auth
              $AuthHeaders = @{
                "Authorization" = 'Basic ' + [Convert]::ToBase64String([Text.Encoding]::ASCII.GetBytes(":$(AccessToken)")) 
                "Content-Type" = "application/json"
              }
              $listEnvironment = Invoke-RestMethod -uri "https://dev.azure.com/org/teamproject/_apis/distributedtask/environments?api-version=7.1-preview.1" -Headers $AuthHeaders

              # Now check if some of the environment already was present in the list.
              $envExisting = $listEnvironment.value | Where-Object { $_.name -eq "$(customer_fullname)" }

              if ($envExisting) {
                Write-Host "The environment already exists"
                exit 0
              } 
              
              # Create an environment because it does not exists
              $createEnvPayload = @{
                  name = "$(customer_fullname)"
                  description = "Created by pipeline"
              } | ConvertTo-Json
              $createUri = "https://dev.azure.com/org/teamproject/_apis/distributedtask/environments?api-version=7.1-preview.1";
              Invoke-RestMethod -uri $createUri -method POST -Headers $AuthHeaders -Body $createEnvPayload
{{< / highlight >}}

As you can see the stage contains a job that is used to create an environment. This is based on a secret contained in the pipeline called `AccessToken` that is **used to authenticate to Azure DevOps REST API**. The script is quite simple, it first retrieves the list of environments and then checks if the environment is already present. If it is not present, it creates a new environment with a simple POST request to the REST API of Azure DevOps.

The Personal Access Token you create for this pipeline must only have access to the environment. **This is a good practice to limit the scope of the token** and minimize the impact of a possible leak of the token.

![Create a token that can only manage environments to be used in the pipeline](../images/token-for-environment.png)

***Figure 1***: *Create a token that can only manage environments to be used in the pipeline*

> Using a PAT in a pipeline is a standard technique to interact with the API

What about if I tell you that you can have a better way to solve this problem?

Whenever you need to use a PAT you should **try to use the token contained in a special variable called $(System.AccessToken)** that is automatically populated for the single execution. Just check [Official Documentation ](https://learn.microsoft.com/en-us/azure/devops/pipelines/build/variables?view=azure-devops&tabs=yaml) to understand how to use.

First you you must **explicitly map System.AccessToken into the pipeline using a variable.** A typical solution is the following.

{{< highlight yaml "linenos=table,hl_lines=21-28 45-53,linenostart=1" >}}
variables:
  system_accesstoken: $(System.AccessToken)
...
            $AuthHeaders = @{
                "Authorization" = 'Basic ' + [Convert]::ToBase64String([Text.Encoding]::ASCII.GetBytes(":$(system_accesstoken)")) 
                "Content-Type" = "application/json"
            }
            $listEnvironment = Invoke-RestMethod -uri "https://dev.azure.com/org/teamproject/_apis/distributedtask/environments?api-version=7.1-preview.1" -Headers $AuthHeaders

{{< / highlight >}}

The advantage of this approach is that you do not need to create **a special access token and store into the variables of the pipeline**. You can set the scope of the token with [Scoped Authorization](https://learn.microsoft.com/en-us/azure/devops/pipelines/process/access-tokens?view=azure-devops&tabs=yaml#job-authorization-scope), but the greatest advantage is that System Token is **created when the execution of the pipeline starts, and gets revoked when the execution ends**. This means not only that you do not need to manage the token, but also that the risk of a leak is virtually non-existent.

> Each time you need to interact with Azure DevOps REST api from a pipeline, always try to use System.AccessToken before resorting to a custom PAT.


Gian Maria.
