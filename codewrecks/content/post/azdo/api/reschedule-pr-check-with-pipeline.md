---
title: "Azure Devops Api - Automatically Re-Queue Pull Request Checks"
description: "Create a simple pipeline to re-queue checks on pull requests when target branch changes"
date: 2023-03-07T07:12:42+02:00
draft: false
categories: ["AzureDevOps"]
tags: ["Api"]
---

In previous post on this subject [Reschedule PR Check with API](https://www.codewrecks.com/post/azdo/api/reschedule-pr-check-with-api/) I've demonstrated **a simple PowerShell api script that can automatically re-queue all checks for Opened pull Requests where the check is expired**. The problem is: you need to schedule this script to run.

Actually the easiest way to schedule running a script that uses API is **using a standard pipeline. Give the ability to run whenever the target branch changes it is the best choice.** Since develop is my usual target branch for Pull request I left a CI trigger for changes in develop branch as well as some scheduled run (to include other non usual target branches).

> To simplify the process for this kind of pipeline I often use the old graphical editor.

Since I do not need anything fancy, I'm using the old pipeline editor to create as **single step pipeline** that will run the PowerShell script I've showed you in the previous post. **Using an old style pipeline allows me to avoid putting the script in source code**. This is usually not a good suggestion but this script is not really related to the project, is a simple script that can be used in any project so I'd like it not to be included in source code.

![Pipeline to re-queue checks on pull requests](../images/re-queue-pipeline.png)

***Figure 1***: *Pipeline to re-queue checks on pull requests*

PowerShell task contains the following script, as you can see **personal access token is supposed to be present in a variable named pat** and it is the simplest way to authorize the script to access the API.

{{< highlight powershell "linenos=table,linenostart=1" >}}
$org = "prxm"
$project = "jarvis"
$pat = "$(pat)"

# Set the headers for the API call
$headers = @{
    "Content-Type" = "application/json"
    "Authorization" = "Basic $( [System.Convert]::ToBase64String([System.Text.Encoding]::ASCII.GetBytes(":$($pat)")) )"
}

$headers_oauth = @{
    "Authorization" = "Bearer $accessToken"
    "Content-Type" = "application/json"
}

# Set the API endpoint URL for pull requests
$pullRequestUrl = "https://dev.azure.com/$org/$project/_apis/git/pullrequests?status=active&api-version=6.1"

# Send the GET request to the API endpoint to get the pull requests
$pullRequests = Invoke-RestMethod -Uri $pullRequestUrl -Headers $headers -Method Get

# Iterate through the pull requests
foreach ($pullRequest in $pullRequests.value) 
{
    Write-Host "Active pull request $($pullRequest.pullRequestId) for repository $($pullRequest.repository.name)"
    if ($pullRequest.repository.name -ne "jarvis") {
        continue
    }
    $projectId = $pullRequest.repository.project.id
    $pullRequestId = $pullRequest.pullRequestId

    $artifactId ="vstfs:///CodeReview/CodeReviewId/$projectId/$pullRequestId"
    $policyEvaluationUrl = "https://dev.azure.com/$org/$project/_apis/policy/evaluations?artifactId=$artifactId&api-version=7.0-preview.1"
 
    # Send the GET request to the API endpoint to get the build status of the pull request
    $policyEvaluation = Invoke-RestMethod -Uri $policyEvaluationUrl -Headers $headers -Method Get
    
    $isExpired = $false
    if ($policyEvaluation.count -gt 0) 
    {
        Write-Host "Pull request $pullRequestId has $($policyEvaluation.count) policy evaluations"
        foreach ($evaluation in $policyEvaluation.value) 
        {
            if ($evaluation.context.isExpired) {
                Write-Host "Policy $($evaluation.configuration.displayName) is expired pull request $pullRequestId policies must be reevaluated"
                $isExpired = $true
                $policyRequeueUrl = "https://dev.azure.com/$org/$project/_apis/policy/evaluations/$($evaluation.evaluationId)?api-version=7.0-preview.1"
                $policyEvaluation = Invoke-RestMethod -Uri $policyRequeueUrl -Headers $headers -Method PATCH
                Write-Host $policyEvaluation
                $policyEvaluation
            }
        }
    }

    # If the build is expired, output the pull request details
    if ($isExpired) 
    {
        Write-Output "Pull Request ID: $($pullRequest.pullRequestId) has expired policies that were requeued"
    } else 
    {
        Write-Output "Pull Request ID: $($pullRequest.pullRequestId) IS ok"
    }
}
{{< / highlight >}}

This script is really simple, it uses standard PowerShell Invoke-RestMethod to **call api in Azure DevOps using standard PersonalAccessToken authentication**. We can decompose it in small parts, first of all authentication, just create an header to use in all calls to Azure DevOps Api, and call the pull request endpoint **to grab a reference to all active Pull Requests in that project**.

{{< highlight powershell "linenos=table,linenostart=1" >}}
$org = "name-of-your-org"
$project = "name-of-your-project"
$pat = "your-personal-access-token"

# Set the headers for the API call
$headers = @{
    "Content-Type" = "application/json"
    "Authorization" = "Basic $( [System.Convert]::ToBase64String([System.Text.Encoding]::ASCII.GetBytes(":$($pat)")) )"
}

# Set the API endpoint URL for pull requests
$pullRequestUrl = "https://dev.azure.com/$org/$project/_apis/git/pullrequests?status=active&api-version=6.1"

{{< / highlight >}}

Then you simply need to iterate in all resulting Pull Requests, for each one **just check if we have some Policy Evaluations**.

{{< highlight powershell "linenos=table,linenostart=1" >}}
foreach ($pullRequest in $pullRequests.value) 
{
    $projectId = $pullRequest.repository.project.id
    $pullRequestId = $pullRequest.pullRequestId

    $artifactId ="vstfs:///CodeReview/CodeReviewId/$projectId/$pullRequestId"
    $policyEvaluationUrl = "https://dev.azure.com/$org/$project/_apis/policy/evaluations?artifactId=$artifactId&api-version=7.0-preview.1"
 
    # Send the GET request to the API endpoint to get the build status of the pull request
    $policyEvaluation = Invoke-RestMethod -Uri $policyEvaluationUrl -Headers $headers -Method Get
{{< / highlight >}}
 
At this point we need to **verify if we really have some policies, iterate in all policies and check if some of them are expired**. If we have an expired policy, just use an api call to **re-queue it and run against the new version of target branch**.

{{< highlight powershell "linenos=table,linenostart=1" >}}
if ($policyEvaluation.count -gt 0) 
    {
        Write-Host "Pull request $pullRequestId has $($policyEvaluation.count) policy evaluations"
        foreach ($evaluation in $policyEvaluation.value) 
        {
            if ($evaluation.context.isExpired) {
                Write-Host "Policy $($evaluation.configuration.displayName) is expired pull request $pullRequestId policies must be reevaluated"
                $isExpired = $true
                $policyRequeueUrl = "https://dev.azure.com/$org/$project/_apis/policy/evaluations/$($evaluation.evaluationId)?api-version=7.0-preview.1"
                $policyEvaluation = Invoke-RestMethod -Uri $policyRequeueUrl -Headers $headers -Method PATCH
                Write-Host $policyEvaluation
                $policyEvaluation
            }
        }
    }
{{< / highlight >}}

The only difference is that this script **will skip all PR that are not related to the repository named jarvis**. This is done because this script is automatically triggered as soon as the develop branch for jarvis repository is updated, so we need to check only for PR related to that repository.

In a single TeamProject you can have **multiple repositories and each one can have a different pull request strategy**, so it is advisable to have a build that runs scheduled against all repositories and create a special build for each important repository **where you want your Pull Requests checks to be re-queued automatically as soon as the target branch changes**.

Automating mundane tasks with PowerShell and Azure DevOps API is a real time saver, especially **because you can schedule with pipeline triggers or simply scheduled at specific time** with little effort.

Happy Azure DevOps.

Gian Maria.