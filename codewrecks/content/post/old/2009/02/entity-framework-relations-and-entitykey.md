---
title: "Entity Framework relations and entityKey"
description: ""
date: 2009-02-18T04:00:37+02:00
draft: false
tags: [NET framework,Entity Framework]
categories: [NET framework,Entity Framework]
---
Suppose you generate an Entity Framework model on standard northwind database, you have a customer id and you want to generate an order for that customer. A possible solution is

{{< highlight CSharp "linenos=table,linenostart=1" >}}
using (ModelTestBase context = new ModelTestBase())
{
   Orders order = new Orders();
   order.Freight = 1.0M;
   order.RequiredDate = order.OrderDate = DateTime.Now;
   order.Customers = context.Customers.Where(c => c.CustomerID == "ALFKI").First();
   context.AddToOrders(order);
   context.SaveChanges();

}{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

This code is perfectly valid, but is not the smartest thing to do, if you analyze traffic with profiler you can verify that this code executes a select to retrieve the customer, and then inserts the order into orders table. The question is, since I already have the ID of the customer *why I need to retrieve the whole customer instance from database only to set a relation?*. When you need to setup a relations EF needs only to know the key of related object, it does not really cares about other properties of Customers object, it needs only the key to set the foreign key, a better solution is the following

{{< highlight xml "linenos=table,linenostart=1" >}}
 1 using (ModelTestBase context = new ModelTestBase())
 2 {
 3    Orders order = new Orders();
 4    order.Freight = 1.0M;
 5    order.RequiredDate = order.OrderDate = DateTime.Now;
 6    IEnumerable<KeyValuePair<string, object>> entityKeyValues = 
 7       new KeyValuePair<string, object>[] { 
 8        new KeyValuePair<string, object>("CustomerID", "ALFKI") };
 9    EntityKey key = new EntityKey("ModelTestBase.Customers", entityKeyValues);
10    order.CustomersReference.EntityKey = key;
11 
12    context.AddToOrders(order);
13    context.SaveChanges();
14 }{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

The core difference is in lines 6-10, I simply create an EntityKey object for the "ModelTestBase.Customers" object specifying its key value. This code inserts the order and sets the relation without the need to load the customer object. This stuff works only to set relations, if you try to call order.CustomersReference.Load() to load related customer you will get exception, if you call it before the order object is attached to the context you get:

* **The EntityReference could not be loaded because it is not attached to an ObjectContext.** *

This is the expected behavior, after all if the order is still transient it cannot load anything, but if you attach the order with AddToOrders() before calling the Load method you will get another exception

* **The source query for this EntityCollection or EntityReference cannot be returned when the related object is in either an added state or a detached state and was not originally retrieved using the NoTracking merge option.** *

This is annoying because I have a valid order object, it is attached to the context so the [RelationshipManager](http://blogs.msdn.com/dsimmons/archive/2007/12/02/concepts-part-ii-relationships.aspx) should really loads the Customer Entity for me. It turns out that loading from an entity that is in state *added*is not a safe stuff, here is correct snippet

{{< highlight csharp "linenos=table,linenostart=1" >}}
EntityKey key = new EntityKey("ModelTestBase.Customers", entityKeyValues);
order.CustomersReference.EntityKey = key;
context.AddToOrders(order);
context.SaveChanges();
Console.WriteLine(order.Customers);
order.CustomersReference.Load();
Console.WriteLine(order.Customers);{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

Now after the order object was committed and is not anymore in added state you can load related customer.

Another interesting operation you can do with an entity key is retrieving an entity given its key.

{{< highlight xml "linenos=table,linenostart=1" >}}
using (ModelTestBase context = new ModelTestBase())
{
   IEnumerable<KeyValuePair<string, object>> entityKeyValues =
     new KeyValuePair<string, object>[] { 
                                            new KeyValuePair<string, object>("CustomerID", "ALFKI") };

   // Create the  key for a specific SalesOrderHeader object. 
   EntityKey key = new EntityKey("ModelTestBase.Customers", entityKeyValues);
   Customers c = (Customers) context.GetObjectByKey(key);
}{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

This code is really verbose,  but it is clearer than retrieving the object with a LINQ query, after all I should have a good way to load an object by key, not using a query with First(). It turns out that you could create an extension method to make your life simpler.

{{< highlight CSharp "linenos=table,linenostart=1" >}}
public static class EFExtensions
{

   public static T LoadByKey<T>(this ObjectContext context, String propertyName, Object keyValue)
   {
      IEnumerable<KeyValuePair<string, object>> entityKeyValues =
         new KeyValuePair<string, object>[] { 
           new KeyValuePair<string, object>(propertyName, keyValue) };

      // Create the  key for a specific SalesOrderHeader object. 
      EntityKey key = new EntityKey(context.GetType().Name + "." + typeof(T).Name, entityKeyValues);
      return (T)context.GetObjectByKey(key);
   }
}{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

This extension method will apply to all objectcontext objects, it needs caller to specify type of the entity to load, name of the key property and value to retrieve key property. It works only with entities with single value key, but I left to the reader the task to extend it to supply multiple valued keys. Now you can load a Customer by Key with this code

{{< highlight xml "linenos=table,linenostart=1" >}}
Customers c = context.LoadByKey<Customers>("CustomerID", "ALFKI");{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

I wonder why such a method was not included in the base definition of the objectContext.

Alk.

Tags: [Entity Framework](http://technorati.com/tag/Entity%20Framework) [.NET Framework](http://technorati.com/tag/.NET%20Framework)
