---
title: "NHibernate and batch update"
description: ""
date: 2008-04-02T04:00:37+02:00
draft: false
tags: [Nhibernate]
categories: [Nhibernate]
---
Today in a project I need to delete a lot of object from a table, the objects are instances of ActionLog and I want to delete all logs related to action when an action is deleted.

The problem is that nhibernate does not still support batch query as hibernate for java does (as explained in hibnernate in action). So I was forced to do a direct sql query.

{{< highlight sql "linenos=table,linenostart=1" >}}
uow.Session.CreateSQLQuery("Delete from SchedulerActionLog where aclg_ActionId = :actId")
  .AddScalar("count", NHibernateUtil.Int32)
  .SetInt32("actId", actionDto.Id)
  .UniqueResult();{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

This does not like me very much since with sqlquery you are actually bypassing the mapping and dialect. Today I’ve no time, but if someone knows a better solution please let me know :D

Alk.
