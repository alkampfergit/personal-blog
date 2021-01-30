---
title: "error MSB3464"
description: ""
date: 2008-04-03T03:00:37+02:00
draft: false
tags: [Uncategorized]
categories: [General]
---
Today I was creating some nant build to automate the deploy of a webproject, I use the wdproj extension for visual studio 2005 to create a web deployment project, then I add a task to the nant script to simply build the wdproj with msbuild.exe.

The script give me error MSB3464, it turns out that I call msbuild with the parameter  **/p:Platform="Any CPU"** and this was the cause of the problem. When I removed that parameter the script run fine.

alk.

Tags: [nant](http://technorati.com/tag/nant) [MSB3464](http://technorati.com/tag/MSB3464)
