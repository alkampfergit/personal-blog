---
title: "Installing TFS2010 Beta2 first try"
description: ""
date: 2009-10-24T13:00:37+02:00
draft: false
tags: [Tfs]
categories: [Team Foundation Server]
---
Installing TFS is an operation that scares most people. With TFS2010 beta 2 the installation process is really more friendly. I installed a new windows server 2008 machine, update everything and begin the installation to verify the new installer.

You start setup.exe, tells what you want to install, and press next, then after some minutes tfs is installedâ€¦ this is amazing respect to the older version. Now that everything needed was installed we need to start configuration. Suppose you want to install basic edition, it basically has source control, build machine and work item tracking, you can simply choose â€œbasicâ€

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2009/10/image-thumb11.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2009/10/image11.png)

The wizard helps you to decide if Basic version can be enough for you

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2009/10/image-thumb12.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2009/10/image12.png)

So if you are not planning to use SharePoint integration, or Reporting integration, Basic is the right choice. This is the real â€œVisual Source Safe Killerâ€ option, because there is really no reason to use VSS over Tfs Basic.

The wizard of basic edition is really simple, it asked me if I wish to use sql server express or an existing instance, I choose express.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2009/10/image-thumb13.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2009/10/image13.png)

Wonderful, It is ready to install everything, You can press Verify to have a full check of prerequisite needed to configure TFS Basic

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2009/10/image-thumb14.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2009/10/image14.png)

Wow, it finds that I have no istalled IIS (It is a fresh windows 2008 server with service pack 2 just installed), and it does everything is needed for me. I press configure and it begins to configure IIS â€¦ no need to specify any option.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2009/10/image-thumb15.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2009/10/image15.png)

As you can verify it is configuring not only IIS, but also install sql server express, server database web site and everything he needs to create a working TFS server. It takes a while on my virtual machine because I configured with only 1 GB of ram, but the process requires no interaction. Finallyâ€¦..

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2009/10/image-thumb16.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2009/10/image16.png)

It even installed a custom firewall rule to open port 8080, I can click on the web access link and verify that everything works. I must admit that this installer is really simple because you do not need to do anything else than choosing version and the instance of sql server :).

Alk.

Tags: [Team Foundation Server](http://technorati.com/tag/Team%20Foundation%20Server)
