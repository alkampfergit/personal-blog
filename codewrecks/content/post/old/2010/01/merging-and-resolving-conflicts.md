---
title: "Merging and resolving conflicts"
description: ""
date: 2010-01-16T09:00:37+02:00
draft: false
tags: [Branch,Tfs]
categories: [Team Foundation Server]
---
Sometimes I hear people that does not like the way TFS manages merge conflicts, and quite all of the time the problem is that they does not like the Visual Studio Integrated tool to merge two files. I must admit that I do not like that tool too, but this is not related to TFS, because conflicts resolution is an operation that must be done by people locally.

For those people, like me, that work a lot with subversion, probably [winmerge](http://winmerge.org/) is the right tool to resolve merge conflicts, and it is really simple to instruct Visual Studio to [use winmerge instead of the standard tool to merge two files](http://www.neovolve.com/post/2007/06/19/using-winmerge-with-tfs.aspx). If you want to spend some money, [BeyondCompare](http://www.scootersoftware.com/) is really a great tool, suggested to me by my dear friend [Janky](http://blogs.ugidotnet.org/janky/Default.aspx).

Remember, conflicts resolution is an operation that has nothing to do with your Source Control System :P.

Alk.

Tags: [Tfs](http://technorati.com/tag/Tfs)
