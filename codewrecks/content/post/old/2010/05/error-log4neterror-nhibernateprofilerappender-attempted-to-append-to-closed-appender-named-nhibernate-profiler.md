---
title: "Error log4netERROR NHibernateProfilerAppender Attempted to append to closed appender named NHibernateProfiler"
description: ""
date: 2010-05-24T13:00:37+02:00
draft: false
tags: [Nhibernate]
categories: [Nhibernate]
---
[NHprofiler](http://nhprof.com/) de facto is â€œTHE TOOLâ€ to work with NHibernate, :)

If you work with NHibernate you must have NHProf, if you use it for 1 minute you can never work without it in the future, period. :)

I started today to use NHProf even for unit testing, since I want to be able to look at generated sql during tests of entities. I have a base test infrastructure to work with helper, so I have this snippet of code in fixture setup.

{{< highlight csharp "linenos=table,linenostart=1" >}}
if (inited == false)
{
inited = true;
HibernatingRhinos.Profiler.Appender.NHibernate.NHibernateProfiler.Initialize();
}
{{< / highlight >}}

When I run the unit test I see that session initialization data will shown in nhibernate profiler ui, but the test then throws a

> log4net:ERROR [NHibernateProfilerAppender] Attempted to append to closed appender named [NHibernate.Profiler]

This happens because NhProfiler uses log4net to intercept nhibernate calls, and it seems that someone closes the appender before nhprof has finished collecting data. This error happens because you need to configure log4net before the call to

{{< highlight csharp "linenos=table,linenostart=1" >}}
HibernatingRhinos.Profiler.Appender.NHibernate.NHibernateProfiler.Initialize();
{{< / highlight >}}

If you like me use the Castle Log4Net faciliy, you simply need to be sure that the facility configures log4net before starting nhprofiler

{{< highlight csharp "linenos=table,linenostart=1" >}}
if (inited == false)
{
ILogger logger = IoC.Resolve<ILogger>();
inited = true;
HibernatingRhinos.Profiler.Appender.NHibernate.NHibernateProfiler.Initialize();
}
{{< / highlight >}}

In my situation the act of resolving an ILogger makes me sure that log4net is completely configured before I started nhprofiler appender and everything works well.

alk.
