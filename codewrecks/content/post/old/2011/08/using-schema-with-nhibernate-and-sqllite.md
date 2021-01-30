---
title: "Using schema with NHibernate and SqlLite"
description: ""
date: 2011-08-02T17:00:37+02:00
draft: false
tags: [Nhibernate,Testing]
categories: [Nhibernate]
---
Some time ago I [blogged about a](http://www.codewrecks.com/blog/index.php/2009/07/24/manage-in-memory-nhibernate-test-with-sqlite-and-database-schema/) technique to use SqLite in Unit testing when you have nhibernate mapping that targets Sql Server tables in a schema different from dbo. The problem was: if you specify the schema name in the mapping of a class, then you are not able to execute the test in SqLite database.

Ex. if you have this mapping.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2011/08/image_thumb.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2011/08/image.png)

This is a mapping for a table called EngagementView in a schema called *report* and when u try to run some test on this entity with SqLite you got an error telling that there is no report database. The solution is to use the schema element of the mapping. The right schema should be

{{< highlight csharp "linenos=table,linenostart=1" >}}
<class name="xxxxx"
schema="report" table="EngagementView" />
{{< / highlight >}}

With this mapping NHibernate understand that the table EngagementView is on the schema report and the SqLite dialect is able to handle this without the need of the trick described in my old post. If you now issue a query against the EngagementView object you can verify that the query is issued again a table called report\_EngagementView. This happens because SqLite has no concept of schema and the dialect can correctly generate the table name prepending the Table name with Schema and an underscore.

Alk.
