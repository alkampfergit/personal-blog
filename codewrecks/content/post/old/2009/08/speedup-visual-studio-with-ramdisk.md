---
title: "Speedup Visual Studio with RAMDIsk"
description: ""
date: 2009-08-31T08:00:37+02:00
draft: false
tags: [General]
categories: [General]
---
In previous post I showed how using a RAMDisk does not offer speed gain when you have fast disk subsystem, but RAMDisk can still comes to an help to speedup visual studio.

Visual Studio uses windows TEMP directory during normal usage, so you can encounter some advantage if you move your temporary files on a RAM disk, as well as asp.net temporary folder. First of all create a Virtual RAMDisk of small size (you can use even 256 MB of memory) then if you have asp.net applications be sure that they use the ramdisk as temporary store.

{{< highlight xml "linenos=table,linenostart=1" >}}
 <compilation debug="true" strict="true" explicit="true" tempDirectory="V:\temp\aspnet">{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

But even with this optimization Visual Studio still uses standard windows TEMP folder to store temporary files, to make VS uses RAM disk as temp storage you can create a simple.bat file with these instructions.

{{< highlight csharp "linenos=table,linenostart=1" >}}
set TEMP=v:\vstemp
set TMP=V:\vstemp
"C:\Program Files (x86)\Microsoft Visual Studio 9.0\Common7\IDE\devenv.exe"{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

When you set environment variables in a bat file, they are used until the bat ends, in this way you can launch visual studio while pointing temporary directory to RAMDisk. Be sure to exclude the RAMDisk from Antivirus check (because it will slow a little bit even if files are in memory). Thanks to this setting you can gain minor performance improvement :)

If you use [resharper](http://www.jetbrains.com/resharper/), goes to options and tell resharper to use windows TEMP directory to store internal data, in this way even resharper files will goes to RAMDisk, and you gain another little bit.

Alk.

Tags: [Visual Studio](http://technorati.com/tag/Visual%20Studio)
