---
title: "Disappointed about diskeeper"
description: ""
date: 2009-01-24T07:00:37+02:00
draft: false
tags: [General]
categories: [General]
---
When I reinstalled my system last month, I bough a licence of diskeeper. I used the trial 30 gg in my laptop, and I really like its feature to automatically defragment the file system during Idle time.

Since trial time with laptop went good I decided to buy a licence and install diskeeper in my desktop system, and after some days of usage I noticed that it really slows up my wmware machines. When I started virtual machines I see in task manager the diskeeper service readings tons of data from the disk, and the PC gets really slow. I stopped the service for a couple of weeks, and wmware works as expected. Today I reactivated diskeeper to do a manual defragmentation. I started the service and let it analyze my C: disk (a RAID 1 array) diskeeper tolds me that the disk is average fragmented and suggested a manual defragmentation.

I started manual defragmentation and went to lunch. After 30 minutes I come back and logged in the pc and I realize that it is really really slow, even mouse pointer is slow, I fired task manager but then the pc completely hung. I look at my SATA card, and the led confirmed me that there isactivities on disk (it flashes about one time at a second), but the system was completely freezed, even mouse pointer is stuck, and CTRL+ALT+CANC does not work. After 5 minutes I had no choice….I did an hardware reboot.

When the system starts up one of my disk of the RAID 1 array was signaled as "degraded". Now I’m rebuilding the disk (such a length process), but the next step will be uninstalling diskeeper.

alk.
