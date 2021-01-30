---
title: "Power of virtualization"
description: ""
date: 2009-08-28T06:00:37+02:00
draft: false
tags: [Experiences]
categories: [Experiences]
---
I really do not remember when was the first time I heard of [VmWare](http://info.vmware.com/content/GLP_IT_virt_LP1Buy?urlcode=PaidSearch_Google_EMEA-South_Italian_VI_General_VMware_Search_IT_virt_LP1Buy&amp;src=PaidSearch_Google_EMEA-South_Italian_VI_General_VMware_Search_IT_virt_LP1Buy&amp;ossrc=PaidSearch_Google_EMEA-South_Italian_VI_General_VMware_Search_IT_virt_LP1Buy&amp;CMP=KNC-google&amp;HBX_OU=50&amp;HBX_PK=IT_virt_LP1Buy&amp;gclid=COqPqt69xpwCFQcTzAodgh-6Jg),  I clearly remember that at those time I used both windows and Linux, and one day a friend of mine sent me a mail with an image showing Windows Maker desktop, with a windows inside that shows the install phase of windows 95. I was curios about how to take a snapshot of windows installer phase, but reading the mail my friend told me of virtualization :D, and explained me that he was able to run a windows 95 instance inside a linux system.

I was totally AMAZED!!!

Now virtualization has really reach unlimited possibility, Iâ€™ve changed my motherboard yesterday, and I need to remove my RAID system because of hardware failure (I need to check disk with SATA), but I want to be sure to had a full backup of the old system before actually destroy everything. I just searched a way to create a complete image of my system, but since it run on an Adaptech raid system, DOS software completely failed to recognize the drive.

Then I heard about vmware [converter](http://www.vmware.com/products/converter/). It is AMAZING, I installed it, told him to create a virtual machine of my  **running system** , wait for a couple of hours, and it created a virtual machine on my external USB disk. Then I install vmware server on my new Windows 7 system, assigned 4 GB of RAM to the virtual machine and Iâ€™m able to fire my old system from a virtual machine.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2009/08/image-thumb31.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2009/08/image31.png)

This is was amazing, moreover I begin to install visual studio and all other tools on my new system, but Iâ€™m able to work on my old system in the meanwhile. Tanks to 10.000 RPM disks and 4gb of phisical memory assigned to it,  the virtual system runs really fine.

alk.

Tags: [Vritualization](http://technorati.com/tag/Vritualization)
