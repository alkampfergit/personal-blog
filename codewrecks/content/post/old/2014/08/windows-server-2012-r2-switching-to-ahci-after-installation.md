---
title: "Windows Server 2012 R2 switching to AHCI after installation"
description: ""
date: 2014-08-02T08:00:37+02:00
draft: false
tags: [EverydayLife]
categories: [EverydayLife]
---
I’ve installed some weeks ago a new server, and at the time of installation I did the really bad error of not fully checking BIOS settings. This week I moved a couple of SSD to that server, because it will be used for virtualization, and I did noticed that my Vertex 4 is performing really slower respect the original system, so I immediately checked and verified that **I forgot to enable AHCI in the BIOS**.

*SHAME ON ME!!!!!*

If you ever had this problem in the past, you knows that if you simply reboot your machine, enable AHCI in the BIOS and reboot again in Windows you will be welcomed with a beautiful Blue Screen telling you that the system is not able to boot.

With windows server 2012 I found that a reboot in Safe Mode is enough. Just *reboot the machine, enter in the BIOS, then enable AHCI for my motherboard then reboot again. Now press F8 to open windows boot menu and choose Safe Mode, the system should boot correctly*.

Now simply reboot in standard mode and everything should work correctly. At least it worked in my system.

Gian Maria.
