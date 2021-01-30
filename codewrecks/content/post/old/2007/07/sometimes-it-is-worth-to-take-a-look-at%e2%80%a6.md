---
title: "Sometimes it is worth to take a look atâ"
description: ""
date: 2007-07-12T10:00:37+02:00
draft: false
tags: [Sql Server]
categories: [Sql Server]
---
Atâ€¦how you had done some queries into the db J. I’ve a project where I need to check every day expired records in a table. That table has a lastUpdateDate column, I simply check if the time passed from last update is greater than a given amount and for each record I must create a message for the user that owns the record, the relation is one to one, one user for each record. Moreover I do not want the user to receive a message each day, but a message even 30 days if he do not update the record, so I need to check also if a message was generated for each expired record. A couple of month ago I create a query with this structure.

*Select recordId, ownerUserId from TableA  
where lastUpdateDate &lt; @expiredDate  
and NOT EXISTS(Select \* from Messages where MessageUserID = ownerUSerId and messageDate &lt; DATEADD(dd, -30, GETDATE())*

That query simply return each  expired record from TableA only if there is not a message directed to the owner of the record in the last 30 days. The real query is more complex with some other conditions but the general scheme is this. Today I saw that the query returned a timeout in the last execution cycleâ€¦.I ran the query and found with horror that the query needs 90 seconds to execute. This sounds very strange, because tableA had 5.000 record and message table around 12.000â€¦â€¦the server is not under heavy load.

When I look at the execution plan I saw a strange merge join operation with an output of 13.000.000 rows, I had no time to investigate so I decided to try to change the structure of the query because I know that not exists correlated subquery is often not the best solution for performance. The new query has the following structure

*Select MessageUserId into #tmpMessages   
from Messages where messageDate &lt; DATEADD(dd, -30, GETDATE())*

Select recordId, ownerUserId from TableA  
where lastUpdateDate &lt; @expiredDate  
and NOT ownerUserId IN (Select MessageUserId from #tmpMessages)

I simply store in a temporary table all messages directed to all users in the last 30 days, then I use the *NOT IN*operatorâ€¦when I run the query the execution time is less than one secondâ€¦â€¦

Alk.
