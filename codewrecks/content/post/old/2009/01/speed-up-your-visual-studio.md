---
title: "Speed up your visual studio"
description: ""
date: 2009-01-09T08:00:37+02:00
draft: false
tags: [Tools and library]
categories: [Tools and library]
---
After a lot of years working with visual studio I realized that to speed up building process you need faster Disks. My actual configuration consists of Three disks, two of them are 10.000 RPM Western digital, with 16 MB cache configured in RAID 1 array with a dedicated adaptec RAID card. Then I have a secondary 7.200 Disk that I use to store temporary backup, download, and file of little importance.

To maximize performance of the system I moved all temp directories on the Secondary disk, and move the reshaper cache file to windows temp folder. With this trick visual studio use the main RAID array to read and write source file and resharper can use secondary disk in parallel to store temp cache files. Then I move even the asp.net temp folder for my sites in other disk. This can be easily done in web.config

{{< highlight xml "linenos=table,linenostart=1" >}}
    <compilation debug="true" strict="true" explicit="true" tempDirectory="D:\systemp\ASPNET">{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

now when I change some assembly and reload the page of the project, I can see both disk at work, the main disk is used to do dynamic compilation of the site, while secondary disk is used to store temp file, and the overall performances are better than before.

The overall consideration is that disks are quite often the bottleneck of a pc, and the best solution is to use more disks, dividing tasks among them to use them in parallel.

alk.

Tags: [visual studio](http://technorati.com/tag/visual%20studio) [.net framework](http://technorati.com/tag/.net%20framework)
