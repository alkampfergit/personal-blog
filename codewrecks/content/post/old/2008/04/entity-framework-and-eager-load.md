---
title: "Entity Framework and Eager Load"
description: ""
date: 2008-04-16T14:00:37+02:00
draft: false
tags: [LINQ]
categories: [LINQ]
---
If you want to Eager Load a relation in entity framework, you can use the Include() method in LINQ to Entities, but the include is useful even With EntitySQl and object services, but the syntax is something that violates the principle of least surprise for me.

I started with:

{{< highlight sql "linenos=table,linenostart=1" >}}
ObjectQuery<Department> query = conn.CreateQuery<Department>(
"Select value d from  Department AS d where d.Name = @name");
query.Parameters.Add(new ObjectParameter("name", "Economics"));
query.Include("Course");{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

It seems pretty reasonable to me, but this does not work, no eager fetch of any courses….after some minutes of perplexity I realized that the Include Method does return a query object……so the right way to eager fetch the Course collection is

{{< highlight csharp "linenos=table,linenostart=1" >}}
query = query.Include("Course");{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

This sound bad to me, I didn’t really expect that the Include actually creates a complete different query object. It turns out that the best way to do this is chain the Include in the original call.

{{< highlight sql "linenos=table,linenostart=1" >}}
ObjectQuery<Department> query = conn.CreateQuery<Department>(
  "Select value d from Department AS d where d.Name = @name")
 .Include("Course");
query.Parameters.Add(new ObjectParameter("name", "Economics"));{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

Alk.

