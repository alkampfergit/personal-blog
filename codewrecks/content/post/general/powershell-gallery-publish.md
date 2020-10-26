---
title: "Automatic publish PowerShell Gallery with GitHub Actions"
description: "Automate publishing PowerShell gallery functions with GitHub actions to publish every commit in official and pre-release packages"
date: 2020-10-26T18:00:00+02:00
draft: false
tags: ["PowerShell"]
categories: ["DevOps"]
---

Publishing [PowerShell helper functions](http://www.codewrecks.com/post/general/powershell-gallery/) to PowerShell gallery is a good solution to **maximize reuse on Build and general Scripting for DevOps mundane tasks.** On [this GitHub repository](https://github.com/AlkampferOpenSource/powershell-build-utils) I've put some simple build utilities that can **be published on PowerShell gallery**.

To streamline the process I've decided to **automate publish process with GitHub actions**, because this is the typical scenario where GH Actions shine. First of all I've reorganized my sources to create a **single PowerShell file for each function, then I've found this [excellent post](https://evotec.xyz/powershell-single-psm1-file-versus-multi-file-modules/) that explain how to combine all files into a unique file to maximize performances.**

The trick is simple, first of all I created a file called BuildUtils.psd1.source that contains **PowerShell module definition** but with a couple of placeholder for version and pre-release tag. This allow me to read the file, **use GitVersion to determine semver** substitute the placeholder on template file and finally write definition file with correct version to publish module to PowerShell gallery.

Here is the template, with angular like placeholders.

{{< highlight powershell "linenos=table,hl_lines=2 12,linenostart=1" >}}
@{
	RootModule = 'buildUtils.psm1'
	ModuleVersion = '{{version}}'
	GUID = 'a6f44f17-8d42-4031-85e3-63a9146b76c0'
	Author = 'Ricci Gian Maria'
	Description = 'Some simple functions that can be used for build automation'
	CompanyName = 'Ricci Gian Maria'
	Copyright = '(c) 2020 Ricci Gian Maria. All rights reserved.'

	PrivateData = @{
    PSData = @{
      Prerelease = '{{preReleaseTag}}'
    }
  }
}
{{< / highlight >}}

A simple PowerShell file called publish.ps1 does the heavy work, it scans source directory for all PowerShell files, combines all the files into a single file, reads previous placeholder file, substitutes the version, saves correct definitions and **finally publish the package**.

> Automating package publish routine allows you to simply push to GitHub and wait few seconds for the new version to be available.

{{< highlight powershell "linenos=table,linenostart=1" >}}
# https://evotec.xyz/powershell-single-psm1-file-versus-multi-file-modules/
param (
    [string] $version,
    [string] $preReleaseTag,
    [string] $apiKey
)

$scriptPath = split-path -parent $MyInvocation.MyCommand.Definition
$srcPath = "$scriptPath\src";
Write-Host "Proceeding to publish all code found in $srcPath"

$outFile = "$scriptPath\BuildUtils\BuildUtils.psm1"
if (Test-Path $outFile) 
{
    Remove-Item $outFile
}

if (!(Test-Path "$scriptPath\BuildUtils")) 
{
    New-Item "$scriptPath\BuildUtils" -ItemType Directory
}

$ScriptFunctions = @( Get-ChildItem -Path $srcPath\*.ps1 -ErrorAction SilentlyContinue -Recurse )
$ModulePSM = @( Get-ChildItem -Path $srcPath\*.psm1 -ErrorAction SilentlyContinue -Recurse )
foreach ($FilePath in $ScriptFunctions) {
    $Results = [System.Management.Automation.Language.Parser]::ParseFile($FilePath, [ref]$null, [ref]$null)
    $Functions = $Results.EndBlock.Extent.Text
    $Functions | Add-Content -Path $outFile
}
foreach ($FilePath in $ModulePSM) {
    $Content = Get-Content $FilePath
    $Content | Add-Content -Path $outFile
}
"Export-ModuleMember -Function * -Cmdlet *" | Add-Content -Path $outFile

# Now replace version in psd1

$fileContent = Get-Content "$scriptPath\src\BuildUtils.psd1.source"
$fileContent = $fileContent -replace '{{version}}', $version
$fileContent = $fileContent -replace '{{preReleaseTag}}', $preReleaseTag 
Set-Content "$scriptPath\BuildUtils\BuildUtils.psd1" -Value $fileContent  -Force

Publish-Module `
    -Path $scriptPath\BuildUtils `
    -NuGetApiKey $apiKey `
    -Verbose -Force

{{< / highlight >}}

Thanks to this simple file, publishing code to PowerShell gallery is just a matter of determine right version number and pre-release suffix and call publish function. **Thanks to GitHub actions, automating this task is really simple**. This is really cool because you can publish every commit on the Gallery as pre-release version.

{{< highlight YAML "linenos=table,linenostart=1" >}}
# This is a basic workflow to help you get started with Actions

name: Publish

# Controls when the action will run. Triggers the workflow on push or pull request
# events but only for the master branch
on:
  push:
    branches: [ "master", "develop", "release/**", "feature/**", "hotfix/**" ]
  pull_request:
    branches: [ develop ]

# A workflow run is made up of one or more jobs that can run sequentially or in parallel
jobs:
  # This workflow contains a single job called "build"
  build:
    # The type of runner that the job will run on
    runs-on: windows-latest

    # Steps represent a sequence of tasks that will be executed as part of the job
    steps:
      # Checks-out your repository under $GITHUB_WORKSPACE, so your job can access it
      - uses: actions/checkout@v2
        with:
          fetch-depth: 0

      # Runs 
      - name: Publish with powershell
        env:
          API_KEY: ${{ secrets.API_KEY }}
        run: |
          dotnet tool restore
          $gvOutput = dotnet tool run dotnet-gitversion /config GitVersion.yml | Out-String | ConvertFrom-Json
          $preLabel = $gvOutput.NuGetPreReleaseTagV2

          $preReleaseTag = "-" + $preLabel
          Write-Host "Publishing -version " + $gvOutput.MajorMinorPatch + "-preReleaseTag " + $preReleaseTag + " -apiKey xxx"
          .\publish.ps1 -version $gvOutput.MajorMinorPatch -preReleaseTag $preReleaseTag -apiKey $env:API_KEY
{{< / highlight >}}

With this simple action, at each commit **dotnet tool restore will install gitversion, then gitversion is run to determine SemVer numbers and publish.ps1 files is called to publish everything**. Now I only need to use GitFlow and when my code is pushed to GitHub it will be automatically published on the gallery. Each push on master will release an official version, all other branches are published as pre-release version.

> Thanks to GitFlow you can determine semantic versioning with few lines of code

As you can see, everything is correctly pushed on the Gallery.

![Pre release and stable version automatically published](../images/powershell-published-gh.png)
***Figure 1:*** *Pre release and stable version automatically published*

With this method, managing PowerShell library to be used in multiple project is a breeze.

Gian Maria.
