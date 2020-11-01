---
title: "Azure DevOps Pills: PowerShell in pipeline with Linux agents"
description: "If you include PowerShell in your pipeline, it can be executed in hosted Linux images because PowerShell Core is already installed"
date: 2020-11-01T13:12:42+02:00
draft: false
categories: ["AzureDevops"]
tags: ["AzDo", "Linux"]
---

This is a really basic fact, but it is often underestimated. PowerShell core is now available on Linux and this means that you can use PowerShell for your Azure DevOps pipeline even if the pipeline **will be executed on Linux machine**. If I have this task in a pipeline

{{< highlight yaml "linenos=table,linenostart=1" >}}
steps:
  - task: PowerShell@2
    displayName: Simple task
    inputs:
      targetType: inline
      script: |
        Write-Host "Simple task for simple stage pipeline"
        Write-Host "Value for variable Configuration is $(configuration) value for parameterA is ${{ parameters.ParameterA }}"
        Write-Host "Change Variable value configuration to 'debug'"
        Write-Host "##vso[task.setvariable variable=configuration]debug"
{{< / highlight >}}

I can schedule the pipeline on a Linux hosted agent, and everything runs smoothly.

![Running PowerShell task on Linux agent](../images/powershell-linux-agent.png)
***Figure 1:*** *Running PowerShell task on Linux agent*

As you can see from **Figure 1** task output clearly states that the task can **run PowerShell scripts on Windows, macOS or Linux.** Sadly enough, most people still associate PowerShell with Windows and underestimate the fact that it runs perfectly on Linux.

The advantage of PowerShell is simple, it runs now on every system, if you write script in PowerShell it will run on any system, **it is preinstalled in Windows and you can install in macOS or Linux with very little effort.**

If you are using Azure Hosted Agent, **PowerShell 7 is already preinstalled and it is already available for you to use**.

> If you need to know what software is installed on Hosted machine you can find the list [at this link](https://docs.microsoft.com/en-us/azure/devops/pipelines/agents/hosted?view=azure-devops&tabs=yaml)

If you are going to use your own Linux Agents, you need to manually install PowerShell on agent for task to run, but the net effect is the same: **Writing task in PowerShell gives you a powerful language to automate your pipeline task in every system**.

Gian Maria.
