---
title: "LINQ to Sql retrieving Entities with stored or custom SQL"
description: ""
date: 2008-04-19T03:00:37+02:00
draft: false
tags: [LINQ]
categories: [LINQ]
---
During Heroes launch in Ancona (Italy) one of my friend ask me if there is the possibility in LINQ to SQL to map a stored procedure to a method of an object and then have that method return Mapped Entities.

Let’s give an asnwer to this question. The first thing to notice is that the DataContext is able to do this, you can for example creates a stored called GetGoldCustomer on northwind database, having this stored accept an integer parameter called @ordercount, and returns all field from customer for customer that had more than @ordercount orders. now you can simply drag and drop that stored into the surface of the DBML designer, this add a method to the context that calls the stored. If you drag the stored on the surface of Customer Object you are telling the designer that the result of the stored should be converted to Customer Entity Object, or you can change the return type whenever you want.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2008/04/image-thumb3.png)](https://www.codewrecks.com/blog/wp-content/uploads/2008/04/image3.png)

But the original question is different, we want to *call the stored on a method of an entity object* and return domain entities. Suppose you have a GetBigOrdersForCustomer stored procedure that accepts a customerid and an amount, and return all the orders from that customer with order total bigger than amount passed. You can easily drop the stored into the designer, but this will create a method of the Context, not of the Customer Entity, so let’s see how we can solve this problem. Here is an example

{{< highlight xml "linenos=table,linenostart=1" >}}
public IEnumerable<Order> GetOrderBiggerThan(
  DataContext context, 
  Int32 amount) {
  return context.ExecuteQuery<Order>(
     "EXEC dbo.GetBigOrdersForCustomer {0}, {1}", amount, this.CustomerID);
}{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

This is a method written into the Customer class thanks to partial classes. As you can see the DataContext has a method called  **ExecuteQuery** that permits to specify a custom SQL code and have it return an IEnumerable&lt;T&gt; where T is an entity Class mapped in the context. The only bad thing is that you must pass the context object to the method, but I suggest you to create some form of management of lifecycle of DataContext, in this way it is possible to recover the current DataContext from every part of the code.

{{< highlight CSharp "linenos=table,linenostart=1" >}}
 using (Northwind1DataContext context = new Northwind1DataContext()) {
    context.Log = Console.Out;
    Customer alfki = context.Customers.Where(c => c.CustomerID == "ALFKI").First();
    foreach(Order o in alfki.GetOrderBiggerThan(context, 400)) {
       Console.WriteLine("OrderId = {0} OrderDate = {1}", o.OrderID, o.OrderDate);
    }
 }{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

As you can see the call is awkward because you have to pass the context to the customer object to made the call possible.

Another very useful method from the context is Translate() that is able to retrieve a DbDataReader as input and then return EntityObjects. It could be very useful for a scenario where some part of the Data Access Layer still work with direct access to db. With Translate you can easily takes data in form of dataReader and then recreate Entity Object with change Tracking enabled and so on.

Alk.

Tags: [LINQ to SQL](http://technorati.com/tag/LINQ%20to%20SQL) [DataContext](http://technorati.com/tag/DataContext)
