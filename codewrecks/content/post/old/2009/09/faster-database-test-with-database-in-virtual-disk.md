---
title: "Faster Database Test With database in Virtual Disk"
description: ""
date: 2009-09-09T23:00:37+02:00
draft: false
tags: [Visual Studio Database Edition]
categories: [Visual Studio]
---
When you work with Visual Studio Database Edition, you surely love the data generation plans, and the ability to do database unit testing with automatic deploy and automatic preload. There is only one thing that is bad with database testing, they are usually *slow*because they are accessing disks*.*

To speedup database testing the best solution is to test database in memory, but with sql server it can be difficultâ€¦or not? With a simple software that create a RAMDisk, (a disk made of ram like [Dataram](http://www.dataram.com/) one), you are able to create RAMDisk with few clicks and have a disk that actually runs at memory speed. I've created a 256 mb ramdisk called V:\ and now I want to test against a database stored in that disk.

If you do not have database edition, it can be tricky, but with the Database Edition, doing this is a joke. First of all expand the properties of the project, and double click on  **database.sqlcmdvars**.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2009/09/image-thumb15.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2009/09/image15.png)

Now create a new variable that points to the virtual disk.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2009/09/image-thumb16.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2009/09/image16.png)

Now goes to *Schema Objects"/Storage/Files" and for each file of the target database edit the script changing the value $(defaultDataPath) to the new variable.

{{< highlight sql "linenos=table,linenostart=1" >}}
ALTER DATABASE [$(DatabaseName)]
    ADD FILE (NAME = [MyNameOfPrimaryFile], FILENAME = '$(VirtualDiskDataPath)$(DatabaseName).mdf', SIZE{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

And the game is done, now when you deploy the database files gets created on the virtual disk and your database testing against a sql server database will be run faster, because database files are in memory. Thanks to Database Edition, this can be achieved with a really few clicks.

Alk.

Tags: [Visual Studio Database Edition](http://technorati.com/tag/Visual%20Studio%20Database%20Edition)
