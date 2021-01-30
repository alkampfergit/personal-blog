---
title: "Upgrading SonarQube from 51 to 60"
description: ""
date: 2016-08-11T20:00:37+02:00
draft: false
tags: [sonarqube]
categories: [Programming]
---
SonarQube is a really nice software, but for what I experienced it does not play well with Sql Server. Even if Sql Server is fully supported, there are always some little problem in setting everything up, and this is probably due to the fact that most of the people using SonarQube are using MySql as Database Engine.

Today  **I was upgrading a test instance from version 5.1 to 6.0** , I’ve installed the new version, launched database upgrade procedure, and after some minutes the upgrade procedure stopped with a bad error

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2016/08/image_thumb-2.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2016/08/image-2.png)

 **Figure1:** *Databse error during upgrade.*

> Remember that SonarQube upgrade procedure does not have a rollback procedure, so it is mandatory  **that you take a full backup of the system before performing the upgrade.** From what I’ve learned in previous situation,  **whenever something does not work in SonarQube, you need to look at the log**. The above error message is really misleading, because it seems that there were some connection problems. Reading the log I discovered that the error is really different.

{{< highlight sql "linenos=table,linenostart=1" >}}


2016.08.11 19:24:00 ERROR web[o.s.s.d.m.DatabaseMigrator] Fail to execute database migration: org.sonar.db.version.v60.CleanUsurperRootComponents
com.microsoft.sqlserver.jdbc.SQLServerException: Cannot resolve the collation conflict between "SQL_Latin1_General_CP1_CS_AS" and "Latin1_General_CS_AS" in the equal to operation.

{{< / highlight >}}

> Whenever you have problem with SonarQube do not forget to read the log, because only in the log you can understand the real cause of errors.

 **Collation problem are quite common with SonarQube** , documentation is somewhat not correct, because it tell you that you need to use an Accent and Case sensitive collation, but does not specify the collation. My SonarQube 5.1 instance worked perfectly with SQL\_Latin1\_General\_CP1\_CS\_AS, but sadly enough, script to upgrade db to version 6.0 fails because it is expecting Latin1\_General\_CS\_AS.

> If you install SonarQube with Sql Server, it is better to chose Latin1\_General\_CS\_AS as collation to avoid problems.

Luckly enough  **you can change database collation for an existing database** , the only caveat is that you need to set the database in Single User Mode to perform this operation.

{{< highlight sql "linenos=table,linenostart=1" >}}


USE master;  
GO  
ALTER DATABASE Sonar SET SINGLE_USER WITH ROLLBACK IMMEDIATE; 
GO 

ALTER DATABASE Sonar  COLLATE Latin1_General_CS_AS ;  
GO 

ALTER DATABASE Sonar SET MULTI_USER; 
GO  

{{< / highlight >}}

 **Clearly you should have a backup of your database before the migration** , or you will end with a corrupted database and nothing to do. So I restored the database from the backup, run the above script, restart SonarQube and try to perform the upgrade again.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2016/08/image_thumb-3.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2016/08/image-3.png)

 ***Figure 2***: *Database is upgraded correctly*

My instance is now running 6.0 version.

Gian Maria.
