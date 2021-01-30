---
title: "After a long time some code on C Again"
description: ""
date: 2008-06-05T00:00:37+02:00
draft: false
tags: [General]
categories: [General]
---
It was a really long time I did not code C++, now I got a tricky work, it consist in massively open pdf files, examine the structure of the file, find page with graphic data, then export the page in tiff along with all the text found in page with relative coordinate.

The starting point is to download acrobatSdk and adobe acrobat trial and set up the environment.

The amount of classes into the SDK is overwhelming…. I’m a little scared on how many functions are in the various layer. The first thing to do is to open the BasicPlugin Project, set the executable of the AdobeAcrobat as the program to launch to debug the project. You can also press play button on the visual studio ide, and simply choose the acrobat.exe program.

Then you need to insert a post build action

> copy “$(TargetPath)” “C:\Program Files\Adobe\Acrobat 8.0\Acrobat\plug\_ins”

this action copies the compiled plugin into the plugins directory of Acrobat. Now you can press F5 and debug your acrobat plugin, and make some practice with acrobat sdk

alk.

Tags: [acrobat sdk](http://technorati.com/tag/acrobat%20sdk)
