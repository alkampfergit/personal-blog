---
title: "Extension method to add LoadByKey to EntityFrameworks context"
description: ""
date: 2009-02-18T05:00:37+02:00
draft: false
tags: [Entity Framework]
categories: [Entity Framework]
---
In [previous post](http://www.codewrecks.com/blog/index.php/2009/02/18/entity-framework-relations-and-entitykey/) I left to the reader the task to build a LoadByKey extension method to make it easy loading entities by key in project with entity framework, I think that is quite interesting to spent a little bit on in. First of all I suggest you to read [this post](http://www.scip.be/index.php?Page=ArticlesNET24#Metada) about metadata and Entity Framework, this post suggested me this solution.

{{< highlight sql "linenos=table,linenostart=1" >}}
 1 public static T LoadByKey<T>(this ObjectContext context, params Object[] keyValue)
 2 {
 3    EntityType type = (from meta in context.MetadataWorkspace.GetItems(DataSpace.CSpace)
 4                      where meta.BuiltInTypeKind == BuiltInTypeKind.EntityType
 5                      select meta)
 6                     .OfType<EntityType>()
 7                     .Where(e => e.Name == typeof(T).Name).Single();
 8    IEnumerable<KeyValuePair<string, object>> entityKeyValues =
 9        type.KeyMembers.Select((k, i) => new KeyValuePair<string, object>(k.Name, keyValue[i]));
10 
11    EntityKey key = new EntityKey(context.GetType().Name + "." + typeof(T).Name, entityKeyValues);
12    return (T)context.GetObjectByKey(key);
13 }{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

In line 3 I begin a query to load the [EntityType](http://msdn.microsoft.com/en-us/library/system.data.metadata.edm.entitytype.aspx) object related to the type of object I need to load. The [System.Data.Metadata.Edm](http://msdn.microsoft.com/en-us/library/system.data.metadata.edm.aspx) namespace is a place where you can find plenty of information about how your data is structured. I simply query the MetadataWorkspace getting the items of type [DataSpace.CSpace](http://msdn.microsoft.com/en-us/library/system.data.metadata.edm.dataspace.aspx) or the *Conceptual Model.* The Conceptual model can be tricky to use, to familiarize with it I suggest you to use [LINQPad](http://www.linqpad.net/) to run the query of line 3, you get this result (all properties collapsed)

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2009/02/image-thumb4.png)](http://www.codewrecks.com/blog/wp-content/uploads/2009/02/image4.png)

Now you can simply suppose that KeyMembers property of an entityType contains all the KeyProperties, if you expand it you will see this result

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2009/02/image-thumb5.png)](http://www.codewrecks.com/blog/wp-content/uploads/2009/02/image5.png)

YATTA! This permits me to find name/s of key properties and I can use LINQ to create desidered EntityKey (line 8-11)

{{< highlight xml "linenos=table,linenostart=1" >}}
 IEnumerable<KeyValuePair<string, object>> entityKeyValues =
       type.KeyMembers.Select((k, i) => new KeyValuePair<string, object>(k.Name, keyValue[i]));
   EntityKey key = new EntityKey(context.GetType().Name + "." + typeof(T).Name, entityKeyValues);{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

Ok, this code could be made more efficient avoiding the call to GetType and Metadata for each call, you can use static variables or you can use cache to store the list of KeyProperty for each object in a dictionary or similar structure. Now you can use this code to load entities knowing their keys

{{< highlight xml "linenos=table,linenostart=1" >}}
Order_Details c = context.LoadByKey<Order_Details>(10248, 11);
Console.WriteLine(c.UnitPrice);

Customers cust = context.LoadByKey<Customers>("ALFKI");
Console.WriteLine(cust.ContactTitle);{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

It works for entities with single property key as well as entities like Order\_Details that have multiple keys; in this scenario you should pay a lot of attention to the order in witch the keys are declared to avoid confusion.

alk.

Tags: [Entity Framework](http://technorati.com/tag/Entity%20Framework) [.NET Framework.](http://technorati.com/tag/.NET%20Framework.)
