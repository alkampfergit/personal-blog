---
title: "Check progress of DBCC CHECKDB"
description: ""
date: 2012-02-07T10:00:37+02:00
draft: false
tags: [Sql Server]
categories: [Sql Server]
---
If you issue a [DBCC CHECKDB](http://msdn.microsoft.com/en-us/library/ms176064.aspx) on a big database to verify for consistency errors, it will take a long time to complete, but the Management Studio windows usually does not give you any hint about how long does it take, or a percentage progress. Luckily enough sql server has a Dynamic Management View that can solve your problem.

This is the SQL code to visualize progress of the operation

{{< highlight csharp "linenos=table,linenostart=1" >}}
SELECT  session_id ,
request_id ,
percent_complete ,
estimated_completion_time ,
DATEADD(ms,estimated_completion_time,GETDATE()) AS EstimatedEndTime,
start_time ,
status ,
command
FROM sys.dm_exec_requests
WHERE database_id = 16
{{< / highlight >}}

In my example I filtered the results only for the database and used the Id of the database that you can obtain with the [DB\_ID](http://msdn.microsoft.com/en-us/library/ms186274.aspx) function.

An example of what you got with this query is represented in the following picture.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2012/02/image_thumb6.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2012/02/image6.png)

As you can see you can easily visualize percentage of completion, estimated end time and the command that is running.

Gian Maria.
