---
title: "Speedup WSUS in your AD"
description: "If you have WSUS and performance are horrible, you can gain some speed with some SQL maintenance"
date: 2020-10-11T16:00:00+02:00
draft: false
tags: ["windows"]
categories: ["General"]
---

I have a very old HP Proliant Microserver, it has 16 GB of RAM and an SSD, but it is really old, it is powered by a really old Turion CPU and WSUS is starting to becoming unresponsive. That machine act **as a test domain controller for a bunch of test virtual machines**, WSUS always was a little bit slow, but it worked, until few days ago, when it constantly fails to load data.

![WSUS was unable to perform almost any operation](../images/wsus-dead.png)
***Figure 1:*** *WSUS was unable to perform almost any operation*

Database file was 32 GB, and honestly, I never did anything on it, I just leave WSUS alone. You can try to do some maintenance, but sadly enough, server was so slow that **it couldn't even end maintenance, so it become unusable**.

Even if the database was on an SSD and I got 16 GB of RAM, it seems that I have no resource to accomplish almost nothing. In such a situation first thing to do is **use sql management studio to connect to the instance and try to understand if you can do anything to speedup SQL Server**. In my version (Windows server 2012 R2) connection string is: *\\.\pipe\Microsoft##WID\tsql\query* with integrated authentication

> If WSUS is really slow, it is time to check on database.

Once connected I got a query to verify fragmentation of indexes. These queries are not mine, they can be found almost everywhere in the internet and **Are really important because it seems that my WSUS database never undergo any maintenance**.

{{< highlight SQL "linenos=table" >}}
SELECT S.name as 'Schema',
T.name as 'Table',
I.name as 'Index',
DDIPS.avg_fragmentation_in_percent,
DDIPS.page_count
FROM sys.dm_db_index_physical_stats (DB_ID(), NULL, NULL, NULL, NULL) AS DDIPS
INNER JOIN sys.tables T on T.object_id = DDIPS.object_id
INNER JOIN sys.schemas S on T.schema_id = S.schema_id
INNER JOIN sys.indexes I ON I.object_id = DDIPS.object_id
AND DDIPS.index_id = I.index_id
WHERE DDIPS.database_id = DB_ID()
and I.name is not null
AND DDIPS.avg_fragmentation_in_percent > 0
ORDER BY DDIPS.avg_fragmentation_in_percent desc
{{< / highlight >}}

Running this query, it seems **that in my installation most of the indexes have a fragmentation aroung 99%**, this is usually a bad, bad thing that can impact performances. 

> First operation to do on your WSUS database is a nice index defrag

Defragging indexes is simple, I found a little script to **every index that is over 10% fragmentation**.

{{< highlight SQL "linenos=table" >}}
DECLARE fragmented CURSOR
For SELECT T.Name as 'table'

FROM sys.dm_db_index_physical_stats (DB_ID(), NULL, NULL, NULL, NULL) AS DDIPS
INNER JOIN sys.tables T on T.object_id = DDIPS.object_id
INNER JOIN sys.schemas S on T.schema_id = S.schema_id
INNER JOIN sys.indexes I ON I.object_id = DDIPS.object_id
AND DDIPS.index_id = I.index_id
WHERE DDIPS.database_id = DB_ID()
and I.name is not null
AND DDIPS.avg_fragmentation_in_percent > 10 and DDIPS.page_count > 100
group by T.Name 

OPEN fragmented;

declare @tableName nvarchar(1000)
FETCH NEXT FROM fragmented INTO @tableName;
declare @SQL nvarchar(max) 
WHILE @@FETCH_STATUS = 0  
    BEGIN
	    
		set @SQL='ALTER INDEX ALL ON [' + @tableName + '] REBUILD;'
		print @SQL;
		--print @SQL
		EXEC SP_EXECUTESQL @SQL
        FETCH NEXT FROM fragmented INTO @tableName;  
    END;
{{< / highlight >}}

Running this script may take a while, so I launched and leave the computer alone for a couple of hours. Once I defragged the index, WSUS started to respond again, it is still painfully slow, but at least it does not crashes. Next step is trying to **perform a WSUS cleanup from the console**

![Performing a WSUS cleanup](../images/wsus-cleanup.png)
***Figure 2:*** *Performing a WSUS cleanup*

 I had no luck, after few minutes, I got the very same error of Figure 1, cleanup routine **cannot complete due to timeout**. Observing size of the tables I got this result

![WSUS Table usage](../images/wsus-table-usage.png)
***Figure 3:*** *WSUS Table usage*

It was clear that most of the content is some form of xml, but I'm pretty sure I got **plenty of superseded updates I've removed, but without a cleanup the space is still used**. If you got this, you can use this PowerShell to perform WSUS cleanup. The advantage of PowerShell is that **it seems more resilient to timeout** (even if in my system I still experience errors)

{{< highlight PowerShell "linenos=table" >}}
Invoke-WsusServerCleanup -DeclineSupersededUpdates -DeclineExpiredUpdates -CleanupObsoleteUpdates -CleanupUnneed
{{< / highlight >}}

> Regularly running WSUS Maintenance with PowerShell will helps the server to run smoothly.

Running that script from PowerShell has the same effect of pushing SQL Server process to its limit. **It is good practice to backup database before the cleanup, and start querying the database for suggested index (you can find tons of queries around the internet), because often slow cleanup is due to some missing indexes**. It is also nice to start a profiler against SUSDB dumping query duration on another database, this will allow you **to check cleanup queries duration**.

One thing you can do is lookup at the query intercepted by the profiler, you should see some slow queries.

![WSUS cleanup in actio](../images/wsus-cleanup-in-action.png)
***Figure 4:*** *WSUS cleanup in action*

This gives me two important information, first the script is running, even if painfully slow, second it gave me the ability to see the queries it is doing, so I can **paste them in Management Studio and see from suggested indexes and execution plan if I can do something to speedup them (usually adding indexes)**.

I've found some index that can speed up my cleanup process, I added those indexes, re-run the cleanup, and this time it seems that it succeeded and it started to delete superseded updates (even if it is still painfully slow). **I deleted my index to avoid problems in the future and my WSUS is operational again**.

Hope this can help you too.

Gian Maria.
