---
title: "Scale out deployment error when migrating Reporting Services"
description: ""
date: 2016-07-27T18:00:37+02:00
draft: false
tags: [Tfs]
categories: [Tfs]
---
 **Part of moving your TFS Server on new hardware, or** [**creating a Pre-Production environment**](http://www.codewrecks.com/blog/index.php/2016/07/16/create-a-pre-production-test-environment-for-your-tfs/) **is restoring Reporting Server database**. Since Datatbase are encrypted, if you simply restore the database then configure Reporting Services on new machine to use restored database, this operation will fail, because the new server cannot read encrypted data.

> Restoring Reporting Services database into a new instance involves some manual steps, especially you need to backup / restore encryption keys from your old server to the new one.

Clearly you should have a backup of your encryption key, this is a part of a good backup process, and it is automatically performed by the standard TFS Backup wizard.  **If you never backupped your encryption key I strongly suggest to DO IT NOW.** The backup procedure can be done manually from Sql Server Reporting Service Configuration Manager.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2016/07/image_thumb-17.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2016/07/image-17.png)

 ***Figure 1***: *Backup your encryption key*

You should choose a strong password and then you can save the key in a simple file that can be moved and imported on the machine where you restored your Reporting Services database.  **On that server you can simple use the Restore feature to restore the encryption key so the new installation is now able to read encrypted data from database**.

If the name of the machine is changed, as an example if you perform a restore on a Test Environment, when you try to access your reporting server instance you probably will got this error

> *The feature: “Scale-out deployment” is not supported in this edition of Reporting Services. (rsOperationNotSupported)*

 **This happens because the key you restored belongs to the old server, and now your Reporting Server instance believe that it is part of a multi server deployment** , that is not supported in standard edition of Reporting Services.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2016/07/image_thumb-18.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2016/07/image-18.png)

 ***Figure 2***: *Scale out Deployment settings after key is imported.*

In Figure 2 you can verify that, after importing the encryption key, I have two server listed, RMTEST is the name of the machine where I restored the DB while TFS2013PREVIEWO is the name of the machine where Reporting Service was installed. **In this specific scenario I’m doing a clone of my TFS Environment in a Test Sandbox.** Luckly enough there is [this post that explain the problem and gives you a solution](http://www.widriksson.com/ssrs-scale-out-deployment-configuration-error/). I must admit that I dot feel really confortable in manually manipulation of Reporting service database, but the solution always worked for me. As an Example, in Figure 3 you can see that I have two entries in the Keys table of reporting database

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2016/07/image_thumb-19.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2016/07/image-19.png)

 ***Figure 3***: *Keys table contains both entries for keys.*

After removing the key of TFS2013PREVIEWO from the database the Scale Out settings come back to normal, and reporting services starts working.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2016/07/image_thumb-20.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2016/07/image-20.png)

 ***Figure 4***: *Reporting services are now operational again.*

Gian Maria.
