---
title: "AspNet 20 session stored in Sql"
description: ""
date: 2007-07-12T04:00:37+02:00
draft: false
tags: [ASPNET]
categories: [ASPNET]
---
Sometimes it is preferable to store the session of asp.net in sql, I prefer to use a distinct database for each application, the command to create such database is

*aspnet\_regsql.exe -S localhost\isntancename -U sa -P sapwd -d  **databasename** -ssadd -sstype c*

Notice the use of â€“sstype c parameter that forces the script to create a custom database, without that argument the scritp does not permit you to use a custom database name to store the session. In web.config you should also state that you want to use a custom type sql database with allowCustomSqlDatabase=”true”.

&lt;sessionState  
timeout=“60“  
allowCustomSqlDatabase=“true“  
mode=“SQLServer“  
sqlConnectionString=“Database=EasyCVSessionStore;Server=localhost\SQL2000;â€¦/&gt;

Also avoid to copy session database around, and recreate always with aspnet\_regsql.exe, it avoid you some [headache](http://www.nablasoft.com/Alkampfer/?p=25).

Alk.
