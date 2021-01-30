---
title: "AdoNET Entity Framework and lazy load"
description: ""
date: 2008-04-06T00:00:37+02:00
draft: false
tags: [NET framework]
categories: [NET framework]
---
This morning I installed Ado.net entity framework Beta2. I begin to run some example on [School Database](http://msdn2.microsoft.com/en-us/library/bb399731.aspx), and here the first surprise happens.

In Linq2Sql and in NHibernate lazy load happens automatically, and at least if I have a relation some fetch strategy is chosen to load related entities, it seems that in EF this does not happens. Here is a little example

{{< highlight xml "linenos=table,linenostart=1" >}}
ObjectQuery<Department> query = conn.CreateQuery<Department>(
   "Select value d from Department AS d where d.Name = @name");
query.Parameters.Add(new ObjectParameter("name", "Economics"));
foreach (Department dep in query) {
   Console.WriteLine("Department {0} has following courses", dep.Name);
   Int32 I = 0;
   foreach(Course c in dep.Course) {
      Console.WriteLine("{0}-{1}", ++I, c.Title);
   }
}{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

The code is really simple, I query the database for a department and then print the name of the department and related courses. When I run the example the result is surprising, no errors happens, but the course collection is empty. The reason is that automatic fetching is not enabled and if you want to access course objects you have manually to call load of EntityCollection.

{{< highlight csharp "linenos=table,linenostart=1" >}}
...
   Int32 I = 0;
   dep.Course.Load();
   foreach(Course c in dep.Course) {
...{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

This violate the principle of least surprise for me, because I’m expecting some sort of fetch strategy to be applied. If no errors happens and the course collection contains no object, my first impression is that the department has not any related courses. I prefer an exception of some sort telling me that I cannot access the collection because I do not fetch the content, or some sort of warning.

Alk.

Tags: [Ado.Net Entity Framework](http://technorati.com/tag/Ado.Net%20Entity%20Framework) [fetching strategy](http://technorati.com/tag/fetching%20strategy) [lazy load](http://technorati.com/tag/lazy%20load)
