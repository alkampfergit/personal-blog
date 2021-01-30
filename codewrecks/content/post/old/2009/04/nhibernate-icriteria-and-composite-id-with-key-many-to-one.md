---
title: "NHibernate ICriteria and composite-id with key-many-to-one"
description: ""
date: 2009-04-29T09:00:37+02:00
draft: false
tags: [Nhibernate]
categories: [Nhibernate]
---
Suppose you have a legacy database, and an entity called ViewOfBaseData that have this id.

{{< highlight xml "linenos=table,linenostart=1" >}}
 <composite-id class="ViewOfBaseDataId" name="Id"  >
    <key-many-to-one class="LinkResult" name="Link" column="AnalysisId" lazy="proxy" />
    <key-property name="AnalysisDate" type="System.DateTime" column="AnalysisDate" />
 </composite-id>{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

Now suppose you need to retrieve all object ViewOfBaseData linked to a LinkResult object with a property KeyList equal to a certain value. In HQL is really simple

{{< highlight sql "linenos=table,linenostart=1" >}}
select v from ViewOfBaseData v where v.Id.Link.KeyList = 'blabla'{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

Resulting SQL query is a simple join between the two tables, but now suppose you cannot use HQL and instead you are forced to use ICriteria, you can try this one.

{{< highlight csharp "linenos=table,linenostart=1" >}}
ICriteria c = uow.TheSession.CreateCriteria(typeof(ViewOfBaseData ))
.CreateCriteria("Id").CreateCriteria("Link")
              .Add(Expression.Eq("KeyList", "blabla"));{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

But this failed with the error: * **no such column: linkresult2\_.keyList** *, if you look at the SQL query issued to the database, you can verify that the query does not contain the join with the table for LinkResult entity. If you change the constant â€œblablaâ€ with the integer 10 you will obtain the error * **Type mismatch in NHibernate.Criterion.SimpleExpression: KeyList expected type System.String, actual type System.Int32** *thus confirming me that the path is specified correctly.

If you examine the inner metadata of the session you can find that the composite id ViewOfBaseDataId is a ComponentType and probably internally, when the engine that build sql query verify that Id property of ViewOfBaseData is a componentType determines that each column is contained in the base table. I do not know if it is a bug of nhibernate or if there is another way to specify the criteria, but if you absolutely need not to use HQL you can use DetatchedCriteria

{{< highlight csharp "linenos=table,linenostart=1" >}}
ICriteria c = uow.TheSession.CreateCriteria(typeof(ViewOfBaseeData), "root");

DetachedCriteria dc = DetachedCriteria.For(typeof (LinkResult))
  .Add(Expression.Eq("KeyList", "blabla"))
  .SetProjection(Projections.Property("Id"))
  .Add(Property.ForName("Id").EqProperty("root.Id.Link.Id"));

c.Add(Subqueries.Exists(dc));
c.List();{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

This generates the following query

{{< highlight sql "linenos=table,linenostart=1" >}}
SELECT this_.AnalysisId as AnalysisId98_0_, this_.AnalysisDate as Analysis2_98_0_,...
FROM ViewOfBaseData this_ WHERE exists (SELECT this_0_.Id as y0_ FROM LinkResult this_0_ 
WHERE this_0_.keyList = @p0 and this_0_.Id = this_.AnalysisId); @p0 = 'blabla'{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

From the point of view of performance, probably this query is worst than a direct join, but it works ;)

alk.

Tags: [NHibernate](http://technorati.com/tag/NHibernate) [ICriteria](http://technorati.com/tag/ICriteria)
