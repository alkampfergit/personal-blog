---
title: "The real price of hardware"
description: ""
date: 2012-02-27T08:00:37+02:00
draft: false
tags: [SSD]
categories: [General]
---
I bought a Vertex 3 240GB SSD drive for 270€ VAT included and some of my friend told that this is an expensive drive and they do not want to spend so much money for a Drive. The problem is how you use your hardware, in my life I work as a software consultant, and I spent most of the time in front of a computer compiling and programming and if spending 270€ can make my work more productive it worth the money I spent, because I can work faster.

![](http://3.bp.blogspot.com/-ckZM0I2KDMw/Tl58zFrKyAI/AAAAAAAABD4/1EUIAA9t3io/s1600/smart-money-saving.jpg)

The main reason that makes me bough a new SSD is that I work a lot with virtual machine and the difference of performance of a VM machine when run from a SSD or from my RAID of 2 velociraptor was outragous, but with my single 120 GB SSD I have trouble to make enough room to run my VM so I decided to buy a new drive. When it was time to decide what to buy I opted for a 240 GB SSD, so I could remove the RAID, all the fan dedicated to the two velociraptor (they are really hot :)) but to be honest I did not expect a great increase in overall performances. But I was wrong.

Just to give you some number, before installing the Vertex 3 drive, I took a big project of one of my customer, that has a Continuous Integration build script in MSBuild+NANT that does lots of stuff, I launched it a couple of time, and I got 132 sec the first run and 117 sec the second run (due to cache of filesystem)

Today I launch the script on the Vertex 3 drive and got 73 sec in the first run and 68 sec in the second run, this means that with my new SSD build time is really faster and I really feel my Visual Studio quicker on compilation. When you move from a standard disk to SSD you really feel different, but I assure you that you can have a similar sensation when you move from an old generation SSD to a new generation one, my Vertex 3 really outperform my old Intel X-25M.

Reading these results makes me feel that I spent my money for a good reason.

Gian Maria.
