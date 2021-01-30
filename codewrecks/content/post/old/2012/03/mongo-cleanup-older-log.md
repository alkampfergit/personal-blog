---
title: "Keep your Mongo log database small deleting old logs"
description: ""
date: 2012-03-26T09:00:37+02:00
draft: false
tags: [MongoDb]
categories: [NoSql]
---
As I showed in an old post, [Mongo Db is perfect to store logs](http://www.codewrecks.com/blog/index.php/2012/03/19/using-mongo-database-to-store-log4net-logs/), but as everyone knows, log databases tend to become really big, especially if the verbosity level is high, so I usually schedule a process that deletes all log older than a certain date to  **free space in log databases**. To cleanup record in a Mongo Db I decided to create a little  **Powershell script** to *delete all entry in a collection that are older than a certain value*. The whole scritp is reported here.

{{< highlight vb "linenos=table,linenostart=1" >}}


write-host "Cleanup Mongo Db" 
$now = Get-Date 
$limit = $now.AddDays(-20) 
write-host "Date: " + $limit.Year 
write-host "Date: " + $limit.Month 
write-host "Date: " + $limit.Day

$si = new-object System.Diagnostics.ProcessStartInfo 
$si.FileName = "Mongo.exe" 
$si.WorkingDirectory = "c:\Mongo\Bin" 
$si.Arguments = "localhost:27017/log4Net --eval ""db.mylogtable.remove({timestamp: {`$lt:new Date(" + 
$limit.Year + ", " + ($limit.Month - 1).ToString() + ", " + $limit.Day + ")}})"""

$p = [diagnostics.process]::Start($si) 

{{< / highlight >}}

The scritp is really simple first of all I get the actual date with the  **Get-Date** powershell function, then I subtract 20 days to create the date limit and grab the year, month and day part of it The cleanup process is a simple call to  **Mongo.exe** command line tool that accepts the address of the database as first argument *in the form of address:port/databasename* followed by  **–eval** to directly execute a command. The real delete command has this form: *db.NameOfTheCollection.Remove(Condition),*in this situation the condition is something like  **{timestamp: {$lt:new Date(year, month, day)}}**. Pay attention to the thick sign (`) before the $lt, because it is the escape character used in powershell and it is needed to insert a dollar sign inside a string.

All you need to do is schedule this script to run once a day to keep in your Mongo database only the last 20 days of logs.

Gian Maria
