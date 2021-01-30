---
title: "Multitarget NetStandard for Windows and Linux"
description: ""
date: 2017-10-28T09:00:37+02:00
draft: false
tags: [NETCORE,build]
categories: [Programming]
---
One of the most important features of  **DotNetStandard is the ability to run on Linux and Mac,** but if you need to use a DotNetStandard compiled library in a project that uses full.NET framework, sometimes you can have little problems. Actually you can reference a dll compiled for DotNetCore from a project that uses full Framework, but in a couple of project we experienced some trouble with some assemblies.

 **Thanks to multitargeting you can simply instruct DotNet compiler to produce libraries compiled against different versions of frameworks,** so you can simply tell the compiler that you want both DotNetStandard 2.0 and full framework 4.6.1, you just need to modify the project file to use TargetFrameworks tag to request compilation for different framework.

&lt;TargetFrameworks&gt;netstandard2.0;net461&lt;/TargetFrameworks&gt;

Et voilà, if you run *dotnet build* command you will find in the output folder both the versions of the assembly.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2017/10/image_thumb-5.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2017/10/image-5.png)

 ***Figure 1***: *Multiple version of the same library, compiled for different versions of the assembly.*

> Multitargeting allows you to produce libraries compiled for different version of the framework in a single build.

**The nice aspect of MultiTargeting is that you can use *dotnet pack* command to request the creation of Nuget Packages:  **generated packages contain libraries for every version of the framework you choose.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2017/10/image_thumb-6.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2017/10/image-6.png)** Figure 2: ***Package published in MyGet contains both version of the framework.*

The only problem of this approach is when you try to compile multitargeted project in Linux or Macintosh, because the compiler is unable to compile for the Full Framewor because full framework can be installed only on Windows machines. To solve this problem you should remember that. **csproj files of DotNetCore projects are really similar to standard MsBuild project files so you can use conditional options based on environment variables.** This is how I defined multitargeting in a project

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2017/10/image_thumb-7.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2017/10/image-7.png)

 **Figure 3** : *Conditional multitargeting*

The Condition attribute is used to instruct the compiler to consider that XML node only if the condition is true, and with Dollar syntax Ican reference environment variables. The above example can be read in this way:  **if  DOTNETCORE\_MULTITARGET environment variable is defined and equal to true, the compiler will generate netstandard2.0 and net461 libraries, otherwise (no variable defined or defined with false value) the compiler will generate only netstandard2.0 libraries**.

> Using the Condition attribute you can specify different target framework with an Environment Variable

All the people with Windows machines will define this variable to true and all projects that uses this configuration, automatically will compile for both frameworks. On the contrary, all the people that uses Linux or Macintosh can work perfectly with only netstandard2.0 version simply avoiding defining this variable.

The risk of this solution is: if you always work in Linux, you can potentially introduce code that compiles for netstandard2.0 and not for net461. Even if this situation cannot happen now, working with Linux or Mac actually does not compile and test the code against the full framework. The solution to this problem is simple, just  **create a build in VSTS that is executed on a Windows agent and remember to set DOTNETCORE\_MULTITARGET to true, to be sure that the build will target all desired framework.** [![image](https://www.codewrecks.com/blog/wp-content/uploads/2017/10/image_thumb-8.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2017/10/image-8.png)

 ***Figure 4***: *Use Build variables to setup environment variables during the build*

Thanks to VSTS / TFS build system it is super easy to define the DOTNETCORE\_MULTITARGET at build level, and you can decide at each build if the value is true or false (and you are able to trigger a build that publish packages only for netstandard2.0). **In this build I usually automatically publish NuGet package in MyGet feed, thanks to GitVersion numbering is automatic**.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2017/10/image_thumb-9.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2017/10/image-9.png)

 ***Figure 5***: *Package published in pre-release.*

This will publish a pre-release package at each commit, so I can test immediately. Everything is done automatically and is run in parallel with the build running in Linux, so I’m always 100% sure that the code compile both in Windows an Linux and tests are 100% green in each operating system.

Gian Maria.
