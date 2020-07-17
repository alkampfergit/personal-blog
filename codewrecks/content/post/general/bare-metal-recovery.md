---
title: "Error 0x8004212 during Bare Metal Recovery"
description: "Even if you correctly backup everything, you should always test recovering procedures"
date: 2020-07-17T17:56:00+02:00
draft: false
tags: []
categories: ["general"]
---

I got an old HP Proliant Microserver Gen7, it has Turion CPU, quite slow in these days, but I got 16GB RAM and 6 TB of caviar Red. The overall performances are acceptable, it is a domain controller for a test domain, it is used as NAS and Windows Update services.

Last week primary disk died, it starts with an annoying Tick Tick noise, then it is dead, so I bough a SAMSUNG 860 500GB SSD to replace the drive. **I already used Bare Metal Restore 2 times in that machine**, because I changed to an SSD in the past then back to a standard Disk, so I was pretty sure that the backup procedure is good. But when I substituted the disk, booted Windows Server from USB and choose to restore the disk I got this nasty error.

![Error recovering from Bare Metal](../images/bmr-error.png)
***Figure 1***: *Error recovering from bare metal backup*.

The error is really annoying, **No disk that can be used for recovering the system disk can be found** so I searched the error code (0x80042412) but I lost almost 20 minutes trying various solutions.

1. One possible reason for this error is a smaller destination drive than the original one. I got a drive with double space, not a problem
1. Some people told that you need to wipe out the disk from every partition, so I used Diskpart, cleaned everything, BMR first told me to reboot then I got the same error
1. Some other people suggests to recreate manually the layout of the disk in diskpart, a 100MB boot partition then primary partition, the error is still there.

After almost 20 minutes of various tentative I realized that I didn't read the whole error message, but I immediately jumped googling error code plus error description "No disk that can be used for recovering the system disk can be found", **but looking closely, the MessageBox gave me three different reasons**.

First possible cause is excluded, but the second possible cause sounds me reasonable:

> Some USB disk could have been assigned as a system drive

Actually **my Bare Metal resides on a USB WD Passport disk and it is always connected to the machine**. This configuration seems to me reasonable, I physically removed every other disk except the new SSD disk (SATA port 0) and the USB disk containing the backup, plus the USB stick with Windows Server image. So I tried **booting from USB with my WD Passport disconnected, then start recovering procedure, connecting the disk in USB port, now the restore procedure started**.  

> Basically when you restore from Bare Metal, boot the system with only the destination disks you need to restore, then plug the disk containing the backup and then the error should go away.

Now my disk is restoring, it is almost at 40% and I hope that everything is ok :), but at least the restore is started.

Gian Maria.

