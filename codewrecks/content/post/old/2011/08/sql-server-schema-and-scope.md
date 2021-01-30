---
title: "Sql Server Schema and scope"
description: ""
date: 2011-08-04T13:00:37+02:00
draft: false
tags: [Sql Server]
categories: [Sql Server]
---
This morning I spent 20 minutes completely puzzled on a stored procedure in Sql Server. This stored procedure is not too complex, it moves data incrementally on a denormalized table to speed up some searches. The concept is simple, I run a series of queries to obtain a list of the ids of modified entity since the last run of the stored, then I update those lines and insert the new ones.

I ran all the queries inside SSMS, verified that everything is good and then copy/paste T-SQL code inside a stored procedure. Now I reset the last run date, execute the stored andâ€¦ surprise â€¦. no row was loaded in the table. I was puzzled, so I open stored procedureâ€™s code, selected the whole T-SQL content (except the ALTER PROCEDURE), pressed F5 and magically the table gets populated, then I execute the stored from another query windows and still no row was insertedâ€¦. how it is possible that a query behave differently when you execute the T-SQL code and when the very same T-SQL code is executed inside a stored procedure?

The problem is subtle and originated from the design of the database: I have a view called CampaignView, that is really slow (it has many join and lot of subqueries) so I decided to create a table called datawarehouse.CampaignView to store the materialized content of the view. The code that populates the table at a certain point issue a query like this one

{{< highlight csharp "linenos=table,linenostart=1" >}}
INSERT INTO [datawarehouse].[CampaignCategoryView]
(xxx, yyy, zzz)
SELECT FROM CampaignCategoryView
WHERE........
{{< / highlight >}}

Basically I simply insert into the datawarehouse table selecting rows from the original slow view with a WHERE condition that identify all the new rows to be inserted.

When you execute the code it works perfectly, because the SELECT clause selects from the * **dbo.CampaignCategoryView** *view. When the very same code gets executed inside a stored called * **[datawarehouse]**.[CampaignCategoryViewIncrementalPopulation]*the default schema is *datawarehouse* because it is the schema where the stored lives in. This completely changes how the previous SQL snippet gets executed, because the SELECT FROM part is now selecting from * **[datawarehouse].[CampaignCategoryView].** *This means that nothing get inserted in the table because it is inserting data from itself. The solution was to specify the schema for the source table

{{< highlight csharp "linenos=table,linenostart=1" >}}
INSERT INTO [datawarehouse].[CampaignCategoryView]
(xxx, yyy, zzz)
SELECT FROM dbo.CampaignCategoryView
WHERE........
{{< / highlight >}}

This problem taught me two different lessons: the first one is that in SQL is*always a good idea to specify SCHEMA of objects* and the second one is,*not to create two object in a database with the very same name but in different SCHEMA*, because if you forget the first lesson, the code executes differently depending on context in witch it runs.

alk.

Tags: [Sql Server](http://technorati.com/tag/Sql%20Server)
