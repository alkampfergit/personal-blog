---
title: "Renaming a property in RavenDb with HTTP API"
description: ""
date: 2012-02-20T08:00:37+02:00
draft: false
tags: [RavenDB]
categories: [NoSql,RavenDB]
---
Previous posts on the [NoSql](http://www.codewrecks.com/blog/index.php/tag/nosql/) and Raven Series

- [NoSql and a life without Schema](http://www.codewrecks.com/blog/index.php/2012/02/04/nosql-and-a-life-without-schema/)
- [NoSql and a life without schema continued](http://www.codewrecks.com/blog/index.php/2012/02/06/nosql-and-a-life-without-schema-continued/)
- [Rename a property in RavenDb](http://www.codewrecks.com/blog/index.php/2012/02/08/rename-a-property-in-ravendb)
- First [Touch of RavenDb HTTP API](http://www.codewrecks.com/blog/index.php/2012/02/13/first-touch-of-ravendb-http-api/)

Other posts by Mauro on [RavenDb](http://ravendb.net/) Subject.

- [RavenDb: Start your engines](http://mauroservienti.blogspot.com/2012/01/ravendb-start-your-engines.html)
- [RavenDb: First Contact](http://mauroservienti.blogspot.com/2012/02/ravendb-first-contact.html)
- [RavenDB: Storing Data](http://mauroservienti.blogspot.com/2012/02/ravendb-storing-data.html)

In third post of the series, I dealt with renaming of properties in an entity that has already some instances saved in RavenDB. The solution proposed was based on [PATCH](http://old.ravendb.net/documentation/docs-http-api-patch) commands issued by C# code based on an Index created with RavenStudio, but now that I showed you how to issue HTTP API request, it is time to understand how to issue [set-based PATCH](http://old.ravendb.net/documentation/set-based) commands to modify multiple documents with simple HTTP call.

First of all I want to refresh the concept that a Set-Based operation operates on indexes, thus if you want to PATCH multiple documents at once, you should create an index that identify all the documents you want to PATCH. We already saw how to create an index that identify all Documents of a certain type with C#, but if you want to create an index with HTTP api you can simple issue this Curl command

{{< highlight csharp "linenos=table,linenostart=1" >}}
curl -X PUT http://localhost:8080/indexes/PlayersToBeUpdated
-d "{ Map: 'from doc in docs where doc[\"@metadata\"][\"Raven-Entity-Name\"] == \"Players\" \r\nselect new { doc.Name}'}
{{< / highlight >}}

the –X PUT is used to specify a PUT request, used to store something in database, the address identifies the name of the index and should respect the mask: http://xxx.xxx.xxx.xxx<font color="#151515">:port</font>/indexes/ **nameoftheindex, –** d option identify the body of the request, and it is absolutely equal to the one showed in [previous post](http://www.codewrecks.com/blog/index.php/2012/02/08/rename-a-property-in-ravendb/) from RavenDbStudio. The advantage of creating the index with HTTP API is the ability to include it in a simple Batch or script command, without the need to pass from the UI of RavenDbStudio.

Now you can issue the PATCH command to operate on all entities that satisfy the index.

{{< highlight csharp "linenos=table,linenostart=1" >}}
curl -X PATCH http://localhost:8080/bulk_docs/PlayersToBeUpdated
-d "[{Type: 'Rename', Name: 'Description', Value: 'Background'}]"
{{< / highlight >}}

The HTTP API command to PATCH documents based on an index is really simple, just issue a PATCH call specifying the index to use and the payload should contain the details of PATCH operation, as [described in the documentation](http://old.ravendb.net/documentation/docs-http-api-patch). If the index was created only to issue the PATCH command, you can now safely delete it with this call

{{< highlight csharp "linenos=table,linenostart=1" >}}
curl -X DELETE http://localhost:8080/indexes/PlayersToBeUpdated
{{< / highlight >}}

Thanks to three command line HTTP API calls you are able to rename a property for all documents of a certain type in a RavenDb from a simple batch script, that you can include for example in your software setup procedure to update all documents in case of a Property Rename.

Gian Maria.
