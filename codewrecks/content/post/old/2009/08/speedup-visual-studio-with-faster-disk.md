---
title: "Speedup Visual Studio with faster disk"
description: ""
date: 2009-08-31T04:00:37+02:00
draft: false
tags: [Experiences,General]
categories: [Experiences,General]
---
We always know that to speedup visual studio a [fast disk is quite always a good choice](http://weblogs.asp.net/scottgu/archive/2007/11/01/tip-trick-hard-drive-speed-and-visual-studio-performance.aspx), but what is best configuration?

Iâ€™ve done some little benchmark on the compilation of a project with a msbuild script and here is the result.

When all sources are stored in C:\ drive (A velociraptor 10k disk) it compiles in 58 sec the first time, and 44 sec the second time and subsequent ones.

When all sources are stored in my D:\ drive (A RAID0 of two velociraptor 10k disks) compilation time is 39 seconds the first time and 30 seconds for subsequent ones. This configuration takes advantages from a couple of fact, first of all a RAID0 uses both disk, this give a little speedup respect running a single disk; moreover using a different disk from the system one takes advantage from the fact that compilation uses temp directory, stored usually in system disk.

If I use a RamDisk compilation time is still 30 secs. :o

When I compile with RAMDisk or two 10k rpm disk in raid 0 the time is quite the same, and I see that one of my CPU core is at 100%, this means that probably I hit the point where the bottleneck of compilation is no more my disk system, but my CPU.

So I suggest you for optimal configuration, to buy Three fast disk like WD velociraptor, install your OS in a single disk and use other two in RAID0 configuration to store project files and virtual machines, probably is one of the best configuration you can obtain.

RAMDisk is still interesting to store asp.net temporary directory, because it is used extensively for dynamic compilation.

{{< highlight xml "linenos=table,linenostart=1" >}}
 <compilation debug="true" strict="true" explicit="true" tempDirectory="V:\temp\aspnet">{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

In this way all temporary asp.net files are stored in my virtual disk. For My next machine Iâ€™ll need to evaluate faster CPU :), probably an I7 will be my next choice.

Alk.

Tags: [Visual Studio](http://technorati.com/tag/Visual%20Studio)
