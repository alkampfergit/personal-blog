---
title: "Again on IoC windsor and Release"
description: ""
date: 2010-01-12T13:00:37+02:00
draft: false
tags: [General]
categories: [General]
---
I have a windows service that is used as a scheduler to launch actions in a pluggable way. It possesses a basic bunch of logic, and the user can simply derive from an ActionBase, doing whatever he want in the Execute method and let basic scheduler classes to manage the rest. In the last month I begin to experience some memory leak on an installation of the scheduler, this leak manifests itself with a constant increase of used RAM, until the process (64 bit) reaches approx 4.5 gb of memory (The server has 4 GB) and the whole server become really slow.

I begin to investigate on the various actions that gets executed, because since they download data, and perform a lot of operations I suspect that one of them is the cause of the leak, but after some investigation I realize that no one of the action is the real cause of this leak.

I go into production server and I decided to debug the process live, to see what is happening and trying to better identify the root cause, but since it is â€œproduction stuffâ€ I cannot use profiler or some other tools, so I and [Guardian](http://www.primordialcode.com/) decided to use [WinDbg with Sos](http://blogs.msdn.com/joaol/archive/2008/09/03/how-to-use-windbg-to-debug-a-dump-of-a-32bit-net-app-running-on-a-x64-machine.aspx).

For those like us, quite used to unmanaged development with C++, using windbg is not a pain (but I must admit that I never used for months :) ). I'm convinced that WinDbg with SOS, is a hardcore tool, but once you gets used with it, it is the key one to find leak in managed code, especially when you are on production machines. For those not used to windbg+sos here is the path we follow to find the leak.

First of all we did a  **!dumpheap â€“stat** , that showed us that we have a 500 mb of RAM used by String objects and another 250 MB used by Object[]. Since the process was using 1.3 gb of RAM, surely string and object arrays are half of the problem. Then we did a **!dumpheap â€“type *System.String* **to dump details of instances that are live in the system. There were millions of them, but we verified that there are also a lot of Dictionary&lt;String, Object&gt; instances. So we take the address of one of this dictionary and did a** !GCRoot address **to find why it is was not collected by the GC. After a little bit, we found that all these dictionaries are referenced by Nhibernate Sessiona, that in turn are referenced by an our class named UnitOfWork that in turn was kept alive from the castle lifecycle manager.

The result is that I did a little modification last month, and the UnitOfWork was resolved with castle (to satisfy a dependency), but I forgot to call release on the container. I [blogged long time ago on this problem](http://www.codewrecks.com/blog/index.php/2007/08/08/the-importance-of-windsorcontainerrelease/), but it seems that it is able to bite me again. With a simple missed call to a Release method, I ended with every session to be kept in memory forever :) and this is the cause of the problem.

alk.
