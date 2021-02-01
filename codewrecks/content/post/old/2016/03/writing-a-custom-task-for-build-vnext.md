---
title: "Writing a custom task for Build vNext"
description: ""
date: 2016-03-16T23:00:37+02:00
draft: false
tags: [build,vNext]
categories: [Team Foundation Server]
---
I wrote on how to integrate [GitFlow and Semantic Versioning for my nuget packages](http://www.codewrecks.com/blog/index.php/2015/10/17/integrating-gitversion-and-gitflow-in-your-vnext-build/) thanks to GitVersion.exe and a simple powershell script, but still the solution is not perfect. The worst drawback is that you need to remember to include all needed PowerShell scripts and GitVersion.exe executable in project source code. This approach does not give best experience and clutter source code with build related executables.

Since the script is valid for any project, it would be  **a better solution to wrap it in a build task for the new vNext build system**. Even in this area, the new build system shines, because writing a task is really a breeze.

First of all install the [tfx-cli utility](http://www.codewrecks.com/blog/index.php/tag/tfx-cli/), then navigate in a folder of your pc, create a folder for the new task and use this command to create a skeleton for your first build task.

{{< highlight bash "linenos=table,linenostart=1" >}}


tfx build tasks create

{{< / highlight >}}

This command will ask you several information, at the end you will have a new folder, with the same name of the task you choose, containing a bunch of files.  **The most important file is called task.json , because it contains all the information needed by the build system to run your task**. Here is my json.file after modification.

{{< highlight js "linenos=table,linenostart=1" >}}


{
  "id": "4d26fc20-dcb5-11e5-80ed-77d9cb9f353c",
  "name": "GitVersion",
  "friendlyName": "GitVersion Semantic Versioning",
  "description": "Simple script to version your task with GitVersion",
  "author": "Gian Maria Ricci",
  "helpMarkDown": "This task simply calls a script that invoke Gitversion.Exe to calculate SemVer for your repository",
  "category": "Utility",
  "visibility": [
    "Build",
    "Release"
 ],
  "demands": [],
  "version": {
    "Major": "0",
    "Minor": "1",
    "Patch": "13"
  },
  "minimumAgentVersion": "1.91.0",
  "instanceNameFormat": "GitVersion $(message)",
  "inputs": [
    {
      "name": "NugetVersionVariableName",
       "type": "string",
       "label": "Nuget Version Variable Name",
       "defaultValue": "NugetVersion",
       "required": false,
       "helpMarkDown": "If you want nuget version in a variable like $(NugetVersion) just specify its name."
    }
 ],
  "execution": {
    "Node": {
      "target": "sample.js",
      "argumentFormat": ""
    },
    "PowerShell": {
      "target": "$(currentDirectory)\\version.ps1",
      "argumentFormat": "",
      "workingDirectory": "$(currentDirectory)",
      "platforms": ["windows"]
    }
  }
}

{{< / highlight >}}

This file is self explanatory; it just contains some properties, a list of the input parameter for the build task, and finally the script to run in node.js and in PowerShell. If you look at the code, I do not need any Node script, so I left the standard sample.js of the base file, but for PowerShell section I specified the version.ps1 files I’ve used to version my assembly. Powershell script is the very same of the previous example, I just changed the starting part to accept a parameter, the name of the build variable where the script will set the nuget package determined by GitVersion.exe. I also specified that the powershell runs only on windows platform.  **The nice aspect is I’m able to reuse the very same powershell script, with little modification**.

{{< highlight powershell "linenos=table,linenostart=1" >}}


[CmdletBinding()]
param(
    [Parameter(Mandatory=$false)][string] $NugetVersionVariableName = "NugetVersion"
)

{{< / highlight >}}

Now I copy GitVersion.exe and all dll in the very same directory of the script, so I do not need to include GitVersion.exe in my source code to calculate semantic versioning. The final step is **adding a package.json with npm to declare all the dependencies that are needed by the task to run**.

{{< highlight js "linenos=table,linenostart=1" >}}


{
  "name": "Git Version",
  "version": "0.1.3",
  "description": "Sample script to versioning assemblies",
  "author": "Ricci Gian Maria",
  "license": "None",
  "devDependencies": {
    "vso-task-lib": "^0.5.5"
  }
}

{{< / highlight >}}

The only package I need is the  **vso-task-lib, containing all the base dependencies for vNext build system**. When everything is finished I can upload the whole task directory with the command

{{< highlight bash "linenos=table,linenostart=1" >}}


tfx build tasks upload 

{{< / highlight >}}

 **This command asks for the folder where the task is located, and upload everything to VSTS account you are logged into** (you should have run tfx login to connect to your instance). It is really simple, and my new task is available to be used.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2016/03/image_thumb.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2016/03/image.png)

 ***Figure 1***: *Adding new custom task to a build*

In  **Figure 1** I showed a really simple build, that contains only my new task, the goal is verifying that it is able to execute giversion correctly and it is able to change variable NugetVersion.

From the log of the execution it can be verified that the script is actually launched from the task directory  **Executing the powershell script: C:\LR\MMS\Services\Mms\TaskAgentProvisioner\Tools\agents\1.96.3\tasks\GitVersion\0.1.13\version.ps1.** Gian Maria.
