---
title: "Use Sql server Publishing wizard to keep track of the change of the database structure"
description: ""
date: 2008-06-09T23:00:37+02:00
draft: false
tags: [Sql Server]
categories: [Sql Server]
---
One of the most important procedure in software development, is keeping track of every change in the project, to accomplish this task we have source control system like subversion or cvs. When you develop application that are based on a database, it is fundamental that you do not loose track of the database structure, but a source control system is not designed to keep track of database evolution. In this situation you can use the [Sql Server Database Publishing Wizard](http://www.microsoft.com/downloads/details.aspx?familyid=56E5B1C5-BF17-42E0-A410-371A838E570A&amp;displaylang=en) to automate a task that periodically create the script to regenerate all the database and then update the subversion to store that version. After you have installed the Sql server database publishing wizard you can create a simple bat script.

{{< highlight csharp "linenos=table,linenostart=1" >}}
"D:\Program Files\Microsoft SQL Server\90\Tools\Publishing\SqlPubWiz.exe" script -C "data source=localhost\sql2005;uid=xxx;pwd=xxx;initial catalog=mydatabase" Schema.sql -schemaonly -f -targetserver 2005
svn commit --username svnuser --password xxx -m "AutomaticUpdate" Schema.sql >update.log{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

I create a directory in the SVN project structure called DBScripts, then I create a empty Schema.sql file, add it to the subversion, then add the.bat file shown above, and finally I schedule the server where I have the CC.net to run this script once a day. The game is done.

alk.

Tags: [Sql Server](http://technorati.com/tag/Sql%20Server)

<!--dotnetkickit-->
