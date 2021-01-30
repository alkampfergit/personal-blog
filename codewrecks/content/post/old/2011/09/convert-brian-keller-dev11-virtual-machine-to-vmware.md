---
title: "Convert Brian Keller dev11 Virtual Machine to vmWare"
description: ""
date: 2011-09-24T15:00:37+02:00
draft: false
tags: [Tfs,Virtual Machine]
categories: [Team Foundation Server]
---
The [Brian Keller’s Virtual Machine](http://blogs.msdn.com/b/briankel/archive/2011/09/16/visual-studio-11-application-lifecycle-management-virtual-machine-and-hands-on-labs-demo-scripts.aspx) with all the goodness of dev11 developer preview is an Hyper-V one, so if you have a windows 7 environment (like me) you cannot use it. A possible solution is using a Virtual Disk converter like the Starwind one ([http://www.starwindsoftware.com/download-starwind-converter](http://www.starwindsoftware.com/download-starwind-converter)) that permits you to convert a.VHD hyper-v virtual disk to a standard VmWare disk, then you can create a new VmWare virtual machine, use the converted disk and everything should be ok.

After you boot the machine, Windows 2008 R2 begins to find new hardware, because the virtualization system is different, so be prepared to a couple of reboot, and when the system finished finding new hardware it is time to install the VmWare tools on the VM and the game is done, the VM is converted to VmWare and you can use it in windows 7 environment.

Gian Maria.
