---
title: "error MSB3147 Could not find required file 8216setupbin8217 in"
description: ""
date: 2014-05-31T10:00:37+02:00
draft: false
tags: [Msbuild,Tfs]
categories: [Team Foundation Server]
---
I got this error from a powershell script when I call MsBuild.exe to publish a ClickOnce project in a TFS Build, the exact error is.

> error MSB3147: Could not find required file ‘setup.bin’ in …

This is not the first time I encounter this error and  **it is usually caused by missing.NET SDK**. The strange fact is that I have both VS 2013 and Windows SDK already installed in the machine hosting the build agent. Then  **I manualy added the registry key where MsBuild is looking for the bootstrapper**. In the original registry, the GenericBootstrapper has only the 12.0 entry, and I added 4.0 and 4.5 for other framework version. But this is really strange because I never had to do this manually in the past.

[![clip_image002](http://www.codewrecks.com/blog/wp-content/uploads/2014/05/clip_image002_thumb.jpg "clip_image002")](http://www.codewrecks.com/blog/wp-content/uploads/2014/05/clip_image002.jpg)

 ***Figure 1***: *Adding path of the Bootstrapper directly in the registry*

BTW, with these registry keys the problem went away, but only to stop with another really curious error.

> error MSB3482: An error occurred while signing: SignTool.exe not found

I’m started thinking that  **something strange is going on and the best way to troubleshoot the error was connecting in Remote Desktop to the Agent machine and launch msbuild.exe manually** to start investigating the error. This time, using the standard developer command prompt, everything runs fine. The only cause could be: “the script is using wrong version of MsBuild”. The script I was using was taken from another test project of many months ago and used MsBuild from the location:

*C:\Windows\Microsoft.NET\Framework\v4.0.30319\msbuild.EXE*

Clearly, for solution built with VS 2013, the best option is using the version installed by Visual Studio located in

*C:\Program Files (x86)\MsBuild\12.0\Bin\msbuild.EXE*

Changing the version of MsBuild.exe solved the problem.

Gian Maria.
