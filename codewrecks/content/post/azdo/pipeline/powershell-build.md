---
title: "Continuous integration: PowerShell way"
description: "While Azure DevOps Pipeline or GitHub actions or whatever CI engine you choose can do most of the job with pre-made tasks, sometime going straight PowerShell can be the solution you need"
date: 2020-08-06T15:12:42+02:00
draft: true
categories: ["AzureDevops"]
tags: ["AzDo", "Pipeline"]
---

I'm a great fan of Azure DevOps pipelines, I use them extensively, but I also a fan of simple building strategies, not relying on some specific build engine.

> For Continuous Integration, being too much dependent on a specific technology could be limiting.

I've started CI with **many years ago with CC.NET** and explored various engines, from MsBuild to Nant then Psake, cake etc. I've also used various CI tools, from TFS to AzureDevOps to TeamCity and others. My overall reaction to those tools was usually good, but **I always feel bound to some specific technology**. What about a customer using something I do not know like Travis CI? Also, when you need to do CI at customer sites, it is hard to force a particular technology. It is too easy to tell to a customer: just use X because it is the best, when the reality is that your knowledge of X is really good so it is your first choice.

Since it is impossible to master all various build engines, **I often decide to go straight with basic PowerShell** creating a build that can entirely run on your machine.

Why PowerShell? The answer is simple, if you are in Windows Environment your IT people probably already knows PowerShell, **it is simple, it is widely used and is available on any Windows machine (now even in Linux)**. It is the language of choice for scripting in Windows, if you search for "how to do X in PowerShell" you surely find some pre-made solution to solve your problem. 

Another nice aspect of PowerShell is [PowerShell Gallery](http://www.codewrecks.com/post/general/powershell-gallery/) where you can **publish some common helper functions you usually reuse between builds**.

> PowerShell is probably the best approach in Windows to create a simple build that can run everywhere.

The best aspect of doing CI in PowerShell **is probably being able to debug and run almost everything from own computer**, no prerequisites, just include script in your source code and you are ready to go.

> Plain PowerShell based Continuous Integration is really flexible and can be run and debugged locally.

When you have your PowerShell script ready to go, **you can simply execute it in all major CI engines (Azure DevOps pipelines, GitHub actions, Travis Ci) with little effort**, you can move more easily between CI engines and you can obviously run everything manually.

The usual question is: how difficult is to to do Continuous Integration using only plain PowerShell? To answer this question I've created a sample with an ASP.NET application in Full framework with a database project and my goal is to have a minimum CI script that

1. Use Git Version to mark assembly with SemVer
2. Build my solution
3. Publish a web site
4. Modify the web.config to make configuration ready to be released
5. runs some unit tests.
6. Create a nice seven zipped file with everything needed to create a release

This is the very bare minimum for a standard build and it is quite simple once you create some utilities that can helps you in such common and mundane tasks. ** Now I usually create three distinct file: prebuild.ps1, CompileAndTest.ps1, postbuild.ps1.** The reason is simple, pre and post build script are devoted to CI related task (semver, zipping etc) and CompileAndTest.ps1 does compile and runs tests.

> Avoid a single big script file, separate your builds file in logical steps of your CI.

The reason for this separation is **the ability to choose which use with your CI Engine of choice**. You can go entirely with PowerShell, or you can only use pre and post build script and doing Build and Test directly with CI specific Tasks.

If you are interested you can find sample project [here in GitHub](https://github.com/alkampfergit/BasicAspNetForDeploy) and all helpers function are [published in PowerShell gallery](https://www.powershellgallery.com/packages/BuildUtils/0.1.9) while [utilities source code is as usual in GitHub](https://github.com/AlkampferOpenSource/powershell-build-utils).

## PreBuild script explained

Pre build script starts with parameters, then it proceed to load BuildUtils package. As I stated before, being able to publish common utilities in PowerShell Gallery makes everything simpler because you can reuse those function everywhere.

{{< highlight powershell "linenos=table,linenostart=1" >}}
param (
    [string] $configuration = "release"
)

Install-package BuildUtils -Confirm:$false -Scope CurrentUser -Verbose -Force
Import-Module BuildUtils
{{< / highlight >}}

When you have some nice utilities home made to perform CI the way you like it is really simple to create a build. My prebuild script can be reduced to this code

{{< highlight powershell "linenos=table,hl_lines=10-11,linenostart=1" >}}
$gitVersion = Invoke-Gitversion

...

$buildId = $env:BUILD_BUILDID
if (![System.String]::IsNullOrEmpty($buildId)) 
{
  Write-Host "Running in an Azure Devops Build"

  Write-Host "##vso[build.updatebuildnumber]BasicAspNetForDeploy - $($gitVersion.fullSemver)"
  Write-Host "##vso[task.setvariable variable=nugetVersion;]$($gitVersion.nugetVersion)"
}

  Update-SourceVersion -SrcPath "$runningDirectory/src" `
    -assemblyVersion $gitVersion.assemblyVersion `
    -fileAssemblyVersion $gitVersion.assemblyFileVersion `
    -assemblyInformationalVersion $gitVersion.assemblyInformationalVersion
{{< / highlight >}}

As you can see the script is really simple, I have an helper to run GitVersion then if I'm in an Azure Devops pipeline (my preferred CI engine) I can change the name of the build using gitversion. Finally I can change all assemblyinfo.cs and assemblyinfo.vb with semver number thans to utils Update-SourceVersion.

> PowerShell based CI scripts, are easy to read and easy to debug.

## Standard compile VS solution and run tests

Compiling a solution with MSBuild and run test with Nunit from powershell is really simple, the tricky part is usually know [where the latest version of MSBuild was installed](http://www.codewrecks.com/post/general/find-msbuild-location-in-powershell/) and run NUNit test from console runner. 

{{< highlight powershell "linenos=table,hl_lines=9-10,linenostart=1" >}}
$nugetLocation = Get-NugetLocation
set-alias nuget $nugetLocation 
nuget restore .\src

$msbuildLocation = Get-LatestMsbuildLocation
set-alias msb $msbuildLocation 
msb .\src\TestWebApp.sln /p:Configuration=release

Write-Host "executing publishing of web site with msbuild with version"
msb .\src\TestWebApp\TestWebApp.csproj /p:DeployOnBuild=true /p:WebPublishMethod=Package /p:PackageAsSingleFile=true /p:OutDir=".\$webSiteOutDir" /p:Configuration=$buildConfiguration

Write-Host "Running nunit tests with console runner"
$nunitConsoleRunner = GEt-NunitTestsConsoleRunner
set-alias nunit "$nunitConsoleRunner"

nunit ".\src\TestWebApp.Tests\Bin\$webSiteOutDir\TestWebApp.Tests.dll"
{{< / highlight >}}

As you can see, thanks to basic utility functions you can simply build your solution with few lines of code.

## Post build script

Finally my post build script package everything for the release, in this script I usually manipulate (if needed) config files to make them not environment dependent and creates zipped file for the release.

###----Manipulation of configuration file
$testWebAppPublishedLocation = "$runningDirectory\src\TestWebApp\$webSiteOutDir\_publishedWebSites\TestWebApp"
$configFile = "$testWebAppPublishedLocation\web.config"
$xml = [xml](Get-Content $configFile)
Edit-XmlNodes $xml -xpath "/configuration/appSettings/add[@key='Key1']/@value" -value "__SAMPPLEASPNET_KEY1__"
Edit-XmlNodes $xml -xpath "/configuration/appSettings/add[@key='Key2']/@value" -value "__SAMPPLEASPNET_KEY2__"
Edit-XmlNodes $xml -xpath "/configuration/connectionStrings/add[@name='db']/@connectionString" -value "__SAMPPLEASPNET_CONNECTION__"

$xml.save($configFile)
