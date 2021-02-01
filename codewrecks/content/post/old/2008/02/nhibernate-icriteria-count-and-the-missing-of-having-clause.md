---
title: "NHibernate ICriteria Count and the missing quotHavingquot"
description: ""
date: 2008-02-27T12:00:37+02:00
draft: false
tags: [Nhibernate]
categories: [Nhibernate]
---
One of the most feared missing feature of the ICriteria API is the possibility to specify condition on projection with Having. Suppose you have this simple connection between a container and a contained object,

[![image](http://www.nablasoft.com/Alkampfer/wp-content/uploads/2008/02/image-thumb4.png)](http://www.nablasoft.com/Alkampfer/wp-content/uploads/2008/02/image4.png)

The EntityContainer class has a property called Test, is an IList&lt;EntityTest&gt; and EntityTest has a Container property to link back to the container. This is the classic bidirectional association. Now we want to express with ICriteria API the following query

Select all EntityContainer that have more than one EntityTest in the Test collection

And I want to solve this problem using both the direction of association, I mean two criteria, one that use the many-to-one and the other that use the &lt;bag&gt; part. This is important because bidirectional association is not always the best solution, so it is possible to have a domain where the association is unidirectional.

 **Using the many-to-one part** {{< highlight xml "linenos=table,linenostart=1" >}}
ICriteria c = session.CreateCriteria(typeof(EntityContainer), "RootClass");

NEX.DetachedCriteria d = NEX.DetachedCriteria.For(typeof(EntityTest))
   .SetProjection(NEX.Projections.RowCount())
   .Add(NEX.Property.ForName("Container").EqProperty("RootClass.Id"));

//You can use also
//.Add(NEX.Expression.EqProperty("Encontained", "RootClass.Id"));

c.Add(NEX.Subqueries.Lt(1, d));
IList<EntityContainer> result = c.List<EntityContainer>();{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

The result is achieved using a *DetatchedCriteria*and a subquery, the detatched criteria is on the EntityTest class, set a simple count projection and set the join with the original query with a Expression.EqProperty. Once the DetatchedCriteria is build I simply add it to the root Criteria using the Subqueries.Lt (Less Than). Here is the SQL

{{< highlight sql "linenos=table,linenostart=1" >}}
SELECT this_.Id as Id2_0_, this_.PStr as PStr2_0_, this_.RegDate as RegDate2_0_ 
FROM EntityContainer this_ 
WHERE 
  @p0 < (SELECT count(*) as y0_ 
              FROM EntityTest this_0_ 
              WHERE this_0_.ContainerId = this_.Id); @p0 = '1'{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

The code is quite good, I simply use a subquery to calculate the number of EntityTest associated to the object and I take the EntityContainer if this value is greater than 1. (Actually the syntax force me to use 1 is less than count :) )

 **Using the &lt;bag&gt; part** This is more difficult, because the direction of the association is from EntityContainer to EntityTest so the detatched criteria should be on EntityContainer.

{{< highlight xml "linenos=table,linenostart=1" >}}
ICriteria c = session.CreateCriteria(typeof(EntityContainer), "RootClass");

NEX.DetachedCriteria d = NEX.DetachedCriteria.For(typeof(EntityContainer))
   .CreateAlias("Tests", "Tests")
   .SetProjection(NEX.Projections.ProjectionList()
       .Add(NEX.Projections.RowCount()))
   .Add(NEX.Property.ForName("Id").EqProperty("RootClass.Id"));

c.Add(NEX.Subqueries.Lt(1, d));
IList<EntityContainer> result = c.List<EntityContainer>();{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

The solution is simple, I call CreateAlias to make the join with EntityTest through the Tests collection, add the projection rowCount and simply join with the original criteria with the EqProperty Id == RootClass.Id

Here is the sql generated

{{< highlight sql "linenos=table,linenostart=1" >}}
SELECT this_.Id as Id18_0_, this_.PStr as PStr18_0_, this_.RegDate as RegDate18_0_ 
FROM EntityContainer this_ 
WHERE @p0 < 
(SELECT count(*) as y0_ 
FROM EntityContainer this_0_ inner join EntityTest tests1_ on this_0_.Id=tests1_.ContainerId 
WHERE this_0_.Id = this_.Id); @p0 = '1'{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

And the game is done ;)

Alk.
