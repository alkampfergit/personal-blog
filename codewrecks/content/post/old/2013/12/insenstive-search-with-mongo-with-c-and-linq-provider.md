---
title: "Insenstive search with Mongo with C and LINQ provider"
description: ""
date: 2013-12-11T11:00:37+02:00
draft: false
tags: [LINQ,Mongo]
categories: [NoSql]
---
Searching for a **case insensitive match in mongo** is really simple, because it has full support for regular expression. As an example if you want to find all properties that is equal to a certain text with case insensitive search you can issue this query

`db.xxxx.find( { myProperty: /^text$/i } );`

This query uses a regular expression and the final i is specification for an insensitive search. The other characters are

<font face="Consolas">^ = Start of the string<br>$ = End of the string</font>

Basically you are searching with a regex to find all documents with a property called myProperty with value text and with case insensitive search. The obvious question people have when it is time to do query in C# with the LINQ provider is  **“how can I specify a regex with the provider” or more simple “how can I issue a case insensitive search with LINQ provider?”** The answer is really simple: most of the work is done by the LINQ provider. You should remember that a LINQ provider is a component that translate a LINQ query in something else, and for Mongo LINQ provider this mean that a LINQ query is translated into a corresponding MongoQuery. Look at this example

{{< highlight csharp "linenos=table,linenostart=1" >}}


var collection = databaseTest.GetCollection<User>("QueryRegex");
...
IQueryable<User> query = collection.AsQueryable();
query = query.Where(u => u.OtherProperty.ToLower().Contains("test"));
var mongoQuery = ((MongoQueryable<User>)query).GetMongoQuery();

Console.WriteLine(" u.OtherProperty.ToLower().Contains(\"test\"): " + mongoQuery);

{{< / highlight >}}

This snippet simply creates a LINQ query and  **it is calling ToLower() and Contains on a property of type string of an object**. The important fact is that II use the GetMongoQuiery method of the MongoQueryable object to obtain the real Mongo Query that is the result of the translation of LINQ query. This permits you to inspect how LINQ query is actually translated. If you run this code you find that the query is.

<font face="Consolas">{ &#8220;OtherProperty&#8221; : /test/is }</font>

As you can verify the code translates to a standard Mongo Regular Expression to search “test” and using insensitive search. When LINQ provider find a call to ToLower() method automatically try to express the query with case insensitive. This mean that the following query.

{{< highlight csharp "linenos=table,linenostart=1" >}}


query = query.Where(u => u.OtherProperty.ToLower() == "test");

{{< / highlight >}}

Will be translated to

<font face="Consolas"> { &#8220;OtherProperty&#8221; : /^test$/i }</font>

As you can see, generated regular expression is now different **, because we want an exact match, but with case insensitive** and again is the duty of LINQ provider to create the correct mongo query. You can find all the options in the official page of Mongodb.org ([http://docs.mongodb.org/ecosystem/tutorial/use-linq-queries-with-csharp-driver/](http://docs.mongodb.org/ecosystem/tutorial/use-linq-queries-with-csharp-driver/)) where you can find lots of example of how to query with LINQ provider.

Gian Maria
