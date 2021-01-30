---
title: "Live logging with log4net and WCF part 2"
description: ""
date: 2008-11-05T11:00:37+02:00
draft: false
tags: [NET framework,Frameworks]
categories: [NET framework,Frameworks]
---
In [previous post](http://www.codewrecks.com/blog/index.php/2008/11/05/a-custom-publishsubscriber-appender-for-log4net/) I showed how to create a publish/subscribe logger with WCF and log4net, now I show you my first use of this particular appender.

When you work with nhibernate you can use show-sql configuration parameter to instruct nhibernate to show generated sql, but how can you see this output in a running windows application? You should know that NHibernate has various log4Net logger, and you can instruct the session to dump all sql code to a logger, here it is a possible configuration

{{< highlight xml "linenos=table,linenostart=1" >}}
<appender name="WCFAppender" type="LiveLogger4Log4Net.WCFAppender, LiveLogger4Log4Net">
    <layout type="log4net.Layout.PatternLayout" >
        <conversionPattern value="%date [%thread] %-5level %logger %ndc - %message%newline" />
    </layout>
</appender>

<logger name="NHibernate.SQL" additivity="false">
    <level value="DEBUG" />
    <appender-ref ref="WCFAppender" />
</logger>{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

With this configuration I instruct NHibernate to log to WCFAppender all generated SQL. Now I can attach a log viewer to a running application and look in real time to the sql instruction that nhibernate generates. You can attach more than one application, whenever you want.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2008/11/image-thumb1.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2008/11/image1.png)

Welcome to log4net live logging monitor :D

alk.

Tags: [log4Net](http://technorati.com/tag/log4Net) [NHibernate](http://technorati.com/tag/NHibernate)

<script type="text/javascript">var dzone_url = 'http://www.codewrecks.com/blog/index.php/2008/11/05/live-logging-with-log4net-and-wcf-part-2/';</script><script type="text/javascript">var dzone_title = 'Live logging with log4net and WCF part 2';</script><script type="text/javascript">var dzone_blurb = 'Live logging with log4net and WCF part 2';</script><script type="text/javascript">var dzone_style = '2';</script><script language="javascript" src="http://widgets.dzone.com/widgets/zoneit.js"></script> 

[![DotNetKicks Image](http://www.dotnetkicks.com/Services/Images/KickItImageGenerator.ashx?url=http://www.codewrecks.com/blog/index.php/2008/11/05/live-logging-with-log4net-and-wcf-part-2/&amp;bgcolor=0080C0&amp;fgcolor=FFFFFF&amp;border=000000&amp;cbgcolor=D4E1ED&amp;cfgcolor=000000)](http://www.dotnetkicks.com/kick/?url=http://www.codewrecks.com/blog/index.php/2008/11/05/live-logging-with-log4net-and-wcf-part-2/)
