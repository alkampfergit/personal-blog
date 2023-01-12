---
title: "Need to save a little bit ATI from my ranting"
description: ""
date: 2011-05-21T08:00:37+02:00
draft: false
tags: [General]
categories: [General]
---
In [previous post](http://www.codewrecks.com/blog/index.php/2011/05/21/new-video-card-are-only-for-gamers-maybe/) I did a lot of ranting against my new video cards, ATI Radeon HD 4600. Now I need to save ATI a little bit from my ranting, because after one hour of investigation I finally managed to understand the reason behind such crappy desktop performances.

I need two video card because I have three monitors, I used to keep my central and primary monitor attached to primary video card, while the other two (24'' and, 17'' on the secondary video card). I always have Motherboard with two PCI express 16x (physically) slots, and in my old system everything is ok.

![External Image](http://www.dirtymouse.co.uk/wp-content/uploads/ok_regular.jpg)

You should know, that even if your motherboard has two 16X PCI express slot, usually these two are only physically a 16x, because the secondary one is usually [a 4x electrical](http://forums.anandtech.com/showthread.php?t=1976657). This means that the secondary video card runs on a 4X PCI Express bandwidth, and usually this is not a problem for me. Now I should heavily rant against Asus and a little bit on myself for not reading all specification with great care. Here is what asus tells me about P8P67 motherboard.

> 1 x PCIe 2.0 x16 (single at x16)       
> 1 x PCIe 2.0 x16 \* (max. at x4 mode [Black])        
> 2 x PCIe 2.0 x1        
> 3 x PCI        
> \*The PCIEX16\_2 slot shares bandwidth with the PCIEX1\_1 slot, PCIEX1\_2 slot and USB3\_34 connector. The PCIEX16\_2 runs at x1 mode by default for system resource optimization

I did not read carefully the \* part, I only read (max at 4x mode) but I did not read two important fact, by default the secondary PCI express runs at 1x, but the worst fact is that *shares bandwidth with the PCIEX1\_1 ... Since I have a RAID card on PCI Express 1x, it does means that if you enable 4x for secondary video card, the USB3\_34 connector and both the PCI Express slot are disabled.

This is one of the major differences with P8P67 Pro, that has Three PCI Express slots, the first two are true 16x and does not suffer from this problem. But even if my secondary card runs at 1x speed my primary monitor that is connected to a 16x video card should not suffer from this loss of performance, so it seems to me that Video Driver of ATI suffers from having 2 monitors connected to secondary video card. I've moved the other 24'' monitor on the primary card, and now performance are little bit better, but if I disable the secondary video card, everything is really good and fast. I suspect that ATI Drivers does not handle well the situation where the two video cards have different bandwidth.

Ok, at least now performances with aero enable are *acceptable*, next problem is how to disable Hyper Memory on ATI Card because ATI catalyst driver is telling me that each video card uses potentially 8 GB of system memory...and seems that it is not possible to disable this or change this value...sigh.

Alk
