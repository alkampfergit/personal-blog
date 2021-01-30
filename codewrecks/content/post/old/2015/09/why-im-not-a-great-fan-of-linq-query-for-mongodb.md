---
title: "Why Irsquom not a great fan of LINQ query for MongoDb"
description: ""
date: 2015-09-26T08:00:37+02:00
draft: false
tags: [MongoDb]
categories: [NoSql]
---
I’m not a great fan of LINQ provider in Mongo, because I think that  **developers that start using only LINQ misses the best part of working with a Document Database**. The usual risk is: developer always resort to LINQ queries to load-modify-save a document instead of using all [powerful update operators available in Mongo](https://docs.mongodb.org/manual/reference/operator/update/).

Despite this consideration, if you need to retrieve full document content, sometimes writing a LINQ query is the simplest approach, but, as always, not every valid LINQ statement you can write can be translated to MongoQuery. This is the situation of this query.

{{< highlight csharp "linenos=table,linenostart=1" >}}


//apply security filtering.
documentsQuery = documentsQuery
 .Where(d =&gt; d.Aces.Any(a =&gt; permittingAces.Contains(a)))
 .Where(d =&gt; !d.Aces.Any(a =&gt; denyingAces.Contains(a)));

{{< / highlight >}}

I need to filter all documents, finding documents where Aces property (is a simple HashSet&lt;String&gt;) contains at least one of the aces in permittingAces list but should not contain any aces listed in denyingAces collection. While this is a perfectly valid LINQ query, if you try to issue it to Mongo you got a:

> Any is only support for items that serialize into documents. The current serializer is StringSerializer and must implement IBsonDocumentSerializer for participation in Any queries.

You can use Any with sub-objects, but  **expressing an Any condition on an array of string is not supported**. To overcome this limitation,.NET provider for MongDb provide a convenient [ContainsAny](https://mongodb-documentation.readthedocs.org/en/latest/ecosystem/tutorial/use-linq-queries-with-csharp-driver.html) extension operator to write previous query.

{{< highlight csharp "linenos=table,linenostart=1" >}}


documentsQuery = documentsQuery
 .Where(d =&gt; d.Aces.ContainsAny(permittingAces))
 .Where(d =&gt; !d.Aces.ContainsAny(denyingAces));

{{< / highlight >}}

This LINQ query works perfectly, and if you are curious **how this query translated to standard MongoQuery, you can use the GetMongoQuery() method, as I’ve** [**described in previous post**](http://www.codewrecks.com/blog/index.php/2013/12/11/insenstive-search-with-mongo-with-c-and-linq-provider/).

This simple example shows you some of the limitation that you can encounter using LINQ provider in MongoDb, and my suggestion is to always prefer  **using standard MongoQuery because it gives you lots of more flexibility, especially for update operations**.

Another reason in the past to stay away from the LINQ provider is that the older version of the driver, still used by large amount of persons, had a really bad implementation of the Select LINQ operator, because the projection is done client side, as stated [here](http://mongodb.github.io/mongo-csharp-driver/1.10/linq/):

>  **WARNING** > 
> `Select` does not result in fewer fields being returned from the server. The entire document is pulled back and passed to the native `Select` method. Therefore, the projection is performed client side.

This is a great problem, because **the whole document is always returned from the server, using more bandwidth and more resource server side**. Remember that one of the standard optimization when you issue query to MongoDb instance is reducing the amount of field you are loading from your document. If you use old LINQ provider and you are doing Select to retrieve less field from the server, you are wasting your time, because you are loading always the whole document.

Gian Maria.
