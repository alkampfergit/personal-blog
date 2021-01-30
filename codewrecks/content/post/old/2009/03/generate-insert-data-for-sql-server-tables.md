---
title: "Generate insert data for sql server tables"
description: ""
date: 2009-03-31T09:00:37+02:00
draft: false
tags: [Sql Server]
categories: [Sql Server]
---
Sometimes I need to generate insert statement, taking data from a starting database. Suppose you need to create sql installation scripts to create a database from scratch, quite often you need also to insert some initial data into some tables.

Sql server management studio does not provide a simple way to take a table and script all its content into INSERT statement, but a simple solution can be found [here](http://www.codeproject.com/KB/database/InsertGeneratorPack.aspx). This solution is really simple, it creates a stored into the database that can be used to generate data Es.

{{< highlight csharp "linenos=table,linenostart=1" >}}
exec dbo.insertgenerator MyTableName{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

And this produces

{{< highlight sql "linenos=table,linenostart=1" >}}
INSERT DeviceType(IdDeviceType,Description) VALUES('0A2D5544-ACEE-DD11-A239-0050569F32EE','aaa')
INSERT DeviceType(IdDeviceType,Description) VALUES('10B8DBAD-42D6-46E5-B787-531CEEFF7526','bbb')
INSERT DeviceType(IdDeviceType,Description) VALUES('42BDCDBE-B384-4323-8F1E-CB9367A65075','ccc'){{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

This is really what I need, great script.

alk.

Tags: [Sql Server](http://technorati.com/tag/Sql%20Server)
