---
title: "Linq to SQl Deferred or not"
description: ""
date: 2008-04-23T21:00:37+02:00
draft: false
tags: [LINQ]
categories: [LINQ]
---
One of the most peculiar characteristic of Linq is Deferred execution, here is an example.

{{< highlight sql "linenos=table,linenostart=1" >}}
IEnumerable<Customer> result =
   from c in context.Customers
   where c.ContactName.StartsWith("Maria")
   select c;
foreach (Customer c in result) {
   Console.WriteLine("Id = {0} ContactName = {1}", c.Id, c.ContactName);
}
ExecuteStatementInDb("UPDATE Customers Set ContactName = 'Modified' where CustomerId = 'ALFKI'");
foreach (Customer c in result) {
   Console.WriteLine("Id = {0} ContactName = {1}", c.Id, c.ContactName);
}{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

This sample create a linq to sql query to extract all customer from northwind database that has contact name that starts with Maria, then modify the record with ID=ALFKI and iterate again in the result, here is the output.

{{< highlight sql "linenos=table,linenostart=1" >}}
SELECT [t0].[CustomerID] AS [Id...

Id = ALFKI ContactName = Maria Anders
Id = FOLKO ContactName = Maria Larsson

SELECT [t0].[CustomerID] AS [Id...

Id = FOLKO ContactName = Maria Larsson{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

I’ve shortened the Sql clause, but you can see that each time you iterate for customer in result query, linq to sql made another query to the database. This is clear from the result, the first time the query return two record, ALFKI and FOLKO, the second time the ALFKI record is not returned because data in database is changed and does not match the query anymore. But pay attention because not everything is deferred in linq to sql. Take the example and change the query in this way

{{< highlight sql "linenos=table,linenostart=1" >}}
IEnumerable<Customer> result =
   from c in context.Customers
   where c.Id.StartsWith("A")
   select c;{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

Now you are selecting customers that starts with “A”, the rest of the code is the same, print record, change contact name of ALFKI and then print again result, here is the output.

{{< highlight sql "linenos=table,linenostart=1" >}}
SELECT [t0].[CustomerID] AS [Id],...

Id = ALFKI ContactName = Maria Anders
Id = ANATR ContactName = Ana Trujillo
Id = ANTON ContactName = Antonio Moreno
Id = AROUT ContactName = Thomas Hardy

SELECT [t0].[CustomerID] AS [Id...

Id = ALFKI ContactName = Maria Anders
Id = ANATR ContactName = Ana Trujillo
Id = ANTON ContactName = Antonio Moreno
Id = AROUT ContactName = Thomas Hardy{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

As you can see, when you iterate for the second time the query gets executed again, but the contact name of ALFKI is not changed. This happens because when the LINQ to SQL execute the query the second time, all the object are already constructed in memory, so all the result of the query gets ignored.

This can be a surprising behavior but is correct because objects that are already in the context does not gets update when you iterate again, even if linq to sql issue another query to the database. Only the “Where” part of the query is really deferred.

alk.

Tags: [Linq To Sql](http://technorati.com/tag/Linq%20To%20Sql)
