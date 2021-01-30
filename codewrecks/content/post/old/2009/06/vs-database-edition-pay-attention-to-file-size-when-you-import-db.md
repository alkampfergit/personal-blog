---
title: "VS Database Edition pay attention to file size when you import db"
description: ""
date: 2009-06-26T01:00:37+02:00
draft: false
tags: [NET framework]
categories: [NET framework]
---
I use Database Edition on a legacy database that is very big, when I created the database project I simply ask to VS database edition to import the structure and everything is ok. Then I noticed that deploy operation when database does not exists on the server is really slow. I use in the past some custom test infrastructure to preload the db, I have a lot of test that works in this way and I do not want to delete them. These test will simply delete the entire database and recreate it empty to start preloading.

Now with VS DB edition I write test more easily using the data generation plan, but usually I run both the old tests and the new ones, and I noticed that the deploy of my DB project is incredibly slow when the db does not exists.

when I look at the database folder I saw that my test database is 40 GB big, I was astonished by this fact, since it is deleted at each test run and have small preload set. This problem was caused by the fact that VS DB edition imported the whole structure of the DB as well as file dimension. If you go to â€œSchema Objectsâ€, then â€œStorageâ€ then â€œFilesâ€ you can find several.sql files that contain definitions of the physical files of the database. Examining the files I found entries like this.

{{< highlight sql "linenos=table,linenostart=1" >}}
ALTER DATABASE [$(DatabaseName)]
    ADD FILE (NAME = [MyFileName], FILENAME = '$(DefaultDataPath)$(DatabaseName).mdf', SIZE = 16000000 KB, MAXSIZE = UNLIMITED, FILEGROWTH = 64000 KB) TO FILEGROUP [PRIMARY];{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

This means that each time VS DB edition does a deploy this file is 16 gigabytes big, and the operating system take times to find space on disks. The solution was changing this value to a reasonable value (10 megabytes for each file). Now deploy operation is considerably faster.

alk.

Tags: [Visual Studio Database Edition](http://technorati.com/tag/Visual%20Studio%20Database%20Edition)
