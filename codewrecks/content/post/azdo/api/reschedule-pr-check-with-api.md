---
title: "Azure Devops Api - Re-Queue Pull Request Checks"
description: "Pull Request Checks are a perfect way to verify quality of your code before merging it into the main branch. Lets discover how to re-queue checks using Azure DevOps Api if you need a re-evaluation"
date: 2023-02-21T07:12:42+02:00
draft: false
categories: ["AzureDevOps"]
tags: ["Api"]
---

Pull Requests checks are a perfect gate to keep your code quality High. The easiest way to **perform a check is to do something inside a standard pipeline and then use that pipeline in branch policies**. This will allow you to prevent people to push on the main develop branch (main/master/develop) and be forced to do a pull request against that branch and wait for the checks to complete. 

> Remember that checks on a Pull Request actually runs on the result of the merge between source and target branch. 

Azure DevOps automatically gives you the option to re-queue checks if the branch to be merged changes, after all if the branch changes you need to re-run all checks to verify the new code. Sometimes it can be interesting to re-queue all checks **when target branch changes not only when source branch changes.**. It is true that target branch does not involve new code, but sometimes you can have refactor or some other code changes in target branch that makes checks fails on merge result. As an example you can **have a new usage of a function in the branch under PR, target branch changed with a commit that rename that function, and the code does not compile**. 

> To be sure that the code under PR will pass all test, you need to re-queue checks when target branch changes.

![Configuration of build policies](../images/branch-protection-checks.png)

***Figure 1***: *Configuration of build policies*

As you can see in **Figure 1** I've configured a pipeline to run for every pull request against develop branch. The two highlighted options are used to **Automatically requeue a new pipeline run as soon as the source branch changes (1)** and **automatically invalidate the check when target branch changes (2)**. This means that every time that a developer commit a new change to the source branch, a new run will be queued, but when target branch changes (ex develop) the check will be only invalidated, and not re-queued.

This can be surprising because I'd like all checks to be re-executed whenever source or target branch changes, but actually **you can only mark check as expired when target branch changes**. Let's see on how we can solve the problem.

> To re-queue checks when target branch changes you can use Azure DevOps Api

To create a quick experiment, the quickest way is creating a script to interact with Azure DevOps Api and actually **the easiest solution is using PowerShell because it runs both on Windows and Linux and it is already installed on Azure DevOps agents**.

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

# Send the GET request to the API endpoint to get the pull requests
$pullRequests = Invoke-RestMethod -Uri $pullRequestUrl -Headers $headers -Method Get

# Iterate through the pull requests
foreach ($pullRequest in $pullRequests.value) 
{
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

Then you simply need to iterate in all resulting Pull Requests, for each one **just check if we have some Policy Evaluations**

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

Thanks to this simple script with few lines of PowerShell I can simply automate the mundane task **of re-queue all Pull Requests checks when target branch changes**. This is important because the team really rely on PR checks to have the confidence that some basic checks are performed before merging the code in target branch.

As usually Azure DevOps shows its flexibility, just some **call to the REST API and you can automate whatever repetitive task for your  account**. 

Gian Maria.