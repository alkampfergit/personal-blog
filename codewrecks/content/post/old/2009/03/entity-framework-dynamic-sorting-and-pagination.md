---
title: "Entity Framework dynamic sorting and pagination"
description: ""
date: 2009-03-21T01:00:37+02:00
draft: false
tags: [Entity Framework]
categories: [Entity Framework]
---
Suppose you need to paginate and letting the user choose the sort field in entity framework, lets see how you can accomplish this.

In EntityFramework you can query with E-SQL both building a query in string format, but also using standard method syntax, here is an example (based on NorthWind)

{{< highlight csharp "linenos=table,linenostart=1" >}}
var query = context.Customers
           .OrderBy("it.ContactTitle"); 
query.Dump();{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

This work perfectly, you can sort dynamically only specifying the property you want to use for sorting. Adding pagination is a breeze

{{< highlight csharp "linenos=table,linenostart=1" >}}
var query = context.Customers
           .OrderBy("it.ContactTitle")
           .Skip(20).Take(5);
query.Dump();{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

This query is really interesting, because you are actually using e-SQL for the orderby part, then you resort to standard linq operator. Now you can be surprised because this version does not work:

{{< highlight csharp "linenos=table,linenostart=1" >}}
var query = context.Customers
           .Skip(20).Take(5)
           .OrderBy("it.ContactTitle");
query.Dump();{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

After all you simply revert the order of methods, but there is a general rule that states â€œ*when you use a LINQ operator you cannot use e-SQL operator anymore*â€, this is why this second snippet does not work. All the methods that accepts entity property name with the syntax â€œit.propertynameâ€ belongs to the E-SQL syntax, they are used to dynamically build  an ESQL query. Now suppose you want to specify a condition. You can try this

{{< highlight csharp "linenos=table,linenostart=1" >}}
var query = context.Customers
           .OrderBy("it.ContactTitle")
           .Where(c => c.CustomerID.Contains("m"))
           .Skip(5).Take(5);{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

But it does not work, because it tells you  **The method ‘Skip’ is only supported for sorted input in LINQ to Entities. The method ‘OrderBy’ must be called before the method** ‘Skip’. This happens because EF examines the E-SQL part, it order by ContactTitle, then pass everything to the LINQ part that starts with where methdo, the Where method gets passed the E-SQL query, then you call Skip, and now Skip operator looks in the expression tree for a Sort operation, it does not found it because it only found a Where, so it throws an exception. You could be tempted to move the Skip part before the where

{{< highlight csharp "linenos=table,linenostart=1" >}}
var query = context.Customers
           .OrderBy("it.ContactName")
           .Skip(5).Take(5)
           .Where(c => c.CustomerID.Contains("m"));{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

But this does not work because pagination occurs before the filtering so it does not return the result you want. A possible solution is directly using E-SQL.

{{< highlight sql "linenos=table,linenostart=1" >}}
  var queryESQL = @"select VALUE Customers from Customers
                     where Customers.ContactName like '%M%'
                   order by Customers.ContactName
                   skip @s limit @l";
  var query = context.CreateQuery<ModelToTest.Customers>(
          queryESQL, 
        new ObjectParameter("s", 5) ,
        new ObjectParameter("l", 5));
  query.Dump();{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

This permits you to build the query as string, so you can specify ordering with no problem. If you still like method query (as I like) you need to be sure that the orderby is just before the skip.

{{< highlight csharp "linenos=table,linenostart=1" >}}
var query = context.Customers
           .Where("it.ContactName like '%m%'")
           .OrderBy("it.ContactName")
           .Skip(5).Take(5);
query.Dump();{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

Or you can use the Skip method belonging to ESQL syntax

{{< highlight csharp "linenos=table,linenostart=1" >}}
var query = context.Customers
           .Where("it.ContactName like '%m%'")
           .Skip("it.ContactName", "5")
           .Take(5);
query.Dump();{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

alk.

Tags: [.NET Framework](http://technorati.com/tag/.NET%20Framework) [Entity Framework](http://technorati.com/tag/Entity%20Framework) [Pagination](http://technorati.com/tag/Pagination)
