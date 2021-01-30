---
title: "Bulk insert in MongoDb with C driver"
description: ""
date: 2016-11-02T18:00:37+02:00
draft: false
tags: [MongoDb]
categories: [NoSql]
---
There are situation where you need to  **save a lot of documents inside a collection in MongoDb**. My scenario is a migration of documents from a collection to another database, with in-memory manipulation of the documents.

The most common error in these situation is to read the documents from the original collection, then execute a function that modify the document in-memory, and finally issuing an insert in destination collection. This is wrong because you have a roundrip against MongoDb for each document you are saving.

> Whenever you are calling Insert or Save function, you are paying the penality of a call to MongoDb process, network latency, etc, whenever possible you should reduce the number of calls to database engine.

In such a scenario  **MongoDb driver has a function called InsertBatch that allows you to insert document in batches** and the fun part is that it simply accepts an IEnumerable. As an example, I have a function that manipulate a BsonDocument stored in a variable called Action, I have source and dest database where I need to copy documents with manipulation and this is the code that does everything.

{{< highlight csharp "linenos=table,linenostart=1" >}}


 var sourceQueue = source.GetCollection(queue);
var destQueue = dest.GetCollection(queue);

if (sourceQueue.Count() == 0) return;

//migrate counterCollection
Console.WriteLine("Migrating Queue " + queue);
var allElement = sourceQueue.FindAll().AsEnumerable().Select(document =&gt; {	Action(document);	return document;});
destQueue.InsertBatch(allElement);

{{< / highlight >}}

The name of the collection is contained in queue variable (actually I’m transforming a software that manage jobs), and as you can verify  **I can simply enumerate all source documents with FindAll (this code uses old 1.10 driver), for each object I’m calling the Action function that manipulate the document, and finally I can simply use the InsertBatch to insert documents in batches.** This function runs really faster than saving each document with a separate call, event if the MongoDb instance runs on the very same machine, so you do not pay the network latency.

If you use latest version of the drivers, you have the InsertMany method that offers even more options and basically does the very same operation than InsertBatch.

Gian Maria.
