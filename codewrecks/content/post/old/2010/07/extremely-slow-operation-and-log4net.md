---
title: "Extremely slow operation and log4net"
description: ""
date: 2010-07-05T10:00:37+02:00
draft: false
tags: [log4net]
categories: [Tools and library]
---
I'm currently profiling a web application, and I noticed that for some combination of input, a specific search into the database is really really slow. After verifying that the query is not responsible for this problem I fire a profiler, load the page, issue the search and then verify with ant profiler the method that need more time to be executed. The result was that the method that needs more time to be executed is one called Send Alert, that simply logs with log4net to a specific logger called Alert.

I noticed a lot of SocketException, so I verify the configuration, and find that the Alert logger has a reference to a SmtpAppender that points to a wrong smtp server. The page was slow because it is waiting to send an alert with a wrong mailserver, then it waits for timeout before proceeding on.

Ok, this is a configuration problem, but I do not want my email alert to be sent synchronously, because there is no point in slowing the application if I need to send an alert. Remember that sending an E-Mail is a slow operation even if the smtp is ok. In this situation Log4Net has a specific appender called AsyncAppender that can be used to solve this problem. The AsyncAppender is a specific appender that is used to wrap any other appender, and make the log asyncronous. The only part I need to change is to add this to configuration

{{< highlight csharp "linenos=table,linenostart=1" >}}
<appender name="AsyncSmtpAppender"
type="SampleAppendersApp.Appender.AsyncAppender,SampleAppendersApp">
<appender-ref ref="SmtpAppender" />
</appender>
{{< / highlight >}}

and use the AsyncSmtpAppender in logger definition.

{{< highlight csharp "linenos=table,linenostart=1" >}}
<logger name="Alerter" additivity="false">
<level value="WARN" />
<appender-ref ref="AsyncSmtpAppender" />
</logger>
{{< / highlight >}}

Then I reload the page again, and now, even with a wrong smtp server, the page loads almost instantaneously.

Alk.
