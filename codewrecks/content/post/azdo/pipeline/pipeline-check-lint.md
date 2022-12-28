---
title: "Azure DevOps: check typescript linting for a Pull Request"
description: "Running custom code check during Pull Requests can help to improve quality of code, let's see how you can run some custom checks with Aure DevOps pipeline."
date: 2022-12-30T07:00:42+00:00
draft: false
categories: ["AzureDevops"]
tags: ["AzDo"]
---

Pull Requests is the moment when new code undergo formal review to verify that **it mets the basic quality requirement decided by the team**. Most of the work can be done automatically, thanks to Azure DevcOps pipeline and various tools.

Some of the checks can be fully automated by special **addin, like integration with SonarCloud** so you basically does not need to do anything and you have some nice checks done to new code during PR. Sometimes you want to run custom code or checks, and it is really simple to do with few powershell lines and pipelines.

> Running custom checks on new code in a PR is a good way to ensure code quality.

The goal is running checks only on files that are changed in PR, **running analysis of whole codebase is misleading, because we need only to check new code**. Often you use tools that does not allow to run analysis only on the portion of the file that changed, but a whole file is analyzed. In such a situation usually it is **acceptable to run analysis on all changed file, it means that if you touch a file you should remove all warning if possible, a practice that is not so bad.**

You need to remember that **when a pipeline runs for a Pull Request, it runs against a commit that is the result of the merge of PR branch and Target branch**. This means that you have the current commit that contains all files modified in the branch you are reviewing, so it is simple to run a git command to get list of modified files.

{{< highlight powershell "linenos=table,linenostart=1" >}}
$simpleBranchName = "$(System.PullRequest.TargetBranch)".Substring("refs/heads".length + 1)
$refsBranchName = "origin/$simpleBranchName"
$changedFiles = git diff $refsBranchName --name-only
{{< / highlight >}}

The above piece of PowerShell code simply does some manipulation for the actual Pull Request target branch (Actually removing the refs/heads part), then use **git diff command with --name-only options to get the list of files changed in the pull request**.

Once you have such a list you can as an example run a linter against each file to verify if we are **introducing some bad code**. As an example in the following few lines of PowerShell I simply use a foreach to iterate in **all files changed in the PR**. PowerShell is really powerful and already put all git command output in an array of string, each one containing one changed file. 

{{< highlight powershell "linenos=table,linenostart=1" >}}
foreach ($file in $changedFiles) {
 Write-Host "Checking lint on: $sourceDirectory/$file"
    npm run lint "$sourceDirectory/$file"
    if ($? -eq $false) {
      [void]$errors.Add("Linting error on: $sourceDirectory/$file ");
    }
{{< / highlight >}}

If you want to analyze only changed code and **not the entire file** you can use a different syntax of diff command that allows you to get only diff of changed file. **This kind of analysis is less useful, because you see portion of the file, and language analyzers usually does not work on partial file**. But there are scenarios where it is useful:

> If you have custom tool to scan new code for secrets or to detect other sensitive information, running only against new code is really useful

{{< highlight powershell "linenos=table,linenostart=1" >}}
foreach ($file in  $changedFiles) {
  Write-Host '-----------------------------------------------'
  Write-Host "Anlyzing file $file"
  $addedLines = git diff $refsBranchName -- $file | Where-object {$_.StartsWith('+') -and -not $_.StartsWith("+++")} | Foreach-Object {$_.TrimStart('+', ' ')}
  Write-Host $addedLines
}
{{< / highlight >}}

This works because you can filter out all lines that starts with a single + and not three +++ (it is a line that contains the name of the file). Then you can **trim the plus char so you have all the new code that was added in the Pull Request**. This information can be used to scan for secrets, etc. 

If you find that there is something wrong with the new code, you can use **##vso style output to create an error message, also you can exit(1) (exiting with an error code) to signal to the pipeline that something failed.**.

{{< highlight powershell "linenos=table,linenostart=1" >}}
Write-Host "##vso[task.logissue type=error]$message"
{{< / highlight >}}

As you can see it is really simple to create custom check for new code in Pull Requests thanks to Azure DevOps pipeline.

Gian Maria.
