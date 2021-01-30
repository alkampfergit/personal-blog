---
title: "Mixing native query and LINQ in Mongo Query"
description: ""
date: 2015-04-21T03:00:37+02:00
draft: false
tags: [MongoDb]
categories: [NoSql]
---
Lets look at the following query issued to a standard MongoCollection&lt;T&gt; instance object:

{{< highlight csharp "linenos=table,linenostart=1" >}}


return _bufferCollection.Find(
        GetNextBlockQuery(lastTick, lastRevisionId))
   .OrderBy(d => d.LastUpdated)
   .ThenBy(d => d.RevisionIdNumeric);

{{< / highlight >}}

The method GetNextBlockQuery simply return a Query&lt;T&gt; query object expressed with C# mongo query syntax. In this query  **the result of Find() method is simply sorted using standard LINQ syntax**.

Do you spot where the problem is?

> Find() method returns an object of type  **MongoCursor&lt;T&gt; that implements IEnumerable&lt;T&gt; but not IQueryable&lt;T&gt;**.

If you query MongoCollection with LINQ using the AsQueryable() extension method, there is no problem using OrderBy() or ThenBy() LINQ extension methods. In this situation  **the implementation of IQueryable inside Mongo C# driver will translate everything to standard mongo query syntax,** then it executes translated query to the server and returns objects to the caller.

In previous example instead, the OrderBy() LINQ operator is invoked against a MongoCursor and  **ordering will be done in memory.** The problem is: OrderBy method will operate against IEnumerable object and iterates all the objects to return them in correct order.

> If you use LINQ operators against standard MongoCursor, it will operates in memory, hurting performances.

This will hurt performances of the application: each time the query is executed, * **the entire resultset is loaded into memory and then sorted.** *To avoid this problem, you need not to mix native Mongo C# query with LINQ operators. The correct query is the following one:

{{< highlight csharp "linenos=table,linenostart=1" >}}


 return _bufferCollection.Find(
      GetNextBlockQuery(lastTick, lastRevisionId))
     .SetSortOrder(SortBy<MongoIndexedDocument>
          .Ascending(d => d.LastUpdated, d => d.RevisionIdNumeric));

{{< / highlight >}}

This new version uses SetSortOrder() method of Mongo C# Query, so it will be sorted directly from Mongo server and objects will be loaded in memory during standard for-each enumeration.  **The above problem is really bad if you want to limit number of returned objects.** If you use a Take(50) method to obtain only 50 objects, actually you are loading the entire collection into memory, then returning the first 50 elements. This is really different from asking mongo to return only 50 elements directly in the query.

> One of the greatest problem is that if you limit number of record with LINQ operator Take()  on the first query, yoy are doing Client Side pagination, with significant performance loss.

As general rule, avoid mixing LINQ and Mongo query classes to issue query to your Mongo server, and  **prefer native Query syntax over LINQ because it will offer you the whole capabilities of Mongo**. LINQ query at the contrary will expose only a subset of possible queries, and beware that Select operator operates in memory, instead of limiting the number of returned field directly from the server.

Gian Maria.
