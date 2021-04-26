---
title: "Keep MongoDb logfile size at bay"
description: "MongoDb is a great database, but you need to keep an eye to log files, because they can grow indefinitely"
date: 2021-05-27T20:00:00+02:00
draft: false
tags: ["NoSql", "MongoDb"]
categories: ["NoSql"]
---

MongoDb is a great option for NoSql but sometimes it is installed in production forgetting some basic maintenance tasks, like managing log files. You should remember that [MongoDb does not automatically rotate log files](https://docs.mongodb.com/manual/tutorial/rotate-log-files/) as for official documentation.

This lead to logfiles of Gigabyte size and sometimes they can even be a space problem in your installation. If a **logfile is gone out of control, you cannot delete because it is in use by mongod process, so you need to ask for a manual rotate**. Just connect to mongodb instance and from mongo.exe command line or any other tool you use issue this command.

{{< highlight javascript "linenos=table,linenostart=1" >}}
use admin
db.runCommand( { logRotate : 1 } )
{{< / highlight >}}

This will force a file rotation, mongod process will create another file, and you are able to delete the old one. 

> As for the official documentation: MongoDB only rotates logs in response to the logRotate command, or when the mongod or mongos process receives a SIGUSR1 signal from the operating system

Another problem is, **if you never rotate the files, when you need to examine mongodb log files, you need to find a program that is able to open text file of GB size**. A better approach is to schedule the above command with mongo.exe tool.

{{< highlight "linenos=table,linenostart=1" >}}
.\mongo.exe localhost/admin -u admin -p mypassword --authenticationDatabase admin --eval "db.runCommand( { logRotate : 1 } )"
{{< / highlight >}}

With this simple trick the size of your logfile will be always manageable. 

Gian Maria.
