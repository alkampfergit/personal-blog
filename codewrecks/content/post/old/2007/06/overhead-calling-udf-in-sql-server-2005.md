---
title: "Overhead calling UDF in Sql server 2005"
description: ""
date: 2007-06-11T08:00:37+02:00
draft: false
tags: [Sql Server]
categories: [Sql Server]
---
Today I found a performance issue in a project of mine, after some try, I found that the overhead of calling a udf function is really enormous...I have a query that move data from a table to another, it move about 25.000 rows, and one of the field of original table is transformed with a UDF. The query without udf runs in about 1500 ms, the query that calls udf runs in 180 minutes, even if in the UDF I simply return  the parameter and do no calculation at all. Then I come across [this post](http://www.novicksoftware.com/coding-in-sql/Vol3/cis-v3-N14-performannce-of-dot-net-code-sql-server-2005.htm) that deals about this issues....so the rule is, do not use udf if you know that the udf will be called for thousands rows.

Alk.
