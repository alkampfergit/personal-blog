---
title: "Reshaper 45 beta"
description: ""
date: 2009-03-18T07:00:37+02:00
draft: false
tags: [Tools and library]
categories: [Tools and library]
---
Today I decided to install the beta of the new version of [Resharper](http://www.jetbrains.com/resharper/beta.html). I must admit that I cannot work without reshaper :D now I'm so used to it that if I work with computers with no R# I spent some second Hitting shortcut and wondering why nothing happens :D. Here is my impression

Installer is quick, it seems me quickier than older version, in about 30 seconds it uninstalled previous version and integrates in both vs2005 and vs2008. Solution opening time is improved, I did not made an exact measurement, but for a solution with a lot of project and a big asp.net site it can be noticed without actually measuring anything. With the 4.1 version I need to wait for about 20 second before being able to edit a file, now in about 10 seconds I can open and edit pages. (I have a 2 RAPTOR 10.000 rpm disk).

Another improvement is in opening aspx pages. With the old version it took about 2 or 3 seconds to open an aspx page in source mode, now it is quite instantaneous.

The new version is more stable, I have a project consisting of about 30 subproject, both in VB and C#, one of them is a big web application. With the old version if I load solution1, then load solution 2 with the vbig web site, usually I got an out of memory exception, and even if the exception does not occurs it tooks about one minute to switch between the solutions, now it does not crash ( I've tried for 5 times) and it is quickier.

Finally when I open a really big solution I see in the lower right corner that resharper is parsing the assembly, but the visual studio is responsive and I can immediatly begin to work, in the old version, on big solutions VS was really slow during assembly parsing.

Great Work, I'm impressed.

Alk.

Tags: [Resharper](http://technorati.com/tag/Resharper)
