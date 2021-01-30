---
title: "Why Management Studio forces you to know SQL"
description: ""
date: 2011-12-28T10:00:37+02:00
draft: false
tags: [Sql Server]
categories: [Sql Server]
---
Suppose you have a big table with about 3 GB of data in and you need to add a nullable new column on it, you can open SSMS, open the table in designer and create a new column of type Int called sclo\_durationInMinutes, press save and the table gets update quite immediately.

Then you realize that the user want the duration in Minutes as a floating point number, so you open the designer, change the type of the sclo\_durationInMinutes from Int to Float and press save…. after 30 seconds SSMS tells you that you got a timeout. If you look at the change script you can verify, with HORROR, that changing the type of a column is done with the creation of a temporary table, copy all the data (3 GB) in the temp table and finally deleting the old table and renaming the temp table with the name of the original table… REALLY?

Then I simply opened a new query and issue an ALTER TABLE manually

{{< highlight csharp "linenos=table,linenostart=1" >}}
alter table dbo.scanlog
alter column sclo_durationInMinutes Float null
{{< / highlight >}}

I know that SSMS should work for a wide range of change, but requiring a full copy of a table just to change the type of a column it is quite overkill.

In the end, if you use SSMS it is better for you to have a deep knowledge of SQL, because the designer too much often opts for Copy-drop-rename strategy to alter structure of a table.

Gian Maria.
