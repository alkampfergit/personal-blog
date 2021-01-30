---
title: "Avoid using Shell command in PowerShell scipts"
description: ""
date: 2016-05-27T15:00:37+02:00
draft: false
tags: [devops,PowerShell]
categories: [DevOps,Team Foundation Server]
---
I have setup scripts that are used to install software, they are simply based on this paradigm

> The build produces a zip file that contains everything needed to install the software, then we have a script that accepts the zip file as parameter as well as some other parameters and does install sofwtare on a local machine

This simple paradigm is perfect, because  **we can manually install a software launching powershell, or we can create a Chocolatey package to automate the installation.** Clearly you can use the very same script to release the software inside TFS Release Management.

 **When PowerShell script runs in the RM Agent (or in a build agent) it has no access to the Shell.** This is usually the default, because the agents does not run interactively and usually in Release Management, PowerShell scripts are executed remotely. This fact imply that you should not use anything related to shell in your script. Unfortunately, if you looks in the internet for code to unzip a zip file with PowerShell you can find code that uses shell.application object:

{{< highlight powershell "linenos=table,linenostart=1" >}}


function Expand-WithShell(
    [string] $zipFile,
    [string] $destinationFolder,
    [bool] $deleteOld = $true,
    [bool] $quietMode = $false) 
{
    $shell = new-object -com shell.application

    if ((Test-Path $destinationFolder) -and $deleteOld)
    {
          Remove-Item $destinationFolder -Recurse -Force
    }

    New-Item $destinationFolder -ItemType directory

    $zip = $shell.NameSpace($zipFile)
    foreach($item in $zip.items())
    {
        if (!$quietMode) { Write-Host "unzipping " + $item.Name }
        $shell.Namespace($destinationFolder).copyhere($item)
    }
}

{{< / highlight >}}

This is absolutely a problem if you run a script that uses this function in a build or RM agent. **A real better alternative is a funcion that uses classes from Framework**.

{{< highlight powershell "linenos=table,linenostart=1" >}}


function Expand-WithFramework(
    [string] $zipFile,
    [string] $destinationFolder,
    [bool] $deleteOld = $true
)
{
    Add-Type -AssemblyName System.IO.Compression.FileSystem
    if ((Test-Path $destinationFolder) -and $deleteOld)
    {
          Remove-Item $destinationFolder -Recurse -Force
    }
    [System.IO.Compression.ZipFile]::ExtractToDirectory($zipfile, $destinationFolder)
}

{{< / highlight >}}

With this function you are not using anything related to Shell, and it can be run without problem even during a build or a release management. As you can see the function is simple and probably is a better solution even for interactive run of the script.

 **Another solution is using 7zip from command line, it gives you a better compression, it is free, but you need to install into any server where you want to run the script.** This imply that probably zip files are still the simplest way to package your build artifacts for deployment.

Gian Maria.
