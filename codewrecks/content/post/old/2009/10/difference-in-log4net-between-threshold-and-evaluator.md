---
title: "Difference in log4net between threshold and evaluator"
description: ""
date: 2009-10-22T09:00:37+02:00
draft: false
tags: [log4net]
categories: [Frameworks]
---
In log4net configuration you can filter out event by level in almost any appender, since it is supported by the AppenderSkeleton, the base class for every appender.

{{< highlight xml "linenos=table,linenostart=1" >}}
<appender name="GeneralLog" type="log4net.Appender.RollingFileAppender">
    <file value="Logs/exception.txt" />
    <appendToFile value="true" />
    <maximumFileSize value="10000KB" />
    <rollingStyle value="Size" />
    <maxSizeRollBackups value="5" />
    <threshold value="ERROR"/>{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

Sometimes I see different configuration that uses an evaluator.

{{< highlight xml "linenos=table,linenostart=1" >}}
<evaluator type="log4net.Core.LevelEvaluator">
    <threshold value="ERROR"/>
</evaluator>{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

If you think that this is the same as before you are wrong. This setting is supported by all appenders that inherit from BufferingAppenderSkeleton, basically the above configuration tells the buffered appender to flush the buffer if an error of level *ERROR* is logged, this is expecially useful to have an immediate log of errors of the application.

Alk.

Tags: [Log4Net](http://technorati.com/tag/Log4Net)
