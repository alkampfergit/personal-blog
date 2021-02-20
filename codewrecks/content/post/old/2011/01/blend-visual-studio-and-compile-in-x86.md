---
title: "Blend Visual Studio and compile in x86"
description: ""
date: 2011-01-21T10:00:37+02:00
draft: false
tags: [Blend,WPF]
categories: [WPF]
---
I have a WPF project where I need to compile in x86 because it uses the Gecko Browser that works only in x86 mode, and this causes an annoying problem with Blend. I usually keep VS and Blend togheter, in VS I change ViewModels and do everything not related to the UI, when I need to change the UI I simply switch to blend.

The problem is, Blend looks only in the bin\Debug folder, so when I add a Command or property to the viewmodel I compile the project, switch to blend... and I'm not able to see the new property or command. As far as I know the only solution I found, is to change the output folder of the project.

[![SNAGHTML640011](https://www.codewrecks.com/blog/wp-content/uploads/2011/01/SNAGHTML640011_thumb.png "SNAGHTML640011")](https://www.codewrecks.com/blog/wp-content/uploads/2011/01/SNAGHTML640011.png)

 ***Figure 1***: *Change the output path to bin\Debug even for x86 platform*

This is usually not a problem, because this project is compiled only in x86 platform, so I can accept the fact that the output path is the same of the Any CPU version. Now when I compile in VS and switch to blend, I can use new commands and properties without problem.

Alk.
