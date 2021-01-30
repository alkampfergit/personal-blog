---
title: "TFSRestoreexe database restored with strange suffix"
description: ""
date: 2013-07-01T18:00:37+02:00
draft: false
tags: [Tfs,Upgrade]
categories: [Team Foundation Server]
---
This problem happens if you mix Team Foundation Server backup tools, the symptom is: you launch TfsRestore.exe and point to a local folder where a TFS backup is located, and when the database are restored they have strange suffix.

![image](http://www.getlatestversion.it/wp-content/uploads/2013/06/image_thumb30.png "image")

 ***Figure 1***: *Strange suffix in database names after a restore with TfsRestore.exe*

This happens when you use TfsRestore.exe to restore a backup taken with the Tfs Backup Scheduled Backup. Basically you have two distinct way to backup your TFS: the first one is using the  **TfsBackup.exe and TfsRestore.exe utilities** as described in “[Backup and Restore data for TFS](http://msdn.microsoft.com/en-us/library/jj620932.aspx)”, the other one is the  **scheduled backup** , originally included in TFS 2010 and TFS 2012 power tools, and now part of the base product starting from TFS 2012 Update 2.

You should clearly use the correct restore tool based from the origin of the backup set; this specific problem (strange suffix of names) originates by the TfsRestore.exe utility assuming that the backup set is taken from TfsBackup.exe, that creates file names based on Database Names. The scheduled backup utility create backup-sets adding suffix to file names, because the real file names are written in the backup summary (an xml file).

 **But how can you understand what was the tool that generates the backup** if someone told you something like: in share [\\backupXX\TFS\](//\\backupXX\TFS) you will find TFS Backup and you should use them to test an upgrade to new version? The answer is really simple, backup produced by the TfsBackup.exe tool are simple Sql Server backup, so you will find a bak file for each database.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2013/07/image_thumb.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2013/07/image.png)

 ***Figure 2***: *Typical Tfs backup output of TfsBackup.exe*

A really different output is produced by Scheduled Backup.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2013/07/image_thumb1.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2013/07/image1.png)

 ***Figure 3***: *Backup folder of Scheduled Backups*

First of all all file have a suffix that identify the backup set, then you have the Xml File called BackupSets that identify the various Backup Sets. This kind of backup should be restored only with the Scheduled Backup Restore option, present in the Administration Console.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2013/07/image_thumb2.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2013/07/image2.png)

 ***Figure 4***: *Restore database procedure to restore backups taken from a Scheduled Backup procedure*

Gian Maria
