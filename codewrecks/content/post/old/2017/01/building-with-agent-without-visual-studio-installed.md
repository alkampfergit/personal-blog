---
title: "Building with agent without Visual Studio installed"
description: ""
date: 2017-01-16T17:00:37+02:00
draft: false
tags: [build]
categories: [Tfs]
---
I had a build that runs fine on some agents, then I try running the build on a different agent but the build failed with the error.

> Error MSB4019: The imported project “C:\Program Files (x86)\MSBuild\Microsoft\VisualStudio\v14.0\WebApplications\Microsoft.WebApplication.targets” was not found

The problem originated by the fact that  **the build was configured to compile with VS2015 and use VS2015 test runner, but in build machine the only version of Visual Studio installed is VS2013**.

For various reason I do not want to install VS 2015 on that build agent, so I tried to manually configure the agent to have my build and my unit tests running without the need of a full VS 2015 installation.

> Warning: this technique worked for my build, but I cannot assure that it would work for your build.

## 

## Step 1: Install MSbuild 14 and targets

First of all I’ve installed [Microsoft Build tools 2015](https://www.microsoft.com/en-us/download/details.aspx?id=48159) to have the very same version of MSBuild that VS2015 uses, but  **this not enough, because the build still complains that it was unable to find Microsoft.WebApplication.targets.** The solution was copying the entire directory C:\Program Files (x86)\MSBuild\Microsoft\VisualStudio\v14.0 from my developer machine (where everything compiles perfectly) to the very same directory of my build server.

This solution usually works, because you are actually do a manual copy of all.targets that are needed by MsBuild to compile the solution (Asp.Net, etc etc). Now the source code compiles, but I’ve an error during test execution.

## Step 2: Execute test with Visual Studio Test runner

Now the Test action failed with this error

> System.IO.FileNotFoundException: Unable to determine the location of vstest.console.exe

Since I’ve not installed Visual Studio 2015 test runner is missing and tests could not execute.  To solve this problem I’ve installed [Visual Studio 2015 agent](https://www.microsoft.com/en-us/download/details.aspx?id=48152)s, but the error is still there, even if I checked that the test runner was correctly installed. After some googling I’ve discovered that I need to modify a Registry Key called  **HKEY\_LOCAL\_MACHINE\SOFTWARE\Wow6432Node\Microsoft\VisualStudio\14.0** adding a simple string value named  **ShellFolder** that points to the standard Visual Studio directory:  **C:\Program Files (x86)\Microsoft Visual Studio 14.0\** [![image](https://www.codewrecks.com/blog/wp-content/uploads/2017/01/image_thumb.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2017/01/image.png)

 ***Figure 1***: *New registry key needed to the build agent to locate test runner.*

After this last modification the solution builds and all test runs perfectly without VS 2015 installed on the build machine.

*Please remember that this solution could not work for your environment.  The official and suggestged solution is installing to the build agents all versions of Visual Studio you need to bulid your code.*

Gian Maria
