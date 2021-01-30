---
title: "Manage In memory nhibernate test with sqlite and database schema"
description: ""
date: 2009-07-24T10:00:37+02:00
draft: false
tags: [Nhibernate]
categories: [Nhibernate,Testing]
---
When you work with nhibernate you usually write a lot of tests that interact with your database, mainly to test your mapping but also when you do not want to shield the session behind a IRepository. To avoid [Slow Test](http://xunitpatterns.com/Slow%20Tests.html) you should use some In Memory database like [Sqlite](http://www.sqlite.org/), but it can be problematic when you use features of your real database (like Sql Server) that are not supported by the Sqlite engine.

One of the most frustrating one is the lack of schema support. When you have hundreds of entities, it is of fundamental importance that you use schema, avoiding to pollute the dbo with all the table, but this makes difficult to use Sqlite for testing purpose. Suppose you map an entity to the table * **myschema.RawMetabaseData** *, when you create the schema with schemaexport you will obtain this error

{{< highlight csharp "linenos=table,linenostart=1" >}}
Error: Error during fixture setup NHibernate.HibernateException: SQLite error
unknown database myschema ---> System.Data.SQLite.SQLiteException: SQLite error
unknown database myschema
{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

SQlite does not know the concept of schema, so it believes that myschema is a database name and not  a schema. There are some solution to this problem, but the most simple one is to change the mapping directly in memory.

{{< highlight csharp "linenos=table,linenostart=1" >}}
cfg.AddAssembly("myassembly");
foreach (PersistentClass pc in cfg.ClassMappings)
{
    if (pc.Table.Name.Contains("."))
    {
        //this is a table with schema
        pc.Table.Name = pc.Table.Name.Replace(".", "_");
    }
}
ISessionFactory sf = cfg.BuildSessionFactory();{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

After you have called the AddAssembly() method, but before you create the SessionFactory with BuildSessionFactory(), mappings are compiled in memory, so you can browse the object model created from the xml mapping files, looking for table that contains dot character, and change the dot into an underscore, so the table can be used by Sqlite. This code is executed only for tests that uses SqlLite so my standard test that use Sql Server are not affected by the modification, but I can still use Sqlite to do fast in memory test even with tables in custom schema.

alk.

Tags: [NHibernate](http://technorati.com/tag/NHibernate) [Sqlite](http://technorati.com/tag/Sqlite) [Unit Testing](http://technorati.com/tag/Unit%20Testing)
