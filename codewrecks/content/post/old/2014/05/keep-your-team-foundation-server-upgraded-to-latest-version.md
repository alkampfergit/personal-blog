---
title: "Keep your Team Foundation Server upgraded to latest version"
description: ""
date: 2014-05-16T06:00:37+02:00
draft: false
tags: [Tfs]
categories: [Team Foundation Server,Visual Studio ALM]
---
When it is time to maintain Team Foundation Server in small companies the major risk is  **“fear of upgrade”.** In a small shops usually  **there is no dedicated resource to maintain TFS installation** , usually you install the first time, schedule backup and everything is done. In small company maintenance is also simple, you usually have not big database and speed is not a problem with current hardware.

Some people also fear the upgrade, because they think it is a complicated process, they are not sure if they are able to restore the old version if the upgrade went wrong, and so on. First of all I suggest you to  **read the exceptional** [**Upgrade Guide from TFS Rangers**](http://vsarupgradeguide.codeplex.com/) **, it will explain almost everything you need to know about the upgrade** , but I can also assure you that the upgrade process, if you are not still running an old TFS 2008, is not complex.

If you are a small company, probably all your TFS is a single machine with everything installed on it, with the only exception of build server, that usually is located in other machine.

Typical question that people ask before an upgrade are

\*) *What can I do if the upgrade will go wrong?*

The answer is simple, first of all all data is stored inside Databases, if you have a backup all of your data is safe. If you installed TFS in a single Virtual Machine, just turn off the machine, create a snapshot, do the upgrade and if everything went bad, restore the snapshot.

\*) *What can I do to verify that the upgrade is really gone good?*

If the procedure does not raise errors, you should try to do your everyday work, you should simply use Web Access, verify that you are able to do the automatic upgrade to process template to enable new features, use Visual Studio to access code and try to run your builds and verify that everything is ok.  **Remember to verify Reporting and Cube** , because they are usually the most problematic area, together with SharePoint integration.

\*) *Can I test the upgrade while still running the old server?*

The [TFS Upgrade Guide](http://vsarupgradeguide.codeplex.com/) has a section dedicated to **how create a test upgrade environment to verify the upgrade**. Basically you should be 110% sure to change id of cloned TFS to avoid confusion from Client Programs. If you have a Virtual Machine you can copy the disk and create another virtual machine with a private network, to be sure that you are

\*) *How much time does it takes to do the upgrade process?*

This is a question that depends on so many factor. Hardware speed is the major parameter, but size of the collection is another important factor, and finally how old is your original server is another factor of speed.

My suggestion is,  **try to follow the update train, do not miss any update** , because the most time passes between updates, the most complex the process can be. VS Team is also really committed to verify that each update work seamlessly over the last one. If you let too much time pass, it is possible that you should do a multi-step upgrade (Es TFS 2008, converted db to 2010, then to 2012 Update 4, then to 2013).

Gian Maria.
