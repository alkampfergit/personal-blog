---
title: "Help NHibernate to better understand what U want"
description: ""
date: 2011-01-14T10:00:37+02:00
draft: false
tags: [Nhibernate]
categories: [Nhibernate]
---
Today I have to issue a quite complex condition in HQL, I have this piece of object model

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2011/01/image_thumb5.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2011/01/image5.png)

The main problem is the composite Id, I need to issue a query on an object that actually has a property called LinkId (an id of the analyzedLink class) but no relation with AnalyzedLink, and I want to select only those objects that are correlated to a specific SearchUnitId thanks to the above object model.

My first solution was

{{< highlight csharp "linenos=table,linenostart=1" >}}
AND exists (select L from SearchUnitToAnalysisLink L
where L.Id.LinkResult.Link.mId = o.LinkId
and L.Id.SearchUnit.Id = :suid)
{{< / highlight >}}

The first condition (the equality with o.LinkId) is that one that relates the SEarchUnitToAnalysisLink to the main object Iâ€™m selecting, note how Iâ€™m navigating in the objectModel, passing through the Id, the LinkResult object, the relation with the Link and finally the property mId that is the Id of the Link object.

The second condition is that one that verify that a SearchUnitToAnalysisLink related to a specific search unit id exists. When I launch that query I got a sql error, an "*incorrect syntax near ,â€*

looking at generated sql I found immediately the error, the subselect was issued in this way

{{< highlight csharp "linenos=table,linenostart=1" >}}
And  (exists (select (searchunit1_.alsu_searchUnitId, searchunit1_.alsu_analysisLinkId)
from BrAnalysisLinkSearchUnit
{{< / highlight >}}

The select part tries to select two values, and this is not correct in T-SQL. The solution is really simple, I need to change a little bit the HQL query.

{{< highlight csharp "linenos=table,linenostart=1" >}}
AND exists (select L.Id.LinkResult.Id
from SearchUnitToAnalysisLink L
where L.Id.LinkResult.Link.mId = o.LinkId
and L.Id.SearchUnit.Id = :suid)
{{< / highlight >}}

I simply told to NH to select only the Id of the LinkResult object, now the query works and generated SQL is correct (thanks to [NHProf](http://nhprof.com/) looking at generated sql is a breeze)

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2011/01/image_thumb6.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2011/01/image6.png)

As usual, NHibernate makes complex query really simple, because you can simply express conditions navigating the object model, and NH take cares of all the rest.

Alk.
