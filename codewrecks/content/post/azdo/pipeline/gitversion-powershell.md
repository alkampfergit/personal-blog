---
title: "Running GitVersion in Azure DevOps pipeline with dontet tool"
description: "Reduce your dependency to third party task using only plain old PowerShell to accomplish Pipeline Task"
date: 2023-12-11T10:00:42+02:00
draft: false
categories: ["AzureDevOps"]
tags: ["PowerShell", "Pipeline"]
---

For me, running GitVersion as part of a Pipeline is a golden standard. I barely **remember a pipeline that does not use GitVersion** as first task. The reason is simple, it allows me, at least, to give a better naming to build names. Instead of having meaningless date base number I have a semantic build **that immediately gives me the idea of what was built**.

> At least GitVersion can give a better name to a build, so why not using it?

There are tasks in marketplace, and I've written one in the past to include GitVersion in your pipeline, but in these days, **the easiest way is to use dotnet tool, even if you are not using .net CORE**. It all begins with a file in repository called .config\dotnet-tools.json used by dotnet tool command to identify tooling needed for this repository. Here is a sample content.

{{< highlight json "linenos=table,linenostart=1" >}}
{
  "version": 1,
  "isRoot": true,
  "tools": {
    "gitversion.tool": {
      "version": "5.2.4",
      "commands": [
        "dotnet-gitversion"
      ]
    }
  }
}
{{< / highlight >}}

Then you **place classic GitVersion.yml config file in repository root** and you can insert these two simple tasks at the very beginning of the job in your yaml pipeline:

{{< highlight yaml "linenos=table,hl_lines=17,linenostart=1" >}}
- task: UseDotNet@2
  inputs:
    packageType: 'sdk'
    version: '3.x'

- task: PowerShell@2
  displayName: Git Version
  name: GitVersionTask
  inputs:
    targetType: 'inline'
    script: |
      dotnet tool restore
      dotnet tool run dotnet-gitversion /config GitVersion.yml
      $test = dotnet tool run dotnet-gitversion /config GitVersion.yml | Out-String | ConvertFrom-Json
      $nugetVersion = $test.NuGetVersionV2
      Write-Host "##vso[task.setvariable variable=NugetVersion;isOutput=true]$nugetVersion"
      Write-Host "##vso[build.updatebuildnumber]BuildPrefix - $nugetVersion"

{{< / highlight >}}

First task will **ensure that .NET core version 3 is available to the agent** while the second task is a simple PowerShell task that invoke git-version, parse its json output, **change build name using NugetVersion output from gitversion** and outputting the value to a variable called NugetVersion with isOuput=true to make it available to other jobs / stages of the same pipeline.

> Second taks also use the build.updatebuildnumber command to change build number to something semantic

With this simple piece of code you **do not need to install anything from the marketplace** and no prerequisites required on build agents, it just works out of the box. In this example **I'm calling GitVersion and do a manual parse of the output**, you can consult [GitVersion documentation](https://gitversion.net/docs/) to customize its usage to your need. I've found through the years, that manual parse is the easiest way to consume its output and do whatever you need to do, like changing build name, passing variables between stages or logging or whatever. 

As promised, build names are now much more meaningful.

![Builds now have semantic names](../images/build-summary.png)
***Figure 1***: *Builds now have semantic names*

I always have a nice number, suffix that allows me to understand what was build (unstable == develop, beta == hotfix/releases) and since we **name features prefixing with AzDo Work Item Id, I can immediately find related Work Item from name.** It is true that each build list branch that was build, but being able to determine version, branch an work item from only the name of the build is for me a great plus.

If you still do not use GitVersion is time to give it a try.

Gian Maria.