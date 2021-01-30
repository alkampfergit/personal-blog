---
title: "Show NHibernate query in the trace of aspnet pages"
description: ""
date: 2009-10-13T10:00:37+02:00
draft: false
tags: [Nhibernate]
categories: [Nhibernate]
---
When you use NHibernate and asp.net one of the most interesting stuff is looking at sql generated for *each page call*. While [NHProf](http://www.nhprof.com/) is the best tool to accomplish this task, it is interesting to trace issued sql queries using asp.net trace engine.

To accomplish this task is really straightforward thanks to log4net, first of all configure a suitable appender in log4net config file.

{{< highlight xml "linenos=table,linenostart=1" >}}
<appender name="AspNetTraceAppender" type="log4net.Appender.AspNetTraceAppender" >
    <layout type="log4net.Layout.PatternLayout">
        <conversionPattern value="%date [%thread] %-5level %logger [%property{NDC}] - %message%newline" />
    </layout>
</appender>{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

This appender sends all messages to asp.net trace engine, then enable tracing in the web.config.

{{< highlight xml "linenos=table,linenostart=1" >}}
 <trace enabled="true" pageOutput="true" requestLimit="100" localOnly="true" />{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

Now you need to configure log4net to issue all nhibernate logs to the previous appender.

{{< highlight xml "linenos=table,linenostart=1" >}}
<logger name="NHibernate" additivity="false">
    <level value="INFO" />
    <appender-ref ref="AspNetTraceAppender" />
</logger>

<logger name="NHibernate.SQL" additivity="false">
    <level value="DEBUG" />
    <appender-ref ref="AspNetTraceAppender" />
</logger>{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

I keep the standard level of NHIbernate to INFO, but the NHibernate.SQL to DEBUG. The result is the following.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2009/10/image-thumb6.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2009/10/image6.png)

Et voila, you get all the query that were issued to the database in the trace of your page, without the need to attach debugger or trace or whatever else. This is especially interesting if you use continuous integration and all testers usually work with latest site version running on test server. With such a facility everyone can look at what is really happening to the database.

alk.

Tags: [NHibernate](http://technorati.com/tag/NHibernate)
