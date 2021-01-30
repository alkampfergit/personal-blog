---
title: "Pay attention to file length in database project after a synchronization"
description: ""
date: 2010-03-29T09:00:37+02:00
draft: false
tags: [DataDude]
categories: [Visual Studio]
---
One of the coolest feature of Database Projects in VS2008 is the ability to synchronize the database project with a physical instance of SQL server.

This is useful if not all people from the team have the ability to run a database project (this is solved in vs2010 where database project are available even in the professional edition), or if some DBA makes modification to a database with management studio.

After a full synchronization occurs double check the file structure, because the synchronization procedure store size of the files into the definition

{{< highlight csharp "linenos=table,linenostart=1" >}}
ALTER DATABASE [$(DatabaseName)]
ADD FILE (NAME = [xxxxx], FILENAME = '$(VirtualDiskDataPath)\xxxxxx.ndf',
SIZE = 6586816 KB,
MAXSIZE = UNLIMITED,
FILEGROWTH = 10 %) TO FILEGROUP [xxxxxx];
{{< / highlight >}}

the SIZE parameter is really huge, and this can slow down deploy process during unit testing. Keep this in mind and always take a look to the file definition after you sync a database project with a live database.

You can always avoiding to update file definition (because they rarely change) to avoid this problem

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2010/03/image_thumb17.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2010/03/image17.png)

alk.

Tags: [Database Project](http://technorati.com/tag/Database%20Project)
