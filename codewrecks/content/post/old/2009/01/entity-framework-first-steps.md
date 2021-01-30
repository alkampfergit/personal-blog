---
title: "Entity Framework first steps"
description: ""
date: 2009-01-08T12:00:37+02:00
draft: false
tags: [LINQ]
categories: [LINQ]
---
For those used to ORM like NHibernate, the approach to Entity Framework is quite simple, but I’ve noticed that for people that never heard of ORM in general, EF tends to create some confusion.

I see people that make confusion between LINQ and EF, LINQ is the Language Integrated Query, it can be used to query objects in memory, XML, NHibernate and of course EF, but is not the only way to query EF. A less known method to execute query against a EF context is [EntitySql](http://msdn.microsoft.com/en-us/library/bb387145.aspx), here is an example.

{{< highlight xml "linenos=table,linenostart=1" >}}
using (NorthwindEntities context = new NorthwindEntities())
{
    ObjectQuery query = context.CreateQuery<Customers>("Select value C from Customers as C");
    var res = query.Execute(MergeOption.NoTracking) as IEnumerable<Customers>;
    foreach (Customers c in res)
    {
        Console.WriteLine(c.CustomerID + " City:" + c.City);
    }
    Console.ReadKey();
}{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

working with EntitySql is simple because it resembles quite well the SQL syntax we are used to. Querying with LINQ is simple too, but can surprise the novice user, suppose you write the following code

{{< highlight sql "linenos=table,linenostart=1" >}}
//Sample1();
using (NorthwindEntities context = new NorthwindEntities())
{
    var result = from Customers c in context.Customers
                 select c;
}{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

the question is "what is the query that gets executed to the database?". The answer is "NONE". The reason is "deferred execution" of linq query, the above code does only define a query, it returns an object that represent the query, but actually it does not execute any SQL to the server. Now let’s look at this other piece of code

{{< highlight sql "linenos=table,linenostart=1" >}}
//Sample1();
using (NorthwindEntities context = new NorthwindEntities())
{
    var query = from Customers c in context.Customers
                select c;
    Console.WriteLine("Count is {0}", query.Count());
    Console.WriteLine("Count is {0}", query.Count());
    Console.WriteLine("Count is {0}", query.Count());
}{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

This code actually executes three SQL query, since Count() is not a deferred operator, to know the result the query object needs to execute SQL against the datasource. This means that this code

{{< highlight sql "linenos=table,linenostart=1" >}}
1 using (NorthwindEntities context = new NorthwindEntities())
2 {
3     var query = from Customers c in context.Customers
4                 select c;
5     query.GetEnumerator();
6     query.GetEnumerator();
7     query.GetEnumerator();
8 }{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

execute three selects on the server. This behavior can surprise users that are not used to EF, someone believe that the real data is executed in line 3 and not at the time of the iteration, and they gets surprised when they see a SQL query issued to the database for each enumeration. The fact that the query is deferred can surprise but can be useful too. Let’s look at the following code.

{{< highlight sql "linenos=table,linenostart=1" >}}
using (NorthwindEntities context = new NorthwindEntities())
{
    var query = from Customers c in context.Customers
                where c.ContactName.Contains("d")
                orderby c.City
                select c;
    foreach (Customers c in query.Where(cst => cst.CustomerID.StartsWith("a")))
    {
        Console.WriteLine(c.CustomerID + " City:" + c.City);
    }
    foreach (Customers c in query.Where(cst => cst.CustomerID.StartsWith("r")))
    {
        Console.WriteLine(c.CustomerID + " City:" + c.City);
    }
}{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

since the query object build at the beginning is only a "query object" I can use to make subsequent queries based on the original value, in this example the query object create a constraint on the contact name and an order by City. From this base query I actually execute ii two time into two distinct enumeration, adding some more criteria each time, this is possible because all the Queryobject are composable because they support LINQ. Another important fact is that you cannot iterate the result of a query outside the scope of the context.

{{< highlight xml "linenos=table,linenostart=1" >}}
IQueryable<Customers> query;
using (NorthwindEntities context = new NorthwindEntities())
{
    query = (from Customers c in context.Customers select c);
}
foreach (Customers c in query)
{
    Console.WriteLine(c.CustomerID + " City:" + c.City);
}{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

This code is wrong and it raise the exception "The ObjectContext instance has been disposed and can no longer be used for operations that require a connection." If the actual query gets executed at each iteration, when you iterate outside the context that creates the query, the underling SqlConnection is disposed and EF cannot issue query anymore. The obvious solution is to use a not deferred operator like ToList() to actually create a list of object that gets disconnected when the context is disposed, but they can be accessed without problem.

{{< highlight xml "linenos=table,linenostart=1" >}}
1 IList<Customers> query;
2 using (NorthwindEntities context = new NorthwindEntities())
3 {
4     query = (from Customers c in context.Customers select c).ToList();
5 }
6 foreach (Customers c in query)
7 {
8     Console.WriteLine(c.CustomerID + " City:" + c.City);
9 }{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

The only difference is that in line 4 I used ToList() to actually execute the query and store the result in a list in memory, so it can be accessed even when the context is disposed.

alk.

Tags: [EntityFramework](http://technorati.com/tag/EntityFramework) [LINQ](http://technorati.com/tag/LINQ)
