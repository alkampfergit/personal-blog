---
title: "How to create a list of non upgradable software for winget"
description: "Winget is cool, but some of the packages are not really ready and sometimes it is better avoiding winget to update them"
date: 2021-06-27T08:00:00+02:00
draft: false
tags: ["Windows"]
categories: ["General"]
---

Winget is finally [here](https://www.codewrecks.com/post/general/winget-intro/) and we can, at least, using a package manager on windows **to simplify application management**. Everything is good, except that some packages are not ready to be upgraded. **As an example in my system I have python 2.7 and 3.x, winget always try to upgrade 3.x version at each run and messed up my installation**. At the end of the Nth upgrade of python my Visual Studio code was not able anymore to debug and run python.

> One of the problem of winget is that is not "PowerShell ready", it does not output object, it only output standard text.

In the snippet below I've tried to **parse winget upgrade output** to allow you to filter and manage all package to upgrade with standard PowerShell code.

Forgive me for my not polished PowerShell code, I've just tried a raw approach of parsing winget output and it seems to works.

{{< highlight powershell "linenos=table,linenostart=1" >}}
class Software {
    [string]$Name
    [string]$Id
    [string]$Version
    [string]$AvailableVersion
}

$upgradeResult = winget upgrade | Out-String

$lines = $upgradeResult.Split([Environment]::NewLine)

# Find the line that starts with Name, it contains the header
$fl = 0
while (-not $lines[$fl].StartsWith("Name"))
{
    $fl++
}

# Line $i has the header, we can find char where we find ID and Version
$idStart = $lines[$fl].IndexOf("Id")
$versionStart = $lines[$fl].IndexOf("Version")
$availableStart = $lines[$fl].IndexOf("Available")
$sourceStart = $lines[$fl].IndexOf("Source")

# Now cycle in real package and split accordingly
$upgradeList = @()
For ($i = $fl + 1; $i -le $lines.Length; $i++) 
{
    $line = $lines[$i]
    if ($line.Length -gt ($availableStart + 1) -and -not $line.StartsWith('-'))
    {
        $name = $line.Substring(0, $idStart).TrimEnd()
        $id = $line.Substring($idStart, $versionStart - $idStart).TrimEnd()
        $version = $line.Substring($versionStart, $availableStart - $versionStart).TrimEnd()
        $available = $line.Substring($availableStart, $sourceStart - $availableStart).TrimEnd()
        $software = [Software]::new()
        $software.Name = $name;
        $software.Id = $id;
        $software.Version = $version
        $software.AvailableVersion = $available;

        $upgradeList += $software
    }
}

$upgradeList | Format-Table

{{< / highlight >}}

Launching that script you can find that you are indeed able to **havea $upgradelist array of real PowerShell object containing all the software that needs upgrade on your system**. An example of the output is contained in Figure 1.

![Parse winget upgrade output to have array of PowerShell objects.](../images/winget-posh.png)

***Figure 1:*** *Parse winget upgrade output to have array of PowerShell objects.*

Thanks to this code, I can create an array of application **I do not want to update with winget**. The reason to avoid Winget upgrading every application is usually due to that application still not well supported in winged, but there are also reason to keep an older version of the software if you need to stick with that version.

{{< highlight powershell "linenos=table,linenostart=1" >}}
$toSkip = @(
'Microsoft.dotnetRuntime',
'Microsoft.dotnet',
'Python.Python.3',
"OpenWhisperSystems.Signal",
"Mozilla.Firefox",
"Spotify.Spotify")

foreach ($package in $upgradeList) 
{
    if (-not ($toSkip -contains $package.Id)) 
    {
        Write-Host "Going to upgrade package $($package.id)"
        & winget upgrade $package.id
    }
    else 
    {    
        Write-Host "Skipped upgrade to package $($package.id)"
    }
}
{{< /highlight >}}

Now I can simply launch this script periodically to automatically update only a selection of my installed application.

[Discussion is here https://github.com/alkampfergit/personal-blog/discussions/11](https://github.com/alkampfergit/personal-blog/discussions/11)

Gian Maria.
