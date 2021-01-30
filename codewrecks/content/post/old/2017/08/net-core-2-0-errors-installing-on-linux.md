---
title: "NET core 20 errors installing on linux"
description: ""
date: 2017-08-16T08:00:37+02:00
draft: false
tags: [NETCORE]
categories: [NET Core]
---
.NET Core 2.0 is finally out, and I immediately try to install it on every machine and especially in my linux test machines. In one of my Ubuntu machine I got an installation problem, a generic error of apt-get and I was a little bit puzzled on why the installation fail.

Since in windows the most common cause of.NET Core installation error is the presence of an old package (especially the preview version), I decide to uninstall all previous installation of.NET core on that machine. Luckly enough, doing this on linux is really simple, first of all I list all installed packages that have dotnet in the name

{{< highlight bash "linenos=table,linenostart=1" >}}


sudo apt list --installed | grep dotnet

{{< / highlight >}}

This is what I got after a clean installation of.NET core 2.0

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2017/08/image_thumb-3.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2017/08/image-3.png)

 ***Figure 1***: *List of packages that contains dotnet in the name*

But in that specific virtual machine I got several versions and a preview of 2.0, so I decided to uninstall every pacakge using the command *sudo apt-get purge packagename*, finally, after all packages were uninstalled I issued a sudo apt-get clean and finally I tried to install again.NET core 2.0 and everything went good.

> If you have any installation problem of.net core under linux, just uninstall everything related with dotnet core with apt-get purge and this should fix your problems.

Gian Maria.
