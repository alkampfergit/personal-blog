---
title: "Power of HQL ndash Condition on a collection"
description: ""
date: 2010-03-09T11:00:37+02:00
draft: false
tags: [HQL,Nhibernate]
categories: [Nhibernate]
---
I have this piece of domain model.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2010/03/image_thumb.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2010/03/image.png)

The LinkResult class has a property called Link that point to a AnalyzedLink class that in turn has a collection of AnalyzedLinkExtClass called ExtData. All the relation are unidirectional, this means that there is nothing that bring me from AnalyzedLink to a linkResult and nothing that bring me from AnalyzedLinkExtData to the AnalyzedLink. This is the typical situation where doing complex query can be tricky

Now I had to find all the LinkResult objects that have Status = LinkResultStatus.Ok and the associated AnalyzedLink must not contain an AnalyzedLinkExtData with the property Source equal to a certain value.

The query in HQL is

{{< highlight csharp "linenos=table,linenostart=1" >}}
@"select L
from LinkResult L
join L.Link AL
where L.Status = :status and
not exists (from AL.ExtData ED where ED.Source = :source)
order by L.AnalysisDate desc"
{{< / highlight >}}

This is really powerful, I can simply start the query from the LinkResult object, then join to the L.Link and set a condition on L.Status property.

Now I add a **not exists** with the condition *(from AL.ExtData ED where ED.Source = :source)* as you can see I do not need to specify any join, but I can select directly from the ExtData Collection Property of the AnalyzedLink result. The SQL generated is

{{< highlight csharp "linenos=table,linenostart=1" >}}
select
linkresult0_.Id as Id175_,
.....
from
LinkResult linkresult0_
inner join
AnalyzedLink analyzedli1_
on linkresult0_.link_id=analyzedli1_.link_id
where
linkresult0_.status=@p0
and  not (exists (select
extdata2_.aled_id
from
AnalyzedLinksExtData extdata2_
where
analyzedli1_.link_id=extdata2_.aled_link_id
and extdata2_.aled_source=@p1))
order by
linkresult0_.analysisDate desc;
{{< / highlight >}}

The real magic is done in the subquery, because you can verify that the condition on subquery contains two condition, the first is the link with the outer query, and the second one is the one we put on HQL. But you can surely appreciate the fact that in HQL the query is really clearer and shorter :)

alk.

Tags: [NHibernate](http://technorati.com/tag/NHibernate)
