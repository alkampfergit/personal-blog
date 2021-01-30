---
title: "Esxi Hyper-V and Linux"
description: ""
date: 2017-12-16T10:00:37+02:00
draft: false
tags: [Virtual Machine]
categories: [General]
---
I mainly use Hyper-V to virtualize my test environments and I’m really happy with it, the only problem is  **virtualizing Linux Desktop environments, especially if you have monitors with higher resolution than Full-HD** (since in Hyper-V I’ve not found a way to run with a greater resolution than Full HD).

To overcome this limitation,  **I’ve converted my old workstation in a virtualization host running VMWare ESXi** and I’m really satisfied. Here is a couple of tricks that I’ve learned (I’m a completely new to latest version of ESXi).

> ESXi is free and it is a really powerful virtualization system, if you have hardware to spare, I strongly suggest you to have a ESXi instance to being able to run both Hyper-V and VmWare based virtual machines

First of all,  **you need to buy a new network adapter** , ESXi is really picky about your network card and it refuses to install if you only have the crappy integrated Ethernet card. I’ve taken a 4x1GB old Intel card used on ebay. If you look you can find old board that are perfect to run with ESXi at a really cheap price. Once you have a good Ethernet adapter you are ready to go. Here are my network Physical NICs

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2017/12/image_thumb-6.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2017/12/image-6.png)

 ***Figure 1***: *Nic adapter on my system.*

I strongly suggests you to read the Compatibility Guide [https://www.vmware.com/resources/compatibility/search.php](https://www.vmware.com/resources/compatibility/search.php "https://www.vmware.com/resources/compatibility/search.php"),  **from my experience, Intel cards are the most compatible one, even if they are really old**. This card of mine does not work in windows 2012 or superior edition (it is really really old), but it works like a charm in ESXi 6.5, it has 4 physical NIC and it costs me around 40€)

Another thing I’ve learned is **not to use the web interface to access Linux Machines** , since I’m in Italy I have an Italian Keyboard Layout, and I had lots of problem with key mapping for Linux machines when I access them with standard web interface.  **The  problem happens because, when you started your VM, it is super normal to click the preview to open a web interface to interact with the machine** [![image](https://www.codewrecks.com/blog/wp-content/uploads/2017/12/image_thumb-7.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2017/12/image-7.png)

 ***Figure 2***: *Click on the preview, and you will access the machine with a web interface*

If you instead click on the Console menu, you can download a stand alone remote console tools (available for all operating systems) that allows you to connect to your virtual machines and avoid having keyboard problem.

> Latest version of ESXi can be entirely managed by Web Interface, but to interact with Virtual Machines, the best solution is to use the VMRC standalone tool.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2017/12/image_thumb-8.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2017/12/image-8.png)

 ***Figure 3***: *Download VMRC standalone software to connect to your machines*

Once you downloaded and installed the VRMC tool you can simply use the “Launch Remote Console” menu option and you will be connected to your machine with a really nice standalone console that will solve all of your keyboard problem.

Gian Maria.
