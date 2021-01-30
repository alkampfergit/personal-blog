---
title: "Run Pester in VSTS Build"
description: ""
date: 2017-05-28T08:00:37+02:00
draft: false
tags: [build,PowerShell]
categories: [Team Foundation Server]
---
I’m not a great expert of PowerShell, but during last years I’ve written some custom utilities I’m using for various projects. The main problem is that I’ve scattered all these scripts on multiple projects and usually I need time to find the latest version of a script that does X.

> Scattering PowerShell scripts all around your projects lead to error and a maintenance nightmare

To avoid this problem,  **the obvious solution is starting a consolidation of PowerShell scripts and the obvious location is a Git repository hosted in VSTS**. Now that I’m starting script consolidation, I want also to create some Unit Test With Pester to helps me developing and obviously I want Pester Unit Tests to run inside a VSTS Build.

I had some problems running inside Hosted Build, because I got lots of errors when I tried to install Pester module. Luckly enough my friend [@turibbio](https://twitter.com/turibbio?lang=en)  gave me [this link](https://david-obrien.net/2017/03/vsts-powershell-modules/) that helps me to solve the problem.

My final script is

{{< highlight powershell "linenos=table,linenostart=1" >}}

Param(
    [string] $outputFile = 'TestRun.xml'
)
Install-PackageProvider -Name NuGet -Force -Scope CurrentUser
Install-Module -Name Pester -Force -Verbose -Scope CurrentUser

Import-Module Pester
Invoke-Pester -OutputFile $outputFile -OutputFormat NUnitXml

{{< / highlight >}}

This simple script accepts only a single parameter, the output file for the test, it install the package provider nuget, then it install pester, and finally import pester module and invoke pester on the current directory.

> While VSTS build system is really simple to extend, it is better to create a script that runs all test, so you can use both during local development and during VSTS Buidl

 **To have my test to be imported in VSTS build results, I’ve configured pester to output the file in NunitXml format.** Creating a build is really simple, and it is composed of only three tasks.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2017/05/image_thumb-12.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2017/05/image-12.png)

 ***Figure 1***: *Simple three step builds to run Pester tests on my PowerShell Scripts*

As you can see I use the GitVersion task to have a nice descriptive version for my build; Pester is run a PowerShell task and finally Publish Test Results task is used to upload test result to the result of the build. Now I have a nice build results that have a GitVersion semantic name and also have the summary of the tests

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2017/05/image_thumb-13.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2017/05/image-13.png)

 ***Figure 2***: *Result of Pester Test run is included in build.*

The ability to run PowerShell scripts inside a build, and publishing test results from various output format is what makes VSTS really simple to use to create build for every language, not only for.NET or Java but also for PowerShell.

Gian Maria.
