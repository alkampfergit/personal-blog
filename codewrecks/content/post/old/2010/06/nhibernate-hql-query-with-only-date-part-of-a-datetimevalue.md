---
title: "NHibernate HQL query with only date part of a datetimevalue"
description: ""
date: 2010-06-04T11:00:37+02:00
draft: false
tags: [Nhibernate]
categories: [Nhibernate]
---
DateTime values are one of the most feared type of data to store in database. Suppose you have an entity with a datetime Property, and you want to do a standard report finding the count of each entity for each day in a date range, if you groupBy the DateTime property, surely you will get wrong results, because you will end with a lot of entries with count = 1, because it is really difficult that two entities will have the very same datetime value. What you want is to group by only with the date part of the datetime property.

Since NHibernate does not come with a predefined date function, you need to create a custom dialect to solve the problem, first of all I have a custom dialect for my SqlLite unit tests.

{{< highlight csharp "linenos=table,linenostart=1" >}}
public class SqlLiteDialect : NHibernate.Dialect.SQLiteDialect
{
public SqlLiteDialect()
{
RegisterFunction("date", new SQLFunctionTemplate(NHibernateUtil.Date, "date(?1)"));
}
}
{{< / highlight >}}

Since SqlLite already have a [date function](http://www.sqlite.org/cvstrac/wiki?p=DateAndTimeFunctions) that extract the date part of a date, I simply need to instruct NHibernate dialect that such function exists registering the function â€œdateâ€ with a SqlFunctionTemplate, this means that whenever the HQL parser will find a call to date() function it will substitute the date(?1) string, where ?1 will be substituted with the real parameter of the function.

In production, the code will run against a sql server 2008, and we have already defined a function called dbo.trunc that will truncate the time part of the date in our databases, so I create a similar dialect for sql server.

{{< highlight csharp "linenos=table,linenostart=1" >}}
public class MySqlDialect : NHibernate.Dialect.MsSql2008Dialect
{
public MySqlDialect ()
{
RegisterFunction("date", new SQLFunctionTemplate(NHibernateUtil.Date, "dbo.trunc(?1)"));
 
}
}
{{< / highlight >}}

The great advantage of the dialect approach, is that you are able to write a hql query like this:

{{< highlight csharp "linenos=table,linenostart=1" >}}
Select date(A.ActionDate), count(*)
from Action A
where A.ActionDate >= :startdate and A.ActionDate <= :enddate
group by date(A.ActionDate)
{{< / highlight >}}

Where I'm able to use date() function, but at the same time it gets translated in different way respect the dialect I use. If in the future I will need to use Oracle, I'll simply create another dialect, without the need to modify any HQL query.

alk.
