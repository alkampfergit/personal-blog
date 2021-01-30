---
title: "Nunit test not found for some assemblies with Visual Studio Test Runner"
description: ""
date: 2015-04-22T12:00:37+02:00
draft: false
tags: [Nunit,Testing,Visual Studio]
categories: [Testing]
---
I’ve a project in Visual Studio 2013 where  **one of the assembly containing Tests refuses to show tests in Test Explorer window**. The solution has tests written both in Nunit and in MSpec, and everything is good except for that specific assembly. If you notice that Test Explorer window misses some tests, the first thing you need to check is the **output windows, where you can find some output for Test Adapters**.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2015/04/image_thumb2.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2015/04/image2.png)

 ***Figure 1***: *Output for test adapters can be found in standard Output Window*

In the above situation the assembly that is ignored is *Intranet.Tests.dll*and the reason is that it is built for Framework45 and  **x64** platform, while the test runner is executing against x86 platform. Everything seems ok, every project is compiled in.ANY CPU, but looking at the raw project file I can confirm that PlatformTarget is set in x64. Changing to x86 (or removing it completely) solves the problem.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2015/04/image_thumb3.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2015/04/image3.png)

 ***Figure 2***: *Platform target changed from x64 to x86*

After I changed the PlatformTarget attribute, all tests belonging to that assembly are now available Test Explorer window.

Gian Maria.
