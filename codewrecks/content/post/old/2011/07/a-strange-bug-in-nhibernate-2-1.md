---
title: "A strange bug in NHibernate 21"
description: ""
date: 2011-07-28T11:00:37+02:00
draft: false
tags: [Nhibernate]
categories: [Nhibernate]
---
In a [previous post](http://www.codewrecks.com/blog/index.php/2011/07/23/use-sql-server-query-hints-with-nhibernate-hql-and-icriteria/) I described a technique to insert query hints into [NHibernate](http://nhforge.org/Default.aspx) query with the use of comments. Testing this code in a real project lead to a strange exception when I issue queries with [ICriteria](http://knol.google.com/k/nhibernate-chapter-13-criteria-queries#)

> The query should start with ‘SELECT’ or ‘SELECT DISTINCT’

This happens because ICriteria queries inserts comments inside the query and if you enable comments to flow into the query with the setting use\_sql\_comments something weird happens when you use SetMaxResults to issue a paginated query. If you look into the NHibernate code that is throwing the exception you find this function in the Sql Dialect

{{< highlight csharp "linenos=table,linenostart=1" >}}
private static int GetAfterSelectInsertPoint(SqlString sql)
{
if (sql.StartsWithCaseInsensitive("select distinct"))
{
return 15;
}
else if (sql.StartsWithCaseInsensitive("select"))
{
return 6;
}
throw new NotSupportedException("The query should start with 'SELECT' or 'SELECT DISTINCT'");
}
{{< / highlight >}}

As the name of the function states, the purpose of this code is finding the insert point in the query immediately after the Select part of the query and is used when you call SetMaxResult to insert the TOP keyword immediately after the select clause. Since using ICriteria can generate comments in the SQL like***/\* criteria query \*/***, this lead to an obvious exception because the query does not start with a  standard select or select distinct. But having comment does not harms in any way the generation of a paginated query, so I changed the function in this way

{{< highlight csharp "linenos=table,linenostart=1" >}}
private static int GetAfterSelectInsertPoint(SqlString sql)
{
Int32 selectPosition = 0;
if ((selectPosition = sql.IndexOfCaseInsensitive("select distinct")) >= 0)
{
return selectPosition + 15; // "select distinct".Length;
}
else if ((selectPosition = sql.IndexOfCaseInsensitive("select")) >= 0)
{
return selectPosition + 6; // "select".Length;
}
throw new NotSupportedException("The query should start with 'SELECT' or 'SELECT DISTINCT'");
}
{{< / highlight >}}

Using InexOfCaseInsensitive function permits me to find the insertion point after the select clause even if some comments are present in the query. Now everything works as expected as you can verify from [NhibernateProfiler](http://nhprof.com/). I run all the NH tests and they are all green, excepts one that verify that an exception is thrown if the query begins with /\* criteria query \*/, but this is the bug I want to fix :) so I do not care about it :). Now I run the query again with my custom recompiled version of nhibernate and I got.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2011/07/image_thumb8.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2011/07/image8.png)

 ***Figure 1***: *The top 5 clause was correctly inserted in the query even if there is a comment present in the query*

Gotcha: the bug is solved, top 5 was correctly inserted even if there are comments on top of the query. Having the source of a library is invaluable if you need to fix bug :)

alk.
