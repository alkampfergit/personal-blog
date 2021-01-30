---
title: "Test Drive with database"
description: ""
date: 2009-01-20T07:00:37+02:00
draft: false
tags: [Sql Server,Testing]
categories: [Sql Server,Testing]
---
If you need to [test drive with a database](http://www.codewrecks.com/blog/index.php/2008/09/30/database-testing/)  you can find a lot of problems. The basics of test drive with database is using a database sandbox, and creating a series of scripts that takes the database in a well known state before the run of each test.

In my projects I use NHibernate but there are quite often also some part of the database handled with stored or accessed through a datalayer. In such a situation I cannot use the capability of nhibernate to regenerate the schema, because some tables and stored are outside the control of nhibernate.

To solve this problem I simply created a series of three scripts, one to delete the test db, the second to regenerate the db, and the third recreates the whole structure. The first one is interesting, because I need to be able to drop a database even if it is in use, here is the solution

{{< highlight sql "linenos=table,linenostart=1" >}}
ALTER DATABASE Test SET SINGLE_USER WITH ROLLBACK IMMEDIATE
GO
DROP DATABASE Test
GO{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

In this way even is someone is accessing the db, the db gets dropped. The other two scripts are really simple, the one with all the structure of the db can be generated with a simple batch file here is an example.

*"C:\Program Files\Microsoft SQL Server\90\Tools\Publishing\SqlPubWiz.exe" script -C "data source=localhost\sql2005;uid=sa;pwd=xxx;initial catalog=mydb" Schema.sql -schemaonly -f -targetserver 2005*

with such a script I can generate a.sql file to recreate the structure. Each time one of the developer changes the structure of the db (we have a centralized server where we keep the master db for development) he runs the script and regenerate the file. All the files are contained in the trunk of the project, along with a bat file to execute them all.

*osql -S localhost\SQL2005 -U sa -P xxx -i Drop.sql  
  
osql -S localhost\SQL2005 -U sa -P xxx -i CreateDb.Sql*

osql -S localhost\SQL2005 -d MyDb -U sa -P xxx -i CreateDbStructure.sql

Inside the code I have already a  **Preloader** class used to preload data into tables for testing purpose, to makes the test run without any human intervention I wrote this routine

{{< highlight csharp "linenos=table,linenostart=1" >}}
private static Boolean DbInited = false;
internal static void InitDbSchema()
{
   if (!DbInited)
   {
      DbInited = true;
      using (System.Diagnostics.Process process = new System.Diagnostics.Process())
      {
         process.StartInfo.FileName = "RecreateTestDb.bat";
         process.StartInfo.WorkingDirectory = "Preloads/Scripts/";
         process.StartInfo.WindowStyle = System.Diagnostics.ProcessWindowStyle.Normal;
         process.Start();
         process.WaitForExit();
      } 
   }
}{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

This functions gets called by the preload function, the first time it is called it runs the script and regenerate all the db for the tests. If the database gets really big it can take a while to regenerate it, but in this way you can simply run the test and be sure that they run against the latest version of the database.

alk.

Tags: [Database Testing](http://technorati.com/tag/Database%20Testing) [Unit Test](http://technorati.com/tag/Unit%20Test)
