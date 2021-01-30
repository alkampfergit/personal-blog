---
title: "Writing a VSTS  TFS task that uses 7zip"
description: ""
date: 2017-07-29T07:00:37+02:00
draft: false
tags: [build,VSTS]
categories: [Visual Studio ALM]
---
Writing a Build / Release task for VSTS / TFS is really simple, but when you need third party software you need to be aware of license issue.  **As an example I have a small task that uses 7zip under the hood to compress / extract with the fantastic 7zip format.** 7zip is good because, even if it uses more processing power to compress files, the result is often really smaller than a standard zip, and this is especially good for build agent that are behind a standard ADSL (300 Kbs upload speed). To create a task that uses 7zip you could simply include 7zip executable in your task, but this can lead to problem for licensing.

> Whenever you include executables / libraries in your task you need to check license to verify you have the right to redistribute them.

When you have a task that depends on software that is public, even with a  GNU license, but you do not want to spend too much time to understand complex licensing and / or redistributable right,  **the simplest path is downloading the tool during task run.** Here is the relevant parts of my script

{{< highlight powershell "linenos=table,linenostart=1" >}}


 [Parameter(Mandatory=$false)][string] $sevenZipExe = ".\7z\7za.exe"

...

if (-not (test-path $sevenZipExe)) 
{
    Write-Output "7zip not present, download from web location"
    Invoke-WebRequest -Uri "http://www.7-zip.org/a/7za920.zip" -OutFile "$runningDirectory\7zip.zip"
    Write-Output "Unzipping $runningDirectory\7zip.zip to directory $runningDirectory\7z"
    Expand-WithFramework -zipFile "$runningDirectory\7zip.zip" -destinationFolder "$runningDirectory\7z" -quietMode $true 
} 

{{< / highlight >}}

The solution is really simple, I allow the caller to specify where 7zip is located, then if the 7za executable is not found, I simply download it from the internet a known version and uncompress locally. Then only trick is in the function Expand-WithFramework, that is used to expand the.zip file once downloaded, using the standard classes from.NET Framework.

{{< highlight powershell "linenos=table,linenostart=1" >}}


function Expand-WithFramework(
    [string] $zipFile,
    [string] $destinationFolder,
    [bool] $deleteOld = $true,
    [bool] $quietMode = $false
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

This technique gives me two advantage and a disadvantage. The two advantages are, I’m not including any third party executables in my task, so I have no problem in making it public and the task is really small and simple to run, because it does not contain any executable.  The disadvantage is that the machine running the build should have internet connection to download 7zip if it is not installed locally. Since I’m working mainly with VSTS, all my build machines have internet connection so this is not a problem.

Gian Maria.
