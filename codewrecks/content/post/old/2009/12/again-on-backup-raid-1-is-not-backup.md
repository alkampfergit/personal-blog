---
title: "Again on backup RAID 1 is not backup"
description: ""
date: 2009-12-23T21:00:37+02:00
draft: false
tags: [Backup]
categories: [General]
---
Recently I've posted about [backup](http://www.codewrecks.com/blog/index.php/2009/12/17/have-you-backup-your-data-today/), and I want to make another little tough, [RAID 1](http://en.wikipedia.org/wiki/RAID) is not meant to replace backup. During the past I've heard people saying, *Hey I've this RAID 1 array, so I do not need backup, because if a disk will fail I have data in the other one.

This is WRONG!!!

If you are still convinced that RAID 1 or 5 can replace a backup consider these situations.

Virus: you get a virus that deletes or corrupt your data, data is lost because mirroring does not prevent this.

User Fault: A user deletes data from the disk array, data is lost.

Hardware failure: The raid controller experience a failure, so it begin to write rubbish into the disk array until all data is lost (it happened to one of our server)

Hardware failure 2: RAM of the machine is corrupted, the system begin to write rubbish on disk, data will be lost.

All these examples are meant to convince you that RAID system are not meant to substitute backup, but they are meant for high avaliability in case of hardware failure of one of the disk. The raid 1 is useful when one of the disk stop to work, you can still work with the good disk while rebuilding the array with a new disk.

Alk.
