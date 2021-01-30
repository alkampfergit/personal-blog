---
title: "Rename a property in RavenDb"
description: ""
date: 2012-02-08T17:00:37+02:00
draft: false
tags: [RavenDB]
categories: [NoSql,RavenDB]
---
Previous posts on the NoSql and Raven Series

- [NoSql and a life without Schema](http://www.codewrecks.com/blog/index.php/2012/02/04/nosql-and-a-life-without-schema/)
- [NoSql and a life without schema continued](http://www.codewrecks.com/blog/index.php/2012/02/06/nosql-and-a-life-without-schema-continued/)

Other posts by Mauro on RavenDb Subject.

- [RavenDb: Start your engines](http://mauroservienti.blogspot.com/2012/01/ravendb-start-your-engines.html)
- [RavenDb: First Contact](http://mauroservienti.blogspot.com/2012/02/ravendb-first-contact.html)

In previous articles I showed how simple is to store objects inside a NO SQL database because the data storage has no schema and does not require you to specify the format of your data. I decided to use RavenDb as a NoSql storage to show some basic concepts of NoSql and I showed also how simple is to add a new property to a document, because RavenDb takes care of everything, just save and load objects and the new property is just there.

Now I want to deal with a different kind of problem:*what happen when you rename a property of a document that has already some instances saved in database*?

This is the typical situation where having No Schema does not solves the problem automatically. Suppose you change the Player document *renaming  **Description** property to  **Background** *, if you load an old document from the database, since the Description property does not exists anymore, it is ignored and when the object is saved again, it will be deleted. Clearly this is unacceptable because it lead to data loss, so there is some need of manual intervention to handle the scenario of property rename.

There are multiple approaches to solve this problem, but the simplest one is verifying if your NoSql storage supports the concepts of Bulk-Updating documents, a feature that is really well supported by RavenDb.

RavenDb natively support the concept of   **Document Patch** , a technique used to update a single document without the need to load the entire object or replacing its entire content. Basically a Patch is a dedicated command that transform a stored document directly in the store; along the many different type of patches supported by RavenDb you can use the ***rename* *patch***specifically designed to change the name of a property. The code is really simple, just reference the assembly *Raven.Abstractions*and write this code.

{{< highlight csharp "linenos=table,linenostart=1" >}}
store.DatabaseCommands.Patch("Players/1",
new[] { new PatchRequest() {
Type = PatchCommandType.Rename,
Name = "Description",
Value = new RavenJValue("Background"),
}
;
{{< / highlight >}}

The syntax is really simple, the IDocumentStore has a property called * **DatabaseCommands** *used to access all commands supported by RavenDb engine; with this property you can call the * **Patch()** *method specifying the Id of the object you want to patch and an array of PatchRequest (you can ask to apply a sequence of patches, in this example I only want to rename a property). To request a Patch operation you need to specify the type of *Patch*you want to execute, in this example * **PatchCommandType.Rename** *, then you need to fill the appropriate properties of PatchRequest object, required by the type of the path you are issuing. To rename a property you need to specify the  **Name** of the property in the  **Name** field and the new name of the property in the  **Value** parameter, passed as RavenJValue element.

This technique is useful but it does not solve our original problem, because it * **patches a single entity** *, while our need is to rename the property *Description of all saved documents of type Player*, so we need to use a different type of operation called: [set-based-operation](http://ravendb.net/docs/client-api/set-based-operations). A set-based-operation is an operation that operates on multiple documents at once, in its most basic form it request an *index*to identify the list of documents to modify and a list of Patch operation*.*The whole concept of indexes is a really fundamental concept in RavenDb and in all NoSql database, but for this specific need just think to index as a *way to create a query that identify documents in database*. To define an index by code you must create a specific class for the index, but I can easily create an index with RavenStudio. In  **Figure 1** I created an index to identify all the documents of type Players.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2012/02/image_thumb4.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2012/02/image4.png)

 ***Figure 1***: *Define an index in RavenStudio*

To define a simple index you just need to give it a name and write the text of the index. The index starts with * **from doc in docs** *, this part is used to query all documents of the database, then I specify a restriction with the keyword * **where** *followed by the condition.

In this example the condition is doc[”@metadata”][“Raven-Entity-Name”] == “Players”, and uses [RavenDb Metadata](http://ravendb.net/docs/client-api/advanced/document-metadata), a series of internal properties that RavenDb attach to each saved document. One of this metadata is called * **Raven-Entity-Name** *and for.NET object is the name of the class followed by an s to pluralize the name. In my example, since the.NET class saved is called “Player” the Raven-Entity-Name is equal to “Players”. The last part of the Index Map is the select clause, where I simply select property Name of the document, but it is not important for our example, because I’m only interested in creating an index to *identify all documents that corresponds to Player entity.*

You can execute the index from RavenDb Studio just to verify that it works as intended and it selects all the entities of desired type. When the index is ok you are able to issue a Set-Based-Patch operation:

{{< highlight csharp "linenos=table,linenostart=1" >}}
store.DatabaseCommands.UpdateByIndex("PlayersToBeUpdated",
new IndexQuery(),
new [] {new PatchRequest() {
Type = PatchCommandType.Rename,
Name = "Description",
Value = new RavenJValue("Background"),
}
});
{{< / highlight >}}

As you can see the syntax is really similar to the previous example, the main difference is that you should not use the * **Patch()** *  database command but * **UpdateByIndex()** *that requires:

- the name of the index to use
- an index query (to specify index parameters, if any)
- the list of Patches request.

The above command basically means:

*Apply the list of Patches to all object identified by the index named “PlayersToBeUpdated”*

This simple call updates all Player objects saved in database, renaming the property, as you can verify from RavenDb Studio.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2012/02/image_thumb5.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2012/02/image5.png)

 ***Figure 2***: *Description property was renamed to Background*

As you can see, even if NoSql databases does not require schema, if you refactor your documents changing the name of existing properties, you need to update all saved data to reflect your changes.

In the next series of posts I’ll deal with RavenDb HTTP API to show how to rename a property directly with HTTP requests, without the need to use C# code. This is useful if you want easily to generate a bat script that updates documents using only HTTP Requests.

Gian Maria
