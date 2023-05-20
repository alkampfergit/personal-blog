---
title: "SQLite performance in production code"
description: ""
date: 2011-04-22T11:00:37+02:00
draft: false
tags: []
categories: [Programming]
---
[SQLite](http://SQLite.phxsoftware.com/) is a cool relational database engine that runs embedded in code, without the need to use a server. It is usually used for unit testing, but it could be used in production code if we need to maintain a small database and we do not need the full power of a SQL Server or similar RDBMS.

When you use SQLite in production, remember to enable caching of connection into the connection string, if you use the wrong connection string, you wull not use pooling, and performance will suffer. Connection string for SQLite could be really simple

> Data Source=filename;Version=3;

This happens because an embedded database needs only to know the filename used as storage, but if you use such a connection string in your program, you will incur in performance loss each time you create a SQLiteConnection. This happens because when a SQLiteConnection string is created, the engine perform some check on the file, but since the connection is not thread safe you could not use a single static connection. The obvious solution is enabling connection pooling.

> Data Source=filename;Version=3;Pooling=True;Max Pool Size=100;

With this Connection String, each time you dispose a Connection it will be returned to the pool to be used again at a subsequent request.

alk.
