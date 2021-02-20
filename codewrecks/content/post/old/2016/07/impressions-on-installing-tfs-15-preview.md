---
title: "Impressions on installing TFS '15' Preview"
description: ""
date: 2016-07-09T08:00:37+02:00
draft: false
tags: [Tfs]
categories: [Team Foundation Server]
---
Microsoft released a [preview of the new version of Team Foundation Server](https://www.visualstudio.com/en-us/news/releasenotes/tfs15-relnotes), codename TFS “15” and as usual I immediately downloaded and installed on some of my test server. I’m not going to show you full steps of installation or upgrade, because installing TFS is now a Next/Next/Next experience, but  **I want to highlight a couple of really interesting aspect of the new installer**.

## Support to Pre-Production environment

When it is time to upgrade your TFS production server, it is always a good practice to perform the upgrade in a pre-production environment, to avoid having surprises upgrading production instance. Traditionally this is a not so immediate task, because  **you need to backup and restore database to a test server, then run some command line instructions to change the id of the server in db** and then perform the upgrade.

I’ve done a post in the past on [how to create a safe clone of your TFS Environment](http://www.codewrecks.com/blog/index.php/2015/08/07/create-a-safe-clone-of-your-tfs-environment/) and I suggest you to have a read of that post, but with the new version of TFS installer, when you choose the upgrade path, you have this new screen

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2016/07/image_thumb.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2016/07/image.png)

 ***Figure 1***: *You can choose to create a pre-production test directly from Wizard*

This is a really big improvement, because now  **you can simply backup and restore your databases on a new server, run the wizard, choose to do a pre-production Upgrade Testing and you have a clone of you server upgraded to the new version** where you can do all of your tests to verify the upgrade process.

> Thanks to Pre-Production Upgrade Testing option, creating a test clone of your server where to perform the upgrade is a breeze

This option is not only useful for upgrades, but allows you to quickly create a clone of your TFS to do whatever experiment you want to do with real Production data, without harming your production server.

 **Great work Microsoft!!** ## 

## Code search and ElasticSearch

Another interesting wizard screen is the one dedicated to installing code Search capabilities.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2016/07/image_thumb-1.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2016/07/image-1.png)

 ***Figure 2***: *Code search installing screen*

Code search was introduced in VSTS lots of time ago, but now is available even on TFS installation.  **It uses ElasticSearch under the hood, but the installer takes care of everything for you.** From  **Figure 2** you can see that you only need to specify a folder where to store the index, and choose if you want to enable code search for every project collection and the game is done.

Sadly enough, you are not allowed to use an exising installation of ElasticSearch, here is the error you got if you already have ES installed on the machine.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2016/07/image_thumb-2.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2016/07/image-2.png)

 ***Figure 3***: *You cannot re-use an existing ES installation*

 **You should uninstall every installation of ES you have if your machine before installing code search capabilities.** Since ES depends on Java, if you do not have Java JRE or JDK installed on the machine the wizard gives you an error during the verification process.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2016/07/image_thumb-3.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2016/07/image-3.png)

 ***Figure 4***: *An error is present if your machine has no Java installed*

You can check the box where you accept the Oracle Binary Code License Agreement and the installer will download and install Java for you, or you can simply download and install Java manually, then re-run the Readiness Checks. **If you are going to do a manual install of Java or if you have a pre-existing Java installation please check in ES site if your version is compatibile or have some problem.** Usually you have no Java in your TFS Box, so it is safe to check the checkbox and have the installer do everything for your automatically.

## 

## SSH Support

To support SSH Protocol for Git, you should tell the installer that you want to enable the SSH Service and choose the port (22 by default)

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2016/07/image_thumb-4.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2016/07/image-4.png)

 ***Figure 5***: *SSH Support in TFS for Git*

As TFS Evolves the Configure / Upgrade Wizard is more and more complete, and allows you to istall TFS without leaving the Wizard, and configuring / installing all dependent services for you.

Gian Maria.
