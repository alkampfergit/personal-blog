---
title: "Unable to execute NET core unit test in VS after uninstalling older sdk"
description: ""
date: 2019-11-21T20:00:37+02:00
draft: false
tags: [NETCORE]
categories: [Visual Studio]
---
It is not uncommon to have installed many versions of.NET core framework, especially after many Visual Studio updates. **Each installation consumes disk space so I’ve decided to cleanup everything leaving only major version of the framework installed in the system.** Everything worked fine, except Visual Studio Test Explorer that, upon test run request, generates this error in Tests output window

<font size="3">[21/11/2019 6:08:03.911] ========== Discovery aborted: 0 tests found (0:00:05,5002292) ==========<br>[21/11/2019 6:08:03.934] &#8212;&#8212;&#8212;- Run started &#8212;&#8212;&#8212;-<br>Testhost process exited with error: It was not possible to find any compatible framework version<br>The framework &#8216;Microsoft.NETCore.App&#8217;, version &#8216;2.2.0&#8217; was not found.</font>

> It seems that after uninstalling old.NET core SDK Visual Studio Test runner is not anymore capable of executing tests based on.NET core 2.2

This happens to every.NET core 2.2 test project, if I update framework to netcore3.0 everything went good. After a brief check everything seems ok, but then I realized that  **Visual Studio is a x86 process, so it is probably using x86 version of the.NET Core SDK.** Since I’ve uninstalled every version except x64 major version of every SDK (2.0, 2.1, 2.2, 3.0) I’ve actually removed all x86 version (Except 3.0) and this could be the reason.

To verify this supposition, I went to the folder C:\Program Files (x86)\dotnet\shared\Microsoft.NETCore.App where I can check every version I’ve actually installed for my system. Gotcha, only version 3.0 was present. The final proof was downloading and installing latest x86 version for.NET core 2.2, to verify if it will fix the issue, and, gotcha, VS was able to run Unit tests based on.NET core 2.2 again.

> Visual Studio test runner seems to use x86 version of.NET  core SDK, so if you uninstall it (leaving only x64 version) you are not able anymore to run tests based on that.NET core version with Test Explorer.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2019/11/image_thumb-10.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2019/11/image-10.png)

 ***Figure 1***: *My c:\program files\x86\dotnet\shared\Microsoft.Netcore.App folder that shows the installation of 2.2.5 x86 version of the sdk.*

Gian Maria
