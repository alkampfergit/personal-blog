---
title: "Installation of Tfs Beta 1"
description: ""
date: 2009-07-01T09:00:37+02:00
draft: false
tags: [Team Foundation Server]
categories: [Tfs]
---
Today I installed Tfs 2010 beta to look at new features; installation process of Tfs can be a complex operation but I must admit that in the 2010 version, the installer is more friendly. I installed sharepoint and sql server 2008 then I fired the installation of tfs. The main difference from the 2008 version is that it does not ask you anything, it just install, postponing the configuration after the installation is ok. When you access the Team Foundation Administration console, it presents you a configuration wizard.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2009/07/image-thumb.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2009/07/image.png)

If you select *custom Configuration* you can fine tuning the configuration, you can choose as example the database you want to use.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2009/07/image-thumb1.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2009/07/image1.png)

Since I already configured sharepoint services and created sites I can specify them in the next configuration step.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2009/07/image-thumb2.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2009/07/image2.png)

You can configure almost anything with simple wizards, the overall process can be complicated if you are not familiar with the tecnologies involved, since you have to configure reporting services, integration with sharepoint etc. etc. When you finished configuring everything the wizard runs a check that tells you what is wrong and what is good.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2009/07/image-thumb3.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2009/07/image3.png)

From this simple list of errors and warning you can easily address every problem you can have, in this example I forgot to set the Database Agent in automatic execution, so I started it and do again a check.

During the whole installation I had only a little problem with error TF255275 that states

> The following Web service for SQL Server Reporting Services could not be accessed: [http://tfsd2010/ReportServer/ReportService2005.asmx](http://tfsd2010/ReportServer/ReportService2005.asmx)

This is caused by a wrong configuration of reporting services, actually I completely forgot to create databases for Reporting services :), but the error is somewhat misleading me to wrong cause. you can find a detailed discussion of this error h[ere](http://social.msdn.microsoft.com/Forums/en-US/tfsprerelease/thread/750302b5-12fb-4a92-8249-bcb64aadc23a).

I must admit that the installation process is more friendly and improved respect Tfs 2008.

Alk.

Tags: [Team Foundation Server](http://technorati.com/tag/Team%20Foundation%20Server)
