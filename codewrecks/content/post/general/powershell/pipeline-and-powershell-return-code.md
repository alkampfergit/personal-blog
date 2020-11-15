---
title: "How to handle  errors in PowerShell script used in Azure DevOps pipeline"
description: "If you decide to use PowerShell for your build and then use it in Azure DevOps pipeline you should pay attention to manage error code"
date: 2020-11-15T08:00:00+02:00
draft: false
tags: ["PowerShell"]
categories: ["AzureDevOps"]
---

Building with PowerShell or other scripting engine is a really nice option because you can **reuse the script in almost any Continuous Integration engine** with a minimal effort, but sometimes there are tools that causes some headache.

I had problem with tooling like yarn and npm when they are run in Azure DevOps pipeline, the problem is that **when the tool emit a warning, pipeline engine consider it an error and make the build fails**. This happens usually because it is common to run PowerShell scripts in Azure DevOps pipeline with the option failOnStdErr to true

{{< highlight yaml "linenos=table,hl_lines=8,linenostart=1" >}}
- task: PowerShell@2
  displayName: "Execute build file to create release"
  inputs:
    targetType: filePath
    filePath: $(Build.SourcesDirectory)/src/Planner/build.ps1
    workingDirectory: $(Build.SourcesDirectory)/src/Planner
    arguments: -updateBuildNumber ${{parameters.updateBuildNumber}} -configuration ${{parameters.configuration}}
    failOnStderr: true
{{< / highlight >}}

> Option failOnStdErr is nice but it can lead to unwanted consequences if the tool output something to error console.

Usually failOnStdError is set to true, thus if a tools write in the error stream task is considered to be failed. This assumption seems to be always true, after all, if the script output some error to console why not considering the entire task failed? This assumption is wrong with **some tools that seems to output normal warning in stdErr output or in some way that is detected as error by Azure DevOps pipeline engine.** With such tools your task is considered failed even if the tool simply generated only warnings. (**Figure 1**)

![Warning treated as error from pipeline engine](../images/warning-error-inside-pipeline.png)
***Figure 1:*** *Warning treated as error from pipeline engine*

As you can see from ***Figure 1*** npm build tool is emitting a warning, but pipeline engine detect it as error and the task failed. My first reaction was to try to redirect warning from npm with some trick found in internet but nothing works. The I realized that I was **lazy and I didn't correctly detect error in my script, letting pipeline do the dirty work**.

 > When you create a build script you should handle tools error correctly and not rely on pipeline engine or anything else.

 Writing scripts and letting the task fail on error in standard output is also not human friendly. You are requiring **that the people that runs a manual build looks at the whole output for errors to understand if the build really failed**. Thanks to PowerShell the solution is obvious: Just check some special variable that stores result of last operation like $?

{{< highlight powershell "linenos=table,hl_lines=1,linenostart=1" >}}
if ($false -eq $?)
{
  Write-Error "Msbuild exit code indicate build failure."
  Write-Host "##vso[task.logissue type=error]Msbuild exit code indicate build failure."
  exit(1)
}
{{< / highlight >}}

As you can see from line 1, after you run MsBuild, npm, yarn or any other tool, you can check the special variable $? that contains $true or $false depending on the result of latest PowerShell operation. This is correct for any operation you do in PowerShell, and you can also argue that, for normal external tool, you should probably check **$LastExitCode that contains exit code of last program launched from PowerShell.**

In my specific situation for MsBuild, yarn and npm, I've verified that $? works well so **I've decided to use it instead of $LastExitCode**. If $? is not true I write an error to the host, then write a special pipeline command that makes task fails. 

This gives me the flexibility of creating my build entirely in PowerShell but I'm still able to decide what is a warning and what is an error, and gives me **the power to decide when the task is considered to be failed, not relying on the failOnStdErr option, that should always set to false**.

Gian Maria.
