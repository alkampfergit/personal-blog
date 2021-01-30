---
title: "Always pay attention to uniqueness to SQL Index"
description: ""
date: 2011-10-06T08:00:37+02:00
draft: false
tags: [Sql Server]
categories: [Sql Server]
---
I have a database with several Gigabyte of data and query performance is usually a issue, so we need to take great care of indexes and DB optimization. Since the vast majority of data access is done with NHibernate, we have also some read-only view that we use to easy the access from the views.

One of this view, have four left outer join from a main table to other four tables and we have a SELECT COUNT query that is quite slow, so we decide to understand how to optimize it. I started looking at the execution plan and I found this.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2011/10/image_thumb.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2011/10/image.png)

 ***Figure 1***: *Original execution plan.*

The execution plan clearly shows that we have a join between two tables, but I’m issuing a SELECT COUNT with condition on fields of the first table only, the question is: why sql server issue a join with another table, if the other table does not contains fields that are involved on the query?

The answer is really simple, a JOIN between two tables influences the number of rows returned, suppose that for each record of the main table we have 2 records on the table in join, this situation affects the SELECT COUNT operation, so SQL SERVER has no choice, he need to do the JOIN. Our Data Model enforces in Business Logic that for each record in the main table, at most we can have a single related record on the other table, so I decided to make the index that supports the foreign key unique (it was not unique because we usually enforce this type of constraint in business logic).

Once the index is *Unique*, Sql Server knows that the join could not affect the result of SELECT COUNT and from execution plan I verified that the join is gone and performances are greatly improved.

The motto is: if you have Business Logic that enforce uniqueness, creating a unique index at the Database Level if you are using that field in join can lead to better execution plans.

Gian Maria.
