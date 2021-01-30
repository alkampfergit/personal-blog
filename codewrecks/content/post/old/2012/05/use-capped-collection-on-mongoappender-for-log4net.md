---
title: "Use Capped collection on MongoAppender for Log4Net"
description: ""
date: 2012-05-22T17:00:37+02:00
draft: false
tags: [log4net,MongoDb]
categories: [NoSql]
---
One of the coolest feature of Mongo is the concept of [**Capped Collection**](http://www.mongodb.org/display/DOCS/Capped+Collections) **,** or “fixed size” collection. They are based on a FIFO queue where the first record to be discharded is the first inserted, and this is exceptional to create a log-collection that automatically purge all old logs  **without any user intervention**.

To be able to automatically enable this feature on the Log4Net [Mongo appender](http://www.codewrecks.com/blog/index.php/2012/03/19/using-mongo-database-to-store-log4net-logs/) you need to do a little modification to the code, this is because the original code simply gets a reference to the collection with this code.

{{< highlight csharp "linenos=table,linenostart=1" >}}


connection = MongoServer.Create(mongoConnectionString.ToString());
connection.Connect();
var db = connection.GetDatabase(DatabaseName);
collection = db.GetCollection(CollectionName);

{{< / highlight >}}

C# drivers for Mongo  **automatically creates a collection if it is not present** , this means that when you call db.GetCollection if the collection is not present it will be automatically created, but it is not capped. To solve this problem you can modify the initialization code with this code.

{{< highlight csharp "linenos=table,linenostart=1" >}}


if (!db.CollectionExists(collectionName)) { 
    var options =  CollectionOptions
       .SetCapped(true)
       .SetMaxSize(CappedSize);
    db.CreateCollection(collectionName, options);
}
collection = db.GetCollection(CollectionName);

{{< / highlight >}}

MongoDb C# drivers has a class called [**CollectionOptions**](http://api.mongodb.org/csharp/1.2/html/a06528f4-772e-f4f4-890d-ca3b55ac8d92.htm "CollectionOptions class MongoDb API") **used to setup options to create a new MongoCollection** and it can be accessed with a really easy Fluent-Interface, in my example I call SetCapped(true) to enable a capped collection and [SetMaxSize](http://api.mongodb.org/csharp/1.2/html/1fd7ba87-3d7b-a9ae-97c3-6c0d9dbe8c00.htm)() to setup the maximum size in bytes. The size of the capped-collection is stored in the appender property called CappedSize, the default is 500MB, but you can setup any size you likes in standard log4Net configuration.

Gian Maria.
