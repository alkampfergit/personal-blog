---
title: "Entity Framework span and eager fetch"
description: ""
date: 2008-04-06T00:00:37+02:00
draft: false
tags: []
categories: [General]
---
Some minutes ago I [posted about the Entity Framework](http://www.nablasoft.com/Alkampfer/?p=191) and fetching strategy. After a little search in the documentation, I finally found how to prefetch using a concept called * **span** *. Here is a LINQ query that load a department eagerly fetching the courses collection

{{< highlight sql "linenos=table,linenostart=1" >}}
var query = from d
            in conn.Department.Include("Course")
            where d.Name == "Economics"
            select d;
foreach (Department dep in query) {

   Console.WriteLine("Department {0} has following courses", dep.Name);
   Int32 I = 0;
   foreach (Course c in dep.Course) {
      Console.WriteLine("{0}-{1}", ++I, c.Title);
   }
}{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

Using the span is simple as calling method * **Include()** *in the Department property of the EF context. This solves in part the problem because I still do not like that, if you forget to eager fetch or manually lazy fetch calling * **EntityRef.Load()** *, you can access the collection and find it empty. I think that raise an exception or some warning should be done, to warn the programmer that he is accessing a collection that is not in sync with data in the database. Accessing an unfetched collection can mislead the programmer that there are no related object in database.

Alk.

Tags: [Entity Framework](http://technorati.com/tag/Entity%20Framework) [fetching strategy](http://technorati.com/tag/fetching%20strategy) [span](http://technorati.com/tag/span)
