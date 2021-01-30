---
title: "Parallel build in VS2010"
description: ""
date: 2011-10-05T09:00:37+02:00
draft: false
tags: [Visual Studio]
categories: [Visual Studio]
---
If you have solutions with multiple projects, compile time can increase a lot, but if you have multicore machine you can reduce compilation time using a little trick described in the [blog of Scott Hanselman](http://www.hanselman.com/blog/HackParallelMSBuildsFromWithinTheVisualStudioIDE.aspx).

In a solution I work with, after a clean of the solution, standard build took 23 seconds to finish, while with this trick the build time is decreased to 14 seconds, so it worth trying it out :).

alk.
