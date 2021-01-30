---
title: "Using ISQlQuery to load data with nhibernate"
description: ""
date: 2009-05-19T05:00:37+02:00
draft: false
tags: [Nhibernate]
categories: [Nhibernate]
---
I have a project that uses both nhibernate and StoredProcedures, based on a legacy project written without nhibernate. Today I need to load a lot of data from five tables. The problem is that all these tables are managed with nhibernate, but I have no relation between them. Moreover these tables have a lot of objects, and I need to retrieve only 10 objects at a time with pagination, but I cannot express pagination in nhibernate, because I have condition that must be satisfied on tables that are not mapped.

I decided to create a new class that stores some basic data taken from two of these five tables, then add three properties to create relation with other three. The real objects that manage those three tables are not related because there is not foreign key in tables, but there are some business rules, expressed with stored procedure, that relates them all.

Thanks to [SQlQuery](https://www.hibernate.org/hib_docs/nhibernate/1.2/reference/en/html/querysql.html) I created a stored that accepts three parameters, it paginates record server-side with temp tables, and it is superfast. Then I begin to think how to map it into nhibernate. Moreover in client code I do not access directly the ISession, because the NHibernate layer was based on a previous query modelâ€¦ (that sooner or later will be dropped to permits direct access to ISession=, but for now all legacy nhibernate layer uses this custom query model, so I have no way to remove it.

Moreover, since I need to join tables, if I ask for 10 records, actually the stored returns higher number of records, because it returns 10 records from the base table, but after joins with other tables the number of returned records is greater than 10. I made the stored so it returns rows from all five tables, and I create all foreign key directly in the stored, now Iâ€™m able to write code like.

{{< highlight xml "linenos=table,linenostart=1" >}}
DirectSqlQuery query = DirectSqlQuery.Create("fictiousEntity", "root")
   .SetInt32("clieid", customerId)
   .SetInt32("startindex", startIndex)
   .SetInt32("maxresult", maxResults)
   .AddJoin("fetchTargets", "root.Targets")
   .AddJoin("fetchAnalyzedLink", "root.AnalyzedLink")
   .AddJoin("fetchExtData", "fetchAnalyzedLink.ExtData")
   .SetResultTransformer(new DistinctResultTransformer(0));
var result = UnitOfWorkBaseDbDao<fictiousEntity>.GetByCriteria(query);{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

entity called  **fictiousEntity** is used only to join data from two base tables and contains relations with other three tables, then I tell to ISQlQuery that in resultset there are all the columns to rebuild other related entities with  **AddJoin.** Finally I use a DistinctResultTransformer to take only the first element of the tuple. When you use AddJoin(), NHibernate does not return an object for each row in the resultset, but instead returns one object for each join. (see this figure)

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2009/05/image-thumb2.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2009/05/image2.png)

This is a snapshot of the TransformTuple of my DistinctResultTransformer object, that simply takes the object whose index was specified in constructor. So when I wrote  **SetResultTransformer(new DistinctResultTransformer(0))** Iâ€™m asking to return only the first element, that was my fictiousEntity used to aggregate the result.

Since I specified to NH that all data is included in the original recordset, entities are fully hydrated without N+1 Select problem. With this simple trick Iâ€™m able to retrieve data from a stored in a really high efficient way, while maintaining full power of NHibernate, because except the fictiousEntity that is mutable=â€falseâ€, and is used only for aggregation, all related classes can be used as usual with full persistence power.

alk.

Tags: [NHibernate](http://technorati.com/tag/NHibernate)
