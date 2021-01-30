---
title: "Mongo compression with Wired Tiger Engine"
description: ""
date: 2015-09-08T06:00:37+02:00
draft: false
tags: [MongoDb]
categories: [NoSql]
---
With 3.0 version of Mongo database the most welcomed feature was the introduction of  **pluggable storage engine**. This imply that we are not forced to use standard NMAPv1 storage system, but we can use other way of storing data on our filesystem. **The first *and official* alternative storage system is [Wired Tiger](http://www.wiredtiger.com/)**.

One of the most interesting aspect of Wired Tiger is [*Data Compression*](https://www.mongodb.com/blog/post/new-compression-options-mongodb-30), a feature that can reduce the space of your database on disk, and that is especially effective since Mongo stores document as BSON, where most of the data is text. **Wired Tiger has three options for compression: *none, snappy and zlib****,*bug even with none compression, the space occupied by your database on disk is usually lower than NMAPv1. Here is a simple and quick test done on a customer database.

- NNMAPv1: 3.250.453KB
- WiredTiger no compression: 1.219.696 KB
- WiredTiger snappy: 603.674 KB
- WiredTiger zlib: 466.548 KB

This particular database is full of text and this explain why Wired Tiger is so superior respect space occupied by the database, but the gain is really impressive. The version with Snappy compression is only a fraction of the database with NNMAPv1 and with lesser disk space occupied, there is less disk I/O activity to read data. **The further gain you obtain with zlib comes at more CPU usage, and you need to measure to understand if it worth in your deployment**.

The major drawback of using Wired Tiger engine is that [RoboMongo](http://robomongo.org/), one of the most interesting UI to access Mongo, does not work because it still uses old version of the shell and that there is no automatic migration from NMAPv1 to Wired Tiger (you need to do a backup, then change storage system, and restore).

Gian Maria
