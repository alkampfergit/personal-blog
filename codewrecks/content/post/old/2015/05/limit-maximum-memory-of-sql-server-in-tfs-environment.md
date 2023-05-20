---
title: "Limit maximum memory of SQL Server in TFS environment"
description: ""
date: 2015-05-13T06:00:37+02:00
draft: false
tags: [Performance,Tfs]
categories: [Tfs]
---
If you are a small shop using on-premise TFS, probably you’ll have a single machine installation for Data and App tier for your TFS. While installing a Build server on App or Data tier is highly discouraged,  **using a single machine for Data and App tier is a viable solution for small and medium team** , and with virtualization is quite easy to move machine to a more powerful hardware or give it more RAM if the usage or TFS increase performances starts to degrade.

> If you are interested in a really good article about how to configure TFS for performance, [this post](http://blogs.msdn.com/b/granth/archive/2013/10/08/what-does-a-well-maintained-team-foundation-server-look-like.aspx) cover all you need.

In this post I want to point out one aspect that is quite often underestimated but is really critical on single server installation.

SQL Server tends to consume all the RAM of the system, and if you are not limiting maximum memory that it can use, you usually have problem ranging from poor performances to malfunction. On a customer site, suddenly, build controller was disconnected from the server; looking at event viewer in TFS Machine we found that some WCF services failed to start because there is less than 5% of free RAM. Obviously almost all RAM in the system was used by SQL Server. In that installation  **Sql server max memory limit was not set, and the server slowed down gradually until some part (the build in this situation) stopped working**.

If your TFS is a Single Server installation, start limiting SQL Server Memory size to half the RAM, then after some real usage, verify if the system still has free RAM, and gradually give more memory to SQL. This method will prevent SQL From stealing RAM to App Tier.

 **Limiting memory is crucial even if SQL Server is in a dedicated machine**. This article : [How much memory does my Sql Server actually need](http://www.sqlskills.com/blogs/jonathan/how-much-memory-does-my-sql-server-actually-need/) is a good article on the subject. Remember also that if Reporting Services are installed on the same machine you should take this in consideration. Even if Sql Server Database is the only role on the machine limiting is needed. A rough formula given by Grant is the following one.

> reserve: 1 GB of RAM for the OS, 1 GB for each 4 GB of RAM installed from 4–16 GB, and then 1 GB for every 8 GB RAM installed above 16 GB RAM

If your SQL Server is on a 32 GB RAM machine, you should configure it to use 25 GB Max, with16 GB  the right value is 11 GB, with 8 GB limit is 5 GB and finally if you have 4 GB of RAM the right value is 2 GB.

Gian Maria.
