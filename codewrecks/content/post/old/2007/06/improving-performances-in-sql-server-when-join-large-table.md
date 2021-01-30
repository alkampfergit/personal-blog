---
title: "Improving performances in sql server when join large varchar columns"
description: ""
date: 2007-06-04T08:00:37+02:00
draft: false
tags: [Sql Server]
categories: [Sql Server]
---
I have a database with a table that contains a column called pageData of type nvarchar(3000), my problem is that periodically I need to check another db that have a similar table and I need to make a join between the two tables on pageData column. The problem is that a column of nvarchar(3000) cannot be indexed, so the join is too slow.

A possible solution is to include a extended stored procedure to compute the Md5 of a string,  apossible approach can be found [here](http://www.codeproject.com/database/xp_md5.asp). Before joining the two table I compute the md5 value of column pageData in another column that now is indexed because is a char(32) type, and then make the join. The result is much faster than the older join.

Alk.
