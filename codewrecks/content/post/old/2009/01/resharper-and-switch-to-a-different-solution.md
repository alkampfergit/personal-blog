---
title: "Resharper and switch to a different solution"
description: ""
date: 2009-01-09T05:00:37+02:00
draft: false
tags: [Tools and library]
categories: [Tools and library]
---
When I close a solution from visual studio quite often resharper does not release memory

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2009/01/image-thumb.png)](https://www.codewrecks.com/blog/wp-content/uploads/2009/01/image.png)

To show this information you can simply go to Resharper-&gt;options and in the General section under System check the "show managed memory usage in status bar"

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2009/01/image-thumb1.png)](https://www.codewrecks.com/blog/wp-content/uploads/2009/01/image1.png)

As you can see I store caches in TEMP folder, this because I have two disks, so I prefer to keep caches in a disk different from the one used to store source code, in this way overall disk usage is better.

When you close a solution, before opening the next one you can force a garbage collection to release memory right-clicking on the managed memory usage

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2009/01/image-thumb2.png)](https://www.codewrecks.com/blog/wp-content/uploads/2009/01/image2.png)

This usually makes memory usage smaller. For solution with big web sites sometimes even a GarbageCollection does not reduce memory usage. Opening another solution in the same instance of visual studio will increase the memory used by resharper until you can even hit an OutOfMemoryException. In this situation close the entire visual studio or try [this solution posted by guardian](http://www.nablasoft.com/guardian/index.php/2008/12/23/resharper-outofmemoryexception-problem/).

alk.

Tags: [Resharper](http://technorati.com/tag/Resharper)
