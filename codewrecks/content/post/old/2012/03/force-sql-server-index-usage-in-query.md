---
title: "Force Sql server index usage in query"
description: ""
date: 2012-03-08T10:00:37+02:00
draft: false
tags: [Sql Server]
categories: [Sql Server]
---
Sometimes sql server surprises me, I have a really stupid table with seven columns and one of these columns contains great amount of text data. I need to select the minimum Id based on a date filter, and so I issued a really simple query like:

*Select min(TN.Id)       
from TableName TN        
where TN.timestamp &gt;= ‘20110201’*

This is a really simple query, but since the table is about 15 GB due to the large amount of text stored in it, it got executed in 140 secs, so I decided to create a simple index based on timestamp and id columns, but with my great surprise, even with the index, previous query still resort to a full table scan and needs 140 secs to be executed. The index is newly created, [it is not fragmented](http://msdn.microsoft.com/en-us/library/ms188917.aspx), statistics are updated, so I really do not understand where is the problem.

Then I decided to force usage index with [Query hints](http://msdn.microsoft.com/en-us/library/ms181714.aspx) changing the query to

*Select min(TN.Id)       
from TableName TN **with (INDEX(IX\_TIMESTAMP))** where TN.timestamp &gt;= ‘20110201’*

And now the query executes in 2 seconds……..that behavior really surprise me, but thanks to query hint I can at least force the execution plan if sql server did not choose the right one.

Alk.
