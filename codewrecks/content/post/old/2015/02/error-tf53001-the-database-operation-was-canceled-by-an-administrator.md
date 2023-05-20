---
title: "Error TF53001 The database operation was canceled by an administrator"
description: ""
date: 2015-02-19T18:00:37+02:00
draft: false
tags: [Sql Server,Tfs]
categories: [Tfs]
---
#### A customer updated his TFS 2010 to 2013 in a new machine running Windows Server 2012 R2 and Sql Server 2014. Everything went fine, until after few days they started having an error whenever he tried to do a GetLatest or a Check-in or Check-out operation. 

>  **Error TF53001: The database operation was canceled by an administrator** Actually this error is not really informative, so I asked them to verify Event Viewer on the server (*an operation you should always do whenever you have wrong behavior of your TFS*). For each client operation that gave error they have this Event Error logged

> Log Name:      Application  
>  Source:        MSSQL$SQL2014TFS  
>  Date:          19/02/2015 17:15:54  
>  Event ID:      17310  
>  Task Category: Server  
>  Level:         Error  
>  Keywords:      Classic  
>  User:          N/A  
>  Computer:      xxxx.xxx.local  
>  Description:  
>  A user request from the session with SPID 70 generated a fatal exception. SQL Server is terminating this session. Contact Product Support Services with the dump produced in the log directory.  
>  Event Xml:

This is an internal error of Sql Server, **and we verified that SQL 2014 was in RTM, with no cumulative update installed**. After installing latest Cumulative Update for SQL Server 2014 everything started working again. Since Cumulative Update usually address bugs in Sql Server product, it is always a good practice to keep your Sql Server up to date, and if you are experiencing strange Sql error, it could be the solution to your problems.

Gian Maria.
