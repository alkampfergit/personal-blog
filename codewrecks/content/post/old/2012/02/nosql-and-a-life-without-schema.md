---
title: "NoSql and a life without Schema"
description: ""
date: 2012-02-04T07:00:37+02:00
draft: false
tags: [RavenDB]
categories: ["NoSql"]
---
NoSql is not a replacemente for SQL databases, but it is a valid alternative for a lot of situations where standard SQL is not the best approach to store your data. Since we were taught that whenever you need to store data on a “data store” and you need to query that data for retrieval, SQL is the best solution, you have only to decide what Sql Engine to use and the game is done.

In 2012 this sentence has proven wrong, what I mean is that is not possible to assume anymore that SQL is the “only way to go” to store data; but you should be aware that other alternative exists and it is called NO SQL. Under this term we have various storage engine that are not based on SQL and in.NET we have an exceptional product called RavenDB (you can find a really good introduction to RavenDb in [Mauro’s Blog](http://mauroservienti.blogspot.com/2012/01/ravendb-start-your-engines.html)).

The first big difference with standard Sql is being Schemaless. One of the most annoying restriction of Sql Server is the need to specify exactly the format of the data you want to store inside your storage. This is needed for a lot of good reason, but there are situation when you really does not care about it, especially if your software is heavily based on OOP concepts. Suppose you have this object

{{< highlight csharp "linenos=table,linenostart=1" >}}
class Player
{
public String Name { get; set; }
 
public DateTime RegistrationDate { get; set; }
 
public Int32 Age { get; set; }
}
{{< / highlight >}}

For a moment do not care about the fact that this object is not well encapsulated (it has public getter and setter) but focus only on the need to *“store” this object somewhere*. If you use a standard Sql storage, first of all you need to create a table, then define columns, decide maximum length for the Name column and finally decide an ORM to use or build a dedicate data layer and finally you can save the object.

If you work with raven, this is the only code you need

{{< highlight csharp "linenos=table,linenostart=1" >}}
var store = new DocumentStore { Url = "http://localhost:8080" };
store.Initialize();
using (var session = store.OpenSession())
{
var player = new Player
{
Age = 30,
RegistrationDate = DateTime.Now,
Name = "Alkampfer",
};
session.Store(player);
session.SaveChanges();
}
{{< / highlight >}}

I simply created a DocumentStore based on a local server, opened a session and saved an object, I did not defined anything on the server, I did not need to have an ORM, the server simply takes the object and save it, period!

I liked very much this approach because

*I needed to save an object to a data storage and everything I need is just a two function all, Store to tell the storage the object I want to save and SaveChanges that actually do the save.*

What I got with this simple snippet of code? Just browse with a standard browser to the address of the server and you should see the content of the database.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2012/02/image_thumb.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2012/02/image.png)

 ***Figure 1***: *Content of the database after insertion of a simple object*

From  **Figure 1** you can see content of the raven database, it contains a player and the little 1 beside the object is the Id that Raven uses internally to uniquely identify that object. The other object called *Sys Doc Hilo/players* takes care of id generation for Players object with an Hilo algorithm.

That’s all folks, no need to define schema, no need to have special Id property or any other requirement to make the object compatible with the store, just call Store method on whatever.NET object and your object is inside the database, Period!.

This is only a scratch of the many functionalities of RavenDb :), more to come in my blog and in [Mauro’s one](http://mauroservienti.blogspot.com/).

Gian Maria.
