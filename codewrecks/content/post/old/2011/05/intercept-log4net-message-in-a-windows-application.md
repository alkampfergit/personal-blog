---
title: "Intercept Log4Net message in a Windows application"
description: ""
date: 2011-05-11T06:00:37+02:00
draft: false
tags: [log4net]
categories: [Software Architecture]
---
Scenario: I have some service that runs in the background, but I want the user to be able to launch interactively with a  windows form application and I want to intercept all log4net messages issued by the various components that works in the background.

Thanks to the supereasy way to write an appender in log4net, obtaining this result is really simple..

{{< highlight csharp "linenos=table,linenostart=1" >}}
public class Log4NetLogEventSourceAppender : AppenderSkeleton
{
private Object _syncRoot;
 
public Log4NetLogEventSourceAppender()
{
_syncRoot = new object();
}
 
/// <summary>
/// Occurs when [on log].
/// </summary>
public static event EventHandler<OnLog4NetLogEventArgs> OnLog;
 
protected override void Append(LoggingEvent loggingEvent)
{
EventHandler<OnLog4NetLogEventArgs> temp = OnLog;
if (temp != null)
{
lock (_syncRoot)
{
temp(null, new OnLog4NetLogEventArgs(loggingEvent));
}
}
}
 
}
 
public class OnLog4NetLogEventArgs : EventArgs
{
public LoggingEvent LoggingEvent { get; private set; }
 
public OnLog4NetLogEventArgs(LoggingEvent loggingEvent)
{
LoggingEvent = loggingEvent;
}
}
{{< / highlight >}}

This is a quick and dirty approach, a \_syncRoot object will serialize all events because this is a shared event I want to prevent multiple threads to messup logging. Thanks to the shared event you can simply add this appender to the list of enabled appender.

{{< highlight csharp "linenos=table,linenostart=1" >}}
<appender
name="Interceptor"
type="xxx.Log4NetLogEventSourceAppender, xxx">
<layout type="log4net.Layout.PatternLayout">
<conversionPattern value="%date [%thread] %-5level %logger [%property{NDC}] - %message%newline %property{analyzing_url}" />
</layout>
</appender>
{{< / highlight >}}

Now in code you should simply subscribe to appender event.

{{< highlight csharp "linenos=table,linenostart=1" >}}
Log4NetLogEventSourceAppender.OnLog += Log4NetLogEventSourceAppender_OnLog;
{{< / highlight >}}

And do something useful in the event handler, in my program I have a custom MVP pattern, and I simply add the log the to the view (that in turn shows a grid with all the logs with filtering and sorting capabilities).

{{< highlight csharp "linenos=table,linenostart=1" >}}
void Log4NetLogEventSourceAppender_OnLog(object sender, OnLog4NetLogEventArgs e)
{
View.AppendLog(e.LoggingEvent);
}
{{< / highlight >}}

Thanks to the extremely flexibility of log4net it is possible to manage logs in a great variety of locations, and with this simple interceptor you can propagate logging wherever you want.

Another useful application of this logger was made in a scheduled service,

{{< highlight csharp "linenos=table,linenostart=1" >}}
private void ReactToLogMessages(OnLog4NetLogEventArgs e, StringBuilder log4netLogs, ScanLog scanLog)
{
if (e.LoggingEvent.Level >= log4net.Core.Level.Info)
{
log4netLogs.AppendLine(e.LoggingEvent.RenderedMessage);
}
//ora capire il livello di errore
if (e.LoggingEvent.Level == log4net.Core.Level.Warn)
{
scanLog.NumOfWarnings++;
}
else if (e.LoggingEvent.Level == log4net.Core.Level.Error)
{
scanLog.NumOfErrors++;
}
}
{{< / highlight >}}

This function simply append all info or greater logs to a string, but the most important fact is that he count the number of warning and errors, and after the task finish, it warn the administrator if there are errors or more than a certain number of warning. This will make simple to react to task that have problems.

Alk.
