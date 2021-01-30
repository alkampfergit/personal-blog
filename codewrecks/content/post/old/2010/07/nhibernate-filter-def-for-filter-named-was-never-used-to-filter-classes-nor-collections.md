---
title: "NHibernate filter-def for filter named  was never used to filter classes nor collections"
description: ""
date: 2010-07-05T08:00:37+02:00
draft: false
tags: [General]
categories: [General]
---
While I was upgrading a project to the latest version of nhibernate I encounter this error

> filter-def for filter named UserContext was never used to filter classes nor collections

The code worked perfectly with the older version of nhibernate, but with the new version it does not work. Thanks to my friend [Guardian](http://www.primordialcode.com/) we have found the problem. The problem is due to a filter used only into a formula, the validator of nhibernate configuration, does not find the filter used in any mapping, does not scan formula, and thinks that the filter is never used.

The solution is really simple, in the class that uses the filter, simply add a filter definition that is always verified such as.

{{< highlight csharp "linenos=table,linenostart=1" >}}
<filter name="UserContext" condition="Id > 0" />
{{< / highlight >}}

And everything works ok.

alk.
