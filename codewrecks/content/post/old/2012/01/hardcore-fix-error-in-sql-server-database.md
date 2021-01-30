---
title: "Hardcore fix error in Sql Server database"
description: ""
date: 2012-01-31T09:00:37+02:00
draft: false
tags: [Sql Server]
categories: [Sql Server]
---
In a production Sql Server database we had some issue with the hardware, the result is that one very big database started to gave us errors on DBCC CHECKDB, the error is the following one.

> Msg 8929, Level 16, State 1, Line 1        
> Object ID xxxxxx, index ID 1, partition ID xxxxxx, alloc unit ID xxxxx (type In-row data): Errors found in off-row data with ID xxxxxxx owned by data record identified by RID = (3:34252:4)

This happens in one of the most central and important table of the database, that contains millions of record, and only 20 rows gave us error, so I’d like to verify witch rows had the error, because in that table there are lots of records in logical status “deleted” and the corresponding physical row can be removed from the database without much pain and reinserted with the very same data to avoid dataloss.

So my question is… how can I identify the row given the RID (Row Identifier?) First of all from Object ID you can easily find the name of the table with  **select Object\_Name(&lt;Object\_ID&gt;)** but what about the RID. After a little search I find the sys.fn\_physLocFormatter function and I created this query

{{< highlight csharp "linenos=table,linenostart=1" >}}
SELECT sys.fn_PhysLocFormatter (%%physloc%%) AS RID,
*
into debug.RIDTABLE
FROM TableName
{{< / highlight >}}

I selected into a table in Debug schema the RID of the Row as well as all the other columns of the table with error, now I take the output of the DBCC CHECKDB, selected all the RID of rows with errors and I could execute the query

{{< highlight csharp "linenos=table,linenostart=1" >}}
select * from debug.RIDTABLE
where RID IN ('(3:34252:4)', '(x:xxxxx:x)'.....
{{< / highlight >}}

To extract from the RIDTAble all the row with errors, then I can simply delete them from the original table, and insert them again from the RIDTABLE. Checking the data inside RIDTABLE it seems that the data is correct, except for a NVARCHAR(MAX) field that contains long string of text.

After the process DBCC CHECKDB did not give any other error, so I was quite happy to solve this problem without the need to put the database in single-user-mode, but the most important aspect is that I was able to identify the rows with error, to understand the impact of errors in the software. It turned out that only a couple of lines contained really important data, the others are in Deleted status, so we did not lost anything so important.

Gian Maria.
