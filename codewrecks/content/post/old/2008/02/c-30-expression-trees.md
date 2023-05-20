---
title: "C 30 Expression Trees"
description: ""
date: 2008-02-16T00:00:37+02:00
draft: false
tags: []
categories: [General]
---

One of the most impressing features of C# 3.0 are Lamba expression, because they are *not only syntactic sugar.*If you are not convinced try to run the following two pieces of codes in LINQ to SQL

{{< highlight xml "linenos=table,linenostart=1" >}}
FirstTestDataContext context = new FirstTestDataContext();
 context.Log = Console.Out;
IEnumerable<Customer> custs = context.Customers
 .Where(C => C.CustomerID.StartsWith("A"));
Console.WriteLine("Recuperati {0} oggetti Customer", custs.Count());
custs = context.Customers
.Where(delegate(Customer C) { return C.CustomerID.StartsWith("A"); });
Console.WriteLine("Recuperati {0} oggetti Customer", custs.Count());{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

Against the northwind database, you find that these two SQL query are generated.

{{< highlight sql "linenos=table,linenostart=1" >}}
SELECT [t0].[CustomerID], [t0].[CompanyName], [t0].[ContactName], [t0].[Contact
itle], [t0].[Address], [t0].[City], [t0].[Region], [t0].[PostalCode], [t0].[Cou
try], [t0].[Phone], [t0].[Fax]
FROM [dbo].[Customers] AS [t0]
WHERE [t0].[CustomerID] LIKE @p0
-- @p0: Input NVarChar (Size = 2; Prec = 0; Scale = 0) [A%]
-- Context: SqlProvider(Sql2005) Model: AttributedMetaModel Build: 3.5.21022.8

Recuperati 4 oggetti Customer
SELECT [t0].[CustomerID], [t0].[CompanyName], [t0].[ContactName], [t0].[Contact
itle], [t0].[Address], [t0].[City], [t0].[Region], [t0].[PostalCode], [t0].[Cou
try], [t0].[Phone], [t0].[Fax]
FROM [dbo].[Customers] AS [t0]
-- Context: SqlProvider(Sql2005) Model: AttributedMetaModel Build: 3.5.21022.8{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

The first is the query generated with the Lambda and use operator LIKE to filter in the database, the other that use anonymous delegate retrieve all objects from database and then filter in memory, urgh, what a waste of memory.

It turns out that the compiler can translate lambda expression in two different way, if the result should be assigned to a delegate, the compiler emit the IL and create the delegate, but if the target of assignment is an Expression it convert the lambda into an expression tree.

An ExpressionTree is an object model that represent the expression, so it can be examined and traversed to dissect the expression itself. To help familiarize with the expressions i build a very simple winformprogram that dump the structure of the expression Tree. The program simply create an expression, and use a DumpVisitor to dump information of the node in a TreeView, The DumpVisitor class is based on the ExpressionVisitor class that can be found on MSDN. Here is a screenshot of a simple LambdaExpression.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2008/02/image-thumb1.png)](https://www.codewrecks.com/blog/wp-content/uploads/2008/02/image1.png)

Thanks to a simple Treeview and a propertyGrid it is simple to visualize the inner structure of the LambdaExpression. The TreeView contains the TypeName of the node visited, here we can see that for a simple constant expression the compiler creates a Lambda that contains a constant.

[Download sample](http://https://www.codewrecks.com/blog/wp-content/uploads/2008/02/expressiontree.zip)

Alk.
