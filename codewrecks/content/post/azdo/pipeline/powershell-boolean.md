---
title: "Passing boolean parameters to PowerShell scripts in Azure DevOps Pipeline"
description: "If you need to call PowerShell scripts form Azure DevOps pipeline you need to pay attention to boolean parameters."
date: 2021-08-08T20:00:00+02:00
draft: false
categories: ["AzureDevops"]
tags: ["AzDo", "Pipeline"]
---

Let's start from the problem, I have an Azure DevOps pipeline that calls a PowerShell script and the team needs to change the pipeline allowing **a boolean parameter to be passed to the PowerShell script when you queue the pipeline**. The first tentative produces this error:

{{< highlight powershell "linenos=table,linenostart=1" >}}
C:\a\_work\56\s\build.dotnet.ps1 : 
Cannot process argument transformation on parameter 'forceInstallPackage'. Cannot 
convert value "System.String" to type "System.Boolean". 
Boolean parameters accept only Boolean values and numbers, 
{{< / highlight >}}

The original code of the pipeline is the following one.

{{< highlight yaml "linenos=table,linenostart=1" >}}
parameters:

...

- name: force_install_packages
    displayName: 'Force installation of PowerShell build utils module'
    default: false
    type: boolean
  
variables:

- name: ForceInstallPackages
  value: ${{ parameters.force_install_packages }}

...

jobs:
- job: Build_net
  
  - task: PowerShell@2
    name: Build_powershell
    displayName: "Build .NET in PowerShell"
    continueOnError: false
    inputs:
      targetType: filePath
      filePath: $(Build.SourcesDirectory)/build.dotnet.ps1 
      arguments: -Configuration $(BuildConfiguration) -deployWeb $true -forceInstallPackage $(ForceInstallPackages) ...

{{< / highlight >}}

This is a simple trick I taught to people, create a Parameter (it allows you to specify the value at queue time), then create a variable that reference the parameter so **everything in the pipeline is referenced with $(variableName) syntax**. But in this situation we have a problem, a boolean variable will contain real true/false value but when you convert to a variable it will become a string. If you pass variable value to a **PowerShell boolean value it will throw error because it expects $true or $false.**

> PowerShell boolean values can be converted from normal string containing $true or $false

The solution is simple, just prepend $ character to the variable

{{< highlight yaml "linenos=table,hl_lines=8,linenostart=1" >}}
 - task: PowerShell@2
    name: Build_powershell
    displayName: "Build .NET in PowerShell"
    continueOnError: false
    inputs:
      targetType: filePath
      filePath: $(Build.SourcesDirectory)/build.dotnet.ps1 
      arguments: -Configuration $(BuildConfiguration) -deployWeb $true -forceInstallPackage $$(ForceInstallPackages) 
      workingDirectory: $(Build.SourcesDirectory)

{{< / highlight >}}

As you can see in line 8 we have a double dollar sign, the first one is a standard Dollar char the second one is used to reference variable ForceInstallPackage. **This trick is used to pass the correct value to PowerShell because it will prepend dollar sign to string true/false variable value**.

Now we can just queue the pipeline for another run.

![Parameter is available at queue time](../images/queue-boolean-parameters.png)

***Figure 1:*** *Parameter is available at queue time*

As you can see Force installation of PowerShell build utils module is rendered as a checkbox (it is a boolean parameter) but it is passed to PowerShell script correctly.

Gian Maria.