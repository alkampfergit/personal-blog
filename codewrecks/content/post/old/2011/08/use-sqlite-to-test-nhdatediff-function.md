---
title: "Use SQLite to test NH-DateAdd function"
description: ""
date: 2011-08-29T14:00:37+02:00
draft: false
tags: [Nhibernate]
categories: [Nhibernate]
---
{{< highlight csharp "linenos=table,linenostart=1" >}}
DateAdd(dd, T.AnalysisFrequence, :refdate)
{{< / highlight >}}

Quite often I use SQLite to create Unit Tests of NH queries with a fast In-Memory database, and then run the queries against a standard Sql Server database.

Today I have this problem, an HQL query uses the DateAdd Sql Server function

{{< highlight csharp "linenos=table,linenostart=1" >}}
DateDiff(dd, T.AnalysisFrequence, :refdate)
{{< / highlight >}}

In this query with the DateAdd function I want to obtain a date that is calculated adding an amount of days from a reference date. Running this query against a SQLite database gave me an error, clearly because there is no DateAdd function in SQLite.

The solution is simple, you can use the julianday if you are using the *dd* constant in the DateAdd function (you are subtracting days and not seconds or other time value). You can add this function to your custom dialect to create a DateAdd function in the SQLite dialect.

RegisterFunction("DateAdd", new SQLFunctionTemplate(NHibernateUtil.Date, "julianday(?3) + ?2"));

This is valid only if you use the DateAdd(*dd*, xxx, yy) but since this is my situation, this solves my problems.

Alk.
