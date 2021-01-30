---
title: "Cleaning up your WSUS Server"
description: ""
date: 2015-08-04T18:00:37+02:00
draft: false
tags: [EverydayLife]
categories: [EverydayLife]
---
## The situation

I’ve a WSUS server that is up and running for last 2 years, it runs on a HP Proliant Microserver where I have a domain controller for my test lab. The purpose of WSUS Server is reducing download time for updates when I install test VMs. I’ve lots of Test VM, and the time needed to download updates is really great, so I’ve decided to configure a WSUS server to mitigate that problem.

 **Since I really do not need to do a fine grained management for a real production environment, I’ve setup my WSUS server to download almost every update** , for 2 years I only approved updates without any further management, and one day my WSUS server became so slow that console crashes 90% of the time and I’m not able anymore to approve new updates.

*Time to clean up!!*

There are a lot of great articles in the internet on how to clean up a WSUS Server, I just want to share with you my experience to make you avoid my mistakes and have your WSUS server fully operational in the least time possible.

## Move to a better hardware

> My experience was: *if your WSUS server is slowed down too much, there is no way you can recover it without moving to a new hardware.*

To give you an extent of what I’m saying, launching standard cleanup on my WSUS Server, reached almost 20% in 24 hours, when moved on fast hardware the whole operation took 8 hours.  **If WSUS is virtualized, do a temporary move of the VM to a new hardware with faster cpu and SSD, but in reality you can simply move your DB to a faster hardware and you are ready to go**.

The goal is **: moving DB to fastest machine in your network, do maintenance** , then move database back to original WSUS location. There are tons of resources on how to move your database on new hardware, [this is the link I’ve followed](http://blogs.technet.com/b/mwiles/archive/2011/06/17/how-to-move-the-wsus-database.aspx) and it is just a matter of installing SQL management studio, detatch your db, and re-attach on a new SQL Instance.

> Be sure that your destination SQL Server is the Very Same Version of the one used by your original WSUS Installation

When you connect to your original WSUS Database (in Windows server 2012 R2 instance name is 

\[\.\pipe\Microsoft##WID\tsql\query](//\\.\pipe\Microsoft##WID\tsql\query) issue a Select @@version to verify sql server version (in my situation is 2012). Since  **cleanup operations use at most one cpu on DB Server (at least in my situation) I moved db on an i7 2600K overclocked to 4.2 GHz with a Samsung 840 SSD Disk**. During cleanup operations sqlserver.exe used only a single core, so I suggest you to move your db to a machine with poweful CPU.

Be sure that the machine with temporary SQL Server installation is joined to the domain or you will not be able to access the database from WSUS Machine.

> In order to be 100% sure that WSUS machine is able to access database, configure the machine where WSUS is running as admin of temporary SQL Server.

## [![User configuration for WSUS Server in Sql SErver.](https://www.codewrecks.com/blog/wp-content/uploads/2015/08/image_thumb1.png "Neuromancer is the computer running WSUS and is added as a login identity to SQL Server to make WSUS Service (that is running as network service) being able to reach SQL Running in another machine of the domain")](https://www.codewrecks.com/blog/wp-content/uploads/2015/08/image1.png)

 ***Figure 1***: *Neuromancer is the computer running WSUS and is added as a login identity to SQL Server to make WSUS Service (that is running as network service) being able to reach SQL Running in another machine of the domain*

## 

## Rebuild your indexes

You can find instruction at [this address](https://technet.microsoft.com/en-us/library/dd939795%28v=ws.10%29.aspx) on how to  **rebuild all of your indexes of your WSUS DB**. With 11 GB db the whole operation on a SSD took no more than 15 minutes. This operation is really important, because if some index is greatly fragmented, all cleanup operations will be really slow.

## What to cleanup

> The very first and fundamental technique is avoiding download drivers update.

There is absolutely no need to let WSUS manage drivers update, in my system, after I removed drivers updates, my total number of updates dropped from 62000 to 12000.

If you read articles in the internet, you can believe that there is no way to really delete an update from WSUS, you can only decline it, but it will remain on database. This is true if you are using the user interface with MMC, but  **if you use powershell you can run a** [**little script that remove all the updates of type drivers from your system**](http://www.flexecom.com/how-to-delete-driver-updates-from-wsus-3-0/). In that article the describe a technique to remove update directly from database; I absolutely discourage you to use this technique because you can potentially destroy everything. At the end of the article you can find a simple Powershell Script that is capable of removing updates from WSUS in a supported way.

{{< highlight powershell "linenos=table,linenostart=1" >}}


[reflection.assembly]::LoadWithPartialName("Microsoft.UpdateServices.Administration")
$wsus = [Microsoft.UpdateServices.Administration.AdminProxy]::GetUpdateServer();
$wsus.GetUpdates() | Where {$_.UpdateClassificationTitle -eq 'Drivers'} | ForEach-Object {$wsus.DeleteUpdate($_.Id.UpdateId.ToString()); Write-Host $_.Title removed }

{{< / highlight >}}

This script can require days to run in a standard machine. Thanks to fast CPU and SSD, my 40000 drivers where deleted in almost 9 hours. This will certify the need to temporary move DB to a really fast machine.

 **This script is useful also to remove updates related to removed classifications**. As an example, now that Windows XP is out of support, if you do not have any Windows XP machine in your lab, you can remove XP from classification and can run the script to remove all updates that refers to windows XP. So please review all of your classifications to reduce the number of approved updates.

Finally, you can also use the script to delete all the updates that are declined and superseded by other updates. Once you finish removing all unnecessary updates, your WSUS Server should be really faster.

## Final cleanup

After you removed all unnecessary updates, you should do a standard WSUS Cleanup Wizard, followed by another full rebuild of all indexes, then everything is ok.

Another suggested option **is defragmenting the drive where WSUS DB is located** , an operation that can be done after you stopped the instance that is using DB. If you followed my suggestion of moving your DB to a better hardware, I suggest to move the database to a drive with plenty of space in your WSUS Server.

In my situation C: Drive is 120 GB of space and has 50 GB free. After all cleanup operation are finished, I detatched DB from temporary location and decided to move the file on a 2 TB drive that has 1 TB Free. With that amount of free space, after the copy database files are completely defragmented.

Now my WSUS Server is operational again.

Gian Maria
