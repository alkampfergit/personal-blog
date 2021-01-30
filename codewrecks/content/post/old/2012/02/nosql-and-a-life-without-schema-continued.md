---
title: "NoSql and a life without Schema continued"
description: ""
date: 2012-02-06T08:00:37+02:00
draft: false
tags: [RavenDB]
categories: [NoSql,RavenDB]
---
In the first part I showed how simple is to store object inside a NoSql database like RavenDb, today I want to point out how cool is having no schema when it is time to add properties to your documents.

Suppose that your Player entity changed and you add a new property called Description and you already saved some Players on RavenDb. The question is: what happens when you try to save a new Player now that the class has another property? What happens when you load an old entity, that was saved when that property did not exist?

Since we have no schema we have absolutely no problem, just save another object to Raven and you can find that it got saved without even a warning.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2012/02/image_thumb1.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2012/02/image1.png)

 ***Figure 1***: *New object is saved without any problem even if it is different from the old one*

If you double click a Document (Raven call each object saved to the db a *Document*) you can simply look at its content and the new property called Description got saved without any problem.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2012/02/image_thumb2.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2012/02/image2.png)

 ***Figure 2***: *The object contains the new Description property*

Probably you had already recognized JSON format to store the object, but the question is, what happened to the old object saved before you added the Description property ? The answer is: it is still there, clearly without the Description property.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2012/02/image_thumb3.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2012/02/image3.png)

 ***Figure 3***: *The old object does not contain the Description property, but it can coexist with the new one without any problem*

Now if you load all object from the database, you can find that for this instance Description property is simply null, because it did not exists in the database, but no error or warning occurred. If you simply load all Player entities and finally issue a SaveChanges, as shown in the following snippet:

{{< highlight csharp "linenos=table,linenostart=1" >}}
using (var session = store.OpenSession())
{
foreach (var player in session.Query<Player>().ToList())
{
Console.WriteLine(player.Name + " " + player.RegistrationDate + " " + player.Description);
}
session.SaveChanges();
}
{{< / highlight >}}

you will end with an automatic update of object and now if you look in the database you can see in figure xxx now the player entity has a Description property equal to null

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2012/02/image16_thumb.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2012/02/image16.png)

 ***Figure 4***: *If you ask to SaveChanges, the old player object with id:1 is updated in Raven, now the Description property is present.*

The same happens for removed properties, they simply are ignored during the load process, and removed during the save.

This really trivial example shows how simple is to deal to add or remove a property from documents when your data storage is a NO SQL one and you have no need to define a schema.

Gian Maria.
