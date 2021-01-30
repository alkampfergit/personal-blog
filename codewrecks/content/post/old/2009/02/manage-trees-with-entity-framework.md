---
title: "Manage Trees with entity framework"
description: ""
date: 2009-02-27T02:00:37+02:00
draft: false
tags: [Entity Framework]
categories: [Entity Framework]
---
Quite often you need to store in database Hierarchical structure that are logically represented by a tree. There are a lot of techniques around there, but one of the most common is using a simple foreign key that refers to the same table, as in the following example

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2009/02/image-thumb6.png)](http://www.codewrecks.com/blog/wp-content/uploads/2009/02/image6.png)

If you map this table with entity framework you will obtain automatically a tree structure, you only need to rename the Relationship field because they are named Employee and Employee1, I renamed them in  **Parent** and  **Childs** , because the resulting in-memory structure is clearer

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2009/02/image-thumb7.png)](http://www.codewrecks.com/blog/wp-content/uploads/2009/02/image7.png)

Now I create a simple routine to print the tree in console, the main problem here is that for every object we need to issue a *Load()* call to the Childs EntityCollection to load the childs, thus to print the whole tree we issue N select, where N is the number of the node of the tree.

{{< highlight chsarp "linenos=table,linenostart=1" >}}
public static void Print(Employee employee, Int32 level)
{
   Console.WriteLine("{0}{1}", new String('-', level), employee.Name);
   if (!employee.Childs.IsLoaded)
   {
      employee.Childs.Load();
   }
   foreach (Employee child in employee.Childs)
   {
      Print(child, level + 1);
   }
}{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

This permits me to load the entity with Parent = null (The root) and print every object in the tree.

{{< highlight chsarp "linenos=table,linenostart=1" >}}
public static void Main()
{
   Console.WriteLine("Test");
   using (TestEntities context = new TestEntities())
   {
      Employee root = context.Employee
        .Where(e => e.Parent == null).First();
      Print(root, 0);
   }
}{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

The output is good, Entity Framework rebuild the whole tree in memory.

{{< highlight csharp "linenos=table,linenostart=1" >}}
Test
Alkampfer
-Guardian
--Clark
--John
-Joe{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

The first problem is the need to issue N select, this is an overkill for performance of big trees. Updating it is really simple, you only need to change the Parent node

{{< highlight chsarp "linenos=table,linenostart=1" >}}
Employee Clark = context.Employee
  .Where(e => e.Name == "Clark").First();
Employee Joe = context.Employee
  .Where(e => e.Name == "Joe").First();
Clark.Parent = Joe;{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

Deleting a node is more problematic, because if you delete a node that contains childs you will gets an error, because of violation of foreign key, you need to delete nodes one by one from the node you want to delete to every child so it is better to build a simple function to visit a subtree

{{< highlight xml "linenos=table,linenostart=1" >}}
public static void Visit(Employee employee, Action<Employee> visitAction)
{
   visitAction(employee);
   if (!employee.Childs.IsLoaded)
      employee.Childs.Load();
   foreach (Employee child in employee.Childs)
      Visit(child, visitAction);
}{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

Then use it to find a node and all its descendants and finally issue delete statement as in the following snippet that deletes the whole tree

{{< highlight xml "linenos=table,linenostart=1" >}}
using (TestEntities context = new TestEntities())
{
   Employee root = context.Employee
     .Where(e => e.Parent == null).First();
   List<Employee> nodes = new List<Employee>();
   Visit(root, nodes.Add);
   nodes.ForEach(context.DeleteObject);
   context.SaveChanges();
}{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

But again, this snippet will execute N Delete queries, so it does not perform well.

The conclusion is that with EF managing a tree is quite simple, but performances can suffer of an excessive number of query issued to the database.

Alk.

Tags: [Entity Framework](http://technorati.com/tag/Entity%20Framework) [.NET Framework.](http://technorati.com/tag/.NET%20Framework.)
