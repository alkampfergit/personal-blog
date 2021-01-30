---
title: "Upgrading Release Management to Update 1"
description: ""
date: 2014-03-15T10:00:37+02:00
draft: false
tags: [ReleaseManagement,Tfs]
categories: [Team Foundation Server]
---
If you want to upgrade Release Management for TFS 2013 to Update 1 you surely noticed that there is no Update 1 upgrade package, but you should first uninstall the old version of Release Management and the install again the version with Update 1.

While this does not delete any previous settings and simply upgrade the database to the new structure, it is possible that  **after upgrading when you try to connect with the Release Management Client you get and error telling you that the Release Management Server is not working**. Before starting panicking for your installation, you should check if you erroneously choose the Https protocol instead of HTTP

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2014/03/image_thumb3.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2014/03/image3.png)

 ***Figure 1***: *Release configuration Manager Server Update 1 Configuration Panel*

If you compare this configuration panel with the standard one of Release Configuration Manager without Update 1 you can notice that there is no Https option.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2014/03/image_thumb4.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2014/03/image4.png)

 ***Figure 2***: *Release Configuration Manager Server Configuration panel (without Update 1)*

Support for Https was introduced with Update 1 and it is the default on the configuration option (see Figure 1) but if you are upgrading, your old installation did not used https (because the option was not supported).

You should change back the configuration to standard Http and everything should work. * **So please pay attention when you are upgrading Release Management to Update 1 to choose http and not https during configuration if you do not want to break any client configuration.** *

Gian Maria.
