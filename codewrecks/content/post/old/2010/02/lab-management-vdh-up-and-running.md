---
title: "Lab Management VDH Up and running"
description: ""
date: 2010-02-27T08:00:37+02:00
draft: false
tags: [Lab Management,Team Foundation Server]
categories: [Team Foundation Server]
---
With VS2010 RC MS had released a [vhd to evaluate Lab Management](http://www.microsoft.com/downloads/details.aspx?FamilyID=592e874d-8fcd-4665-8e55-7da0d44b0dee&amp;displaylang=en). This is a very good news, and since I already have a Beta2 Lab Management Up and running I want to try the VHD to see what is improved on RC.

Lab Management is and environment, so there is not a way you can simply launch the vhd and play with it, you absolutely need to setup an environment and follow [this detailed tutorial](http://blogs.msdn.com/lab_management/archive/2010/02/12/one-box-lab-management-walkthrough.aspx). The first problem is, â€œHow I can evaluate lab management without disturbing my main system?â€.

The easiest way if you have windows 7 (And you should :) ) is [sysprepping a vhd](http://blogs.technet.com/aviraj/archive/2009/01/18/windows-7-boot-from-vhd-first-impression-part-2.aspx) with an image of windows server 2008 R2 (I choosed enterprise), then follow [instructions by Scott](http://blogs.technet.com/aviraj/archive/2009/01/18/windows-7-boot-from-vhd-first-impression-part-2.aspx) to boot from vhd and the game is done. You have a dual boot without disturbing the main system, without partitioning etc etc.

Once you boot from vhd the sysprepped image will finish to install the operating system, then you can install hyper-v role and begin the installation of Lab Management :) how cool.

alk.

Tags: [Lab Management.](http://technorati.com/tag/Lab%20Management.)
