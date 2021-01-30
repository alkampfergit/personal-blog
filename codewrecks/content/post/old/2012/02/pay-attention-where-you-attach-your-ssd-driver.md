---
title: "Pay attention where you attach your SSD Driver"
description: ""
date: 2012-02-25T08:00:37+02:00
draft: false
tags: [SSD]
categories: [General]
---
I blogged a couple of days ago about my new Vertex3 SSD Disk, and I gave a screenshot of the CrystalDiskmark result, that I report here for the sake of discussion.

![](https://www.codewrecks.com/blog/wp-content/uploads/2012/02/SNAGHTML69aa9.png)

Yesterday I decided to work on my laptop while I did a fresh windows 7 install on the new disk, then I installed everything and finally re-run Crystal Diskmark again…. and I got a really different result. I did not take a screenshot, but basically I got a 350MB/sec sequential read and and an awful 150 MB/Sec on write 4K QD32, that basically is one of the reason why I choose Vertex 3 disk. I started to think what could happened, and I did a deep optimization of the system (disabling prefetch, bla bla, but the results where the same)

Then I run the test against my old intel disk, to verify if even the other disk suffer from the same loss of performance, first of all I got the old result from my blog.

![](https://www.codewrecks.com/blog/wp-content/uploads/2011/09/SNAGHTML81517b.png)

If the old disk still performs at the same speed, something weird happened to my vertex 3 disk during the installation, but with my great surprise here is the results.

[![SNAGHTML11448e](https://www.codewrecks.com/blog/wp-content/uploads/2012/02/SNAGHTML11448e_thumb.png "SNAGHTML11448e")](https://www.codewrecks.com/blog/wp-content/uploads/2012/02/SNAGHTML11448e.png)

WHAT???? Actually my old drive is performing better then before with a good gain on the Random 4K stats. I was puzzled but I started to think to everything I did to install the new drive. Basically what I did was removing a RAID of two velociraptor and reorganizing the cables of my workstation, so I reopened it and compared the situation with a picture I took before the installation of Vertex 3. What I saw is that I swapped the SATA cable of the two SSD, nothing else, so I grab the Motherboard manual and verify each connection and found that I attached the old intel SSD disk to the Intel 6gb/sec controller and the vertex to the Marvel 6Gb/sec controller. I decided to use both controller lots of time ago, because I read in some blog that using both controller avoid saturation of the SATA if you start to heavily use both disks (I got a 2 Terabyte disk where I stored virtual machines attached to the intel controller and the intel SSD on the marvel controller), but doing a quick search in the internet I found that lots of people blame Marvel controller to have poor performances respect Intel’s one, so I finally found the reason for my Vertex 3 performance decrese, you are to blame Marvel controller"!!! Shame on you.

![](http://www.angryweb.com/wp-content/uploads/2010/10/angry-wife.jpg)

I attached both disk to intel controller and redo benchmarks and I obtained the same result as the day before, my Vertex 3 now is able to run at full speed :)

Modern motherboard are really complex, my P8P67 has three USB controller, three SATA Controller, etc and you need to pay attention to a lot of stuff if you want to take max performance from your hardware.

Gian Maria.
