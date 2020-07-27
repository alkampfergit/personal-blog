---
title: "How to locate most recent MSBuild.exe using PowerShell"
description: "To build Full Framework projects you need MsBuild.exe tool, knowing where the latest version is installed is useful if you want to build with PowerShell"
date: 2020-07-26T08:00:00+02:00
draft: false
tags: ["PowerShell"]
categories: ["DevOps"]
---

If you want to build a Full Framework based project from PowerShell, **you need to locate MsBuild.exe tool tool to compile your project**. You can indeed "open developer command prompt" to have a CommandLine with all needed tools in the %PATH%, but if you want to create a generic PowerShell script that uses MsBuild, knowing its location is probably a must.

There are some solutions in the internet, but **I've found a nice module called VSSetup that can helps locating MsBuild** because it gives you interesting information for every version of Visual Studio installed in the system (from VS2017 and subsequent versions).

> I've used in the past simple functions that looks in standard c:\program files(x86) locations, but it is prone to error (ex installing VS not on the C drive)

VSSetup module can be easily installed.

```powershell
Install-Module VSSetup -Scope CurrentUser -Force
```

Once you installed VSSetup module, you can use some nice commands such Get-VSSetupInstance to list all installed version of visual studio

![Get-VSSetupInstance](images/../get-vsssetupinstance.png)
***Figure 1***: *Get-VSSetupInstance in actions*

As you can see in Figure 1 **this command immediately lists all your installed versions of Visual studio in your running system**. If you have preview version you need to add argument -Prerelease to retrieve information even for pre-release versions.

If you sort descending by InstallationVersion the first element will be latest version, then you can **easily locate latest version of MsBuild.exe because you have the exact installation path of VS**. Here is the full function:

{{< highlight powershell "linenos=table,linenostart=1" >}}
function Get-LatestMsbuildLocation
{
  Param 
  (
    [bool] $allowPreviewVersions = $false
  )
    if ($allowPreviewVersions) {
      $latestVsInstallationInfo = Get-VSSetupInstance -All -Prerelease | Sort-Object -Property InstallationVersion -Descending | Select-Object -First 1
    } else {
      $latestVsInstallationInfo = Get-VSSetupInstance -All | Sort-Object -Property InstallationVersion -Descending | Select-Object -First 1
    }
    Write-Host "Latest version installed is $($latestVsInstallationInfo.InstallationVersion)"
    if ($latestVsInstallationInfo.InstallationVersion -like "15.*") {
      $msbuildLocation = "$($latestVsInstallationInfo.InstallationPath)\MSBuild\15.0\Bin\msbuild.exe"
    
      Write-Host "Located msbuild for Visual Studio 2017 in $msbuildLocation"
    } else {
      $msbuildLocation = "$($latestVsInstallationInfo.InstallationPath)\MSBuild\Current\Bin\msbuild.exe"
      Write-Host "Located msbuild in $msbuildLocation"
    }

    return $msbuildLocation
}
{{< / highlight >}}

The function is really simple, it just uses the Get-VSSetupInstance to locate all visual studio installed version, sort by version, then it got the location of msbuild.exe. **From VS2017 and VS2019 it seems on my machines that the location is different, VS2017 uses 15.0 subdirectory while VS2019 seems to use Current directory**. Feel free to point me example where this assumption is not working (maybe some installation options can change msbuild location)

It is actually published in the BuildUtils module so you can install and used easily with the following instructions.

```powershell
# Be sure to have previously installed VSSetup module
#Install-Module VSSetup -Scope CurrentUser -Force

#Intall Build utils ommand
Install-Module BuildUtils -Scope CurrentUser -Force

$msbuildLocation = Get-LatestMsbuildLocation
set-alias msb $msbuildLocation 
msb yoursolution.sln
```

Being able to locate latest MSBuild version on a machine is the starting point to create a simple build that is based only on PowerShell.

Gian Maria.