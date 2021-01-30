---
title: "MongoDB and concept of identity in NoSql db"
description: ""
date: 2012-02-27T10:00:37+02:00
draft: false
tags: [NoSql]
categories: [NoSql]
---
Previous posts on the [NoSql](http://www.codewrecks.com/blog/index.php/tag/nosql/) and Raven Series

- [NoSql and a life without Schema](http://www.codewrecks.com/blog/index.php/2012/02/04/nosql-and-a-life-without-schema/)
- [NoSql and a life without schema continued](http://www.codewrecks.com/blog/index.php/2012/02/06/nosql-and-a-life-without-schema-continued/)
- [Rename a property in RavenDb](http://www.codewrecks.com/blog/index.php/2012/02/08/rename-a-property-in-ravendb)
- First [Touch of RavenDb HTTP API](http://www.codewrecks.com/blog/index.php/2012/02/13/first-touch-of-ravendb-http-api/)
- [Renaming property in RavenDb with HTTP API](http://www.codewrecks.com/blog/index.php/2012/02/20/renaming-a-property-in-ravendb-with-http-api/)

Other posts by Mauro on [RavenDb](http://ravendb.net/) Subject.

- [RavenDb: Start your engines](http://mauroservienti.blogspot.com/2012/01/ravendb-start-your-engines.html)
- [RavenDb: First Contact](http://mauroservienti.blogspot.com/2012/02/ravendb-first-contact.html)
- [RavenDB: Storing Data](http://mauroservienti.blogspot.com/2012/02/ravendb-storing-data.html)

In this article I deal with a different NoSql database called [MongoDb](http://www.mongodb.org/) a mature NoSql engine born outside the.NET world to clarify the concept of Id in a typical No Sql database. [Installation](http://www.mongodb.org/display/DOCS/Windows+Service) of Mongo is really simple, just download, uncompress, locate the  **bin** folder, and type this from an Administrator Console Prompt to install Mongo as service

{{< highlight csharp "linenos=table,linenostart=1" >}}
mongod --install --logpath c:\xxxx --dbpath c:\yyyy
{{< / highlight >}}

You can find plenty of installation guide on the internet, but with the above install command you create a windows service that will Automatically start MongoDb on your machine using specified datafolder. Now you should download the C# driver to connect from.NET code, but if you like using LINQ you can install fluent mongo directly with nuget.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2012/02/image_thumb8.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2012/02/image8.png)

 ***Figure 1***: *Install fluent mongo with nuget.*

Fluent Mongo is a library that gave little LINQ capability over standard drivers, but adding a nuget reference to fluentmongo you get automatically a reference to the official drivers. Now you are ready to insert your first record in MongoDb with the above code.

{{< highlight csharp "linenos=table,linenostart=1" >}}
MongoServer server = MongoServer.Create();
MongoDatabase databaseTest = server.GetDatabase("TEST");
var untyped = databaseTest.GetCollection("UNTYPED");
untyped.Save(new BsonDocument { { "Name", "Untyped1" } });
BsonDocument secondDocument = BsonDocument.Parse("{Name: 'Untyped2', BlaBla: 'Bla Bla Value'}");
untyped.Save(secondDocument);{{< / highlight >}}

In line1 I create a connection to MongoDb server passing no parameter to connect to local MongoDb server, then I obtain a reference to a MongoDatabase object called “TEST” with MongoServer::GetDatabase() method and finally I get a reference to a collection named “UNTYPED” with the MongngoDatabase::GetCollection () Method. This is quite similar to a Sql Server or other SQL Database, you have a server, the server contains several databases, and each database is composed by tables; in the same way mongo is divided into Server/Database/Collection where a Collection contains Document.

MongoDB stores data in JSON format and to insert data inside a collection you can simply create a BsonDocument, an object defined by C# driver assembly that is capable to represent a document composed by a series of Key-Value pair. To initialize a BsonDocument you can pass a ICollection (line 4) or if you feel more confortable with String JSON representation, you can user BSonDocument.Parse() to specify the document directly with a JSON String.

After you inserted the above documents you can use [MongoVue](http://mongovue.com/) to see what is contained inside the database.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2012/02/image_thumb9.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2012/02/image9.png)

 ***Figure 2***: *Use mongovue to see what is inside the database*

The interesting aspect is that each document has an unique Id, even if I did not specified any special property in the code. This is  a standard behavior for NoSql databases, if you did not specify any id property the database engine will create unique id on his own to idendify the docuemnt. The id is a key factor for Mongo and other NoSql storage, if you try to store a document directly inside the collection specifying JSON content you will get an error.

{{< highlight csharp "linenos=table,linenostart=1" >}}
untyped.Save("{Name: 'Json', Attribute:'attribute content'}");
{{< / highlight >}}

The MongoCollection object contains a Save object that accepts a String, but the above call will fail with the error * **Subclass must implement GetDocumentId**.*Previous code works because one of the specific functionality that a BSonDocument implements is the ability to manage Id generation, but plain JSON does not have this capability. If you need to know the Id generated by the database, you can query the BSonDocument for its unique id *after it was saved in a Mongo collection*. (remember that the Id is not available until you save the Document).

{{< highlight csharp "linenos=table,linenostart=1" >}}
BsonDocument secondDocument = BsonDocument.Parse("{Name: 'Untyped2', BlaBla: 'Bla Bla Value'}");
Object id;
Type idType;
IIdGenerator generator;
untyped.Save(secondDocument);
secondDocument.GetDocumentId(out id, out idType, out generator);
{{< / highlight >}}

Basically you are asking to your BsonDocument to return you the generated Id, as well as the type of the id and the generator that Mongo used to generate that specific Id. The result is represented into this snippet

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2012/02/image_thumb10.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2012/02/image10.png)

 ***Figure 3***: *The three object that you got with a call to GetDocumentId: Id, IdType and the generator.*

As you can see the Id is an instance of type MongoDb.Bson.ObjectId, based on BsonValue base class and the generator is an instance of ObjectIdGenerator. This type of Id is specific to Mongo, and the documentation states that an ObjectId is

> A BSON ObjectID is a 12-byte value consisting of a 4-byte timestamp (seconds since epoch), a 3-byte machine id, a 2-byte process id, and a 3-byte counter. Note that the timestamp and counter fields must be stored big endian unlike the rest of BSON. This is because they are compared byte-by-byte and we want to ensure a mostly increasing order.

If you want to have a generator that creates integer id, like Identity column in SQL Server, you will find that it is simply not available out of the box, because an Int value is not guarantee to be unique if you use sharding. Sharding is a technique that permits to partition data into different physical instances, so each instance should generates Ids that are unique across all instances and this prevents the use of a simple Int32 id. Clearly in.NET World a Guid is guarantee to be unique and is more.NET oriented, so Mongo Db has a Guid id generator, that can be specified with the above snippet of code..

{{< highlight csharp "linenos=table,linenostart=1" >}}
BsonDocument thirdDocument = BsonDocument.Parse("{Name: 'Untyped3', AnotherProperty: 'xxxxxxxxxxxxxxxxxxxxxxx'}");
var id2 = MongoDB.Bson.Serialization.IdGenerators.GuidGenerator.Instance.GenerateId(untyped, thirdDocument);
thirdDocument.SetDocumentId(id2);
untyped.Save(thirdDocument);
{{< / highlight >}}

The key is using the [GuidGenerator](http://api.mongodb.org/csharp/1.0/html/bed040ae-3f13-e645-b18d-b90db061cdd5.htm) (in the MongoDb.Bson.Serialization.IdGenerators namespace) to generate a valid MongoId Guid value, then call the [SetDocumentId](http://api.mongodb.org/csharp/1.0/html/22d1ae80-7d42-6cf6-9b93-4cb904a431c0.htm) method of BsonDocument to manually set the id and not relay on automatic id generation. If you look at the db you will find that the document with Guid id has really a different id type.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2012/02/image_thumb11.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2012/02/image11.png)

 ***Figure 4***: *The document with Guid Id is represented in a different way in mongovue, but as you can verify there is no problem in having documents with different id types in the same collection.*

This demonstrates that a No Sql database has a concept of Document Id that is similar to the concept of Id of a standard Sql Server, you can use a native Id generation of the engine that generates a valid id during insertion or you can assign your own Id to the document, but basically the whole concept of Id is more Engine-Related and has no business meaning, so I strongly discourage to use anything that has a business meaning as Id of a document. Noone prevents you to insert in the document a property called “MyId” or something else that has a business meaning and can be used as logical Id and let the Engine handle the internal Id by itself.

Gian Maria.
