---
title: "Performance of logging system"
description: ""
date: 2008-11-07T06:00:37+02:00
draft: false
tags: [NET framework,Tools and library]
categories: [NET framework,Tools and library]
---
When you insert a logging system into your application you should do some preliminary test for performance issue. The most important thing is that logging infrastructure should not introduce too much overhead when the log is disabled. With log4net you have different way to handle the log, suppose you have a logger and the DEBUG level is disabled; you can use one of these three form

{{< highlight csharp "linenos=table,linenostart=1" >}}
log1.Debug("TEST");
if (log1.IsDebugEnabled) log1.Debug("TEST");

Boolean isDebugEnabled = log1.IsDebugEnabled;
if (isDebugEnabled) log1.Debug("TEST");{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

The first version rely on the fact that log4net infrastructure internally checks if debug is enabled so you can call Debug function directly. The second technique is to check if log1.IsDebugEnabled before calling log1.Debug(), and the third stores the IsDebugEnabled in a local variable to check that variable instead of calling IsDebugEnabled each time. If you do one million log calls you will obtain these rough measurements in milliseconds.

{{< highlight csharp "linenos=table,linenostart=1" >}}
log1.Debug("TEST") = 828.125
if (log1.IsDebugEnabled) log1.Debug("TEST") = 750
if (isDebugEnabled)  log1.Debug("TEST") = 31.25{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

Thus solution 1 and 2 are quite similar in performances, while the third version is obviously the winner because it has not to call the log1.IsDebugEnabled at each run.

Now suppose that the messages is not a constant string but it has to be build

{{< highlight csharp "linenos=table,linenostart=1" >}}
for (Int32 I = 0; I < iterations; ++I)
{
    log1.Debug("TEST" + I.ToString() + "other");
}{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

In this situation the first test is important

{{< highlight csharp "linenos=table,linenostart=1" >}}
log1.Debug("TEST" + I.ToString() + "other") = 2968.75
if (log1.IsDebugEnabled) log1.Debug("TEST" + I.ToString() + "other") = 75
if (isDebugEnabled)  log1.Debug("TEST" + I.ToString() + "other") = 31.25{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

The second and third results have the same timing as before, the log is disabled so both conditions evaluates to false as before. The important fact is that the first technique is much more slower, this because even if the debug level is not enable, you have to pay the time to do string concatenation to create the message to send to log.Debug function.

The conclusion is: *always check if the log is enabled*. Moreover do not forget to use log4net compiled in release mode to production code, the above timing with release version of log4net are the followings.

{{< highlight csharp "linenos=table,linenostart=1" >}}
log1.Debug("TEST") = 359.375
if (log1.IsDebugEnabled) log1.Debug("TEST") = 250
if (isDebugEnabled)  log1.Debug("TEST") = 0
log1.Debug("TEST" + I.ToString() + "other") = 2296.875
if (log1.IsDebugEnabled) log1.Debug("TEST" + I.ToString() + "other") = 250
if (isDebugEnabled)  log1.Debug("TEST" + I.ToString() + "other") = 15.625{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

As you can expect, the release version have really better performance.

Alk.

Tags: [Logging](http://technorati.com/tag/Logging) [log4net](http://technorati.com/tag/log4net)

<script type="text/javascript">var dzone_url = 'http://www.codewrecks.com/blog/index.php/2008/11/07/performance-of-logging-system/';</script><script type="text/javascript">var dzone_title = 'Performance of logging system';</script><script type="text/javascript">var dzone_blurb = 'Performance of logging system';</script><script type="text/javascript">var dzone_style = '2';</script><script language="javascript" src="http://widgets.dzone.com/widgets/zoneit.js"></script> 

[![DotNetKicks Image](http://www.dotnetkicks.com/Services/Images/KickItImageGenerator.ashx?url=http://www.codewrecks.com/blog/index.php/2008/11/07/performance-of-logging-system/&amp;bgcolor=0080C0&amp;fgcolor=FFFFFF&amp;border=000000&amp;cbgcolor=D4E1ED&amp;cfgcolor=000000)](http://www.dotnetkicks.com/kick/?url=http://www.codewrecks.com/blog/index.php/2008/11/07/performance-of-logging-system/)
