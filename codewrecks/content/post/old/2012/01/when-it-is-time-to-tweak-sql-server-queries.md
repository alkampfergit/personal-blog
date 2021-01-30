---
title: "When it is time to tweak SQL Server queries"
description: ""
date: 2012-01-31T18:00:37+02:00
draft: false
tags: [Sql Server]
categories: [Sql Server]
---
I’ve a stored procedure with a query that runs on a quite big database, it was slow (more than one minute to run) and was optimized using a temp table. The result is that execution time dropped to ~2 secs, and since this was acceptable the optimization stopped.

After a couple of months, the query become really slow again, it got executed in ~30 secs and I started to investigate why.

A quick tour with SSMS and STATISTICS I/O did not reveal some news, but the execution plan have a strange sort operation that takes 90% of the time of the overall query and this is really strange, but I did not find any reason why it should slow the query so much. To have a better picture of what is happening I decided to fire the Activity Monitor to check if the query stops for any lock in table, but I found that the task that is executing the query goes into heavy parallelism (you see a lot of row in the activity monitor with the same id), but each subtask is waiting a lot with a  * **CXPACKET wait type** *and everything seems stuck. [CXPACKET wait time happens when the execution of the query is parallelized](http://www.mssqltips.com/sqlservertip/2027/a-closer-look-at-cxpacket-wait-type-in-sql-server/) so I decided to disable parallelism of the query with [**OPTION (MAXDOP 1**](http://msdn.microsoft.com/en-us/library/ms181007.aspx) **)** to verify if the situation change **.** The result is that the query now executed in ~2 secs, like it did two months before, so I decided to leave it with parallelism disabled and it start to run just fine.

The conclusion is,: when database is big, and query are complex, it is not so simple to understand why a query is slow, sometimes you need to tweak how SQL Server issue the query with Query Hint and you should use all the tools you have to understand what is really happening :P.

Gian Maria.
