---
title: "NHibernate and deleting a group of objects"
description: ""
date: 2008-06-19T07:00:37+02:00
draft: false
tags: [Nhibernate]
categories: [Nhibernate]
---
If you do not mind to issue a delete for each object, you can delete multiple objects using an overload version of the ISession.Delete() Method, here is an example.

{{< highlight sql "linenos=table,linenostart=1" >}}
uow.Session.Delete("select A from ActionSpawned A where A.ParentAction = :act",
 ParentAction, NHibernateUtil.Entity(typeof(Action)));{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

The code is quite concise, you specify the query to select a series of object, and pass it to the Delete method of the ISession, along with the parameters of the query. The result is that NHibernate executes the query, loads all objects and deletes each one.

If you have to delete a really great amount of objects, you can resort to use direct SQL to obtain greater performance, since all objects are deleted in a single roundtrip

{{< highlight sql "linenos=table,linenostart=1" >}}
Object result = theSession.CreateSQLQuery("DELETE from SchedulerAction where acti_parent = :act")
   .AddScalar("count", NHibernateUtil.Int32)
   .SetParameter("act", act1.Id)
   .UniqueResult();{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

With this query you can issue a very efficient DELETE instruction, but remember that you have to specify the real table and columns names, so you lose the advantage to abstract the model from the database. The above query returns null, because the delete instruction does not select any data, if you want to know the number of deleted  row you can use

{{< highlight sql "linenos=table,linenostart=1" >}}
Object result = theSession.CreateSQLQuery("DELETE from SchedulerAction where acti_parent = :act ; select @@ROWCOUNT count;")
   .AddScalar("count", NHibernateUtil.Int32)
   .SetParameter("act", act1.Id)
   .UniqueResult();{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

alk.

<!--dotnetkickit-->

Tags: [NHibernate, Bulk Operation](http://technorati.com/tag/NHibernate,%20Bulk%20Operation)
