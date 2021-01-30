---
title: "Application insight real life avoid sending garbage to AI instance"
description: ""
date: 2019-03-03T18:00:37+02:00
draft: false
tags: [ApplicationInsights]
categories: [Azure]
---
Application Insight is a real nice  **azure service that allows you to instrument your application to have a complete set of  telemetries and problem diagnostics**. Usually when you start using Application Insight, you also have some log in place (log4net, serilog) and you want to integrate logs with AI so some kind of logs (Ex errors) will be automatically send to AI.

All these log libraries allows you to write a sink / appender to send logs to your chosen destination, thus, sending all your serilog / log4net logs to application insight is usually a matter of minutes.

> Integrating existing log library with Application Insight is a matter of few minutes of code, or just referencing some existing libraries

Even if this seems a perfect solution it is not without problem, as an example  **it is possible to have too much logs sent to AI from log library**. In a software I’m developing there is a poller with 50ms interval on a collection in MongoDb database. For various reason a wrong record got in the collection, we have deserialization error in some of the clients, and Boom, we have an exception log each 50 ms for 4 machines, and it is 288k of logs for each hour. Net result is that the instance of Application Insight was full of unnecessary and identical logs.

Another potential problem is logging every mongo query (polling will flood ai with lots of identical query with less than 1 ms execution time), this will simply pollute your AI instance of rubbish data.

Luckily enough,  **AI has the ability to** [**intercept any logs**](https://docs.microsoft.com/en-us/azure/azure-monitor/app/api-filtering-sampling) **to filter it out before it is sent to azure,** the secret is implementing ITelemetryProcessor interface, because it allows you to filter out unwanted logs.

{{< highlight csharp "linenos=table,linenostart=1" >}}


public void Process(ITelemetry item)
{
    if (item is DependencyTelemetry dependencyTelemetry)
    {
        if (!OkToSend(dependencyTelemetry))
        {
            return;
        }
    }
    else if (item is ExceptionTelemetry exceptionTelemetry)
    {
        if (!OkToSend(exceptionTelemetry))
        {
            return;
        }
    }
    else if (item is EventTelemetry eventTelemetry)
    {
        if (!OkToSend(eventTelemetry))
        {
            return;
        }
    }
  _next.Process(item);

{{< / highlight >}}

As you can see, implementing process method leaves complete freedom on filtering the telemetry, because  **if you do not want it to be sent to AI, simple do not call \_next.Process.** > Application insight is really extendible and have tons of extensibility points to customize information. In this article I’m dealing with the ITelemetryProcessor that allow you to manipulate and optionally completely discard a telemetry before it is sent to the server.

Once you create your telemetry processor you simply need to add to the default chain. For this example I have a simple component that does a couple of things, it will avoid flooding AI with identical errors and avoid to track any mongo dependencies that last for less than a certain number of ms.

{{< highlight csharp "linenos=table,linenostart=1" >}}


var builder = TelemetryConfiguration.Active.TelemetryProcessorChainBuilder;

Int32 limitQueryLogInMs = 50;
if (Int32.TryParse(MongoDependencyMinDurationInMilliseconds ?? String.Empty, out Int32 limitDuration))
{
    limitQueryLogInMs = limitDuration;
}

builder.Use((next) => new JarvisApplicationInsightFilter(next, limitQueryLogInMs));
builder.Build();

{{< / highlight >}}

This solution was developed because in this project, the  **customer is starting using AI mainly to monitor for problems** so we are interested only in slow mongo dependencies.

The logic inside OkToSend is 100% custom for your need. In this example we want to filter out any dependencies that have some special string in the name, we want also to filter out all dependencies that have  **url** custom property with a certain string. The first two line assures that any dependency that failed will be sent to AI without any further filtering (we do not want to miss a failed dependency because it falls under duration filter)

{{< highlight csharp "linenos=table,linenostart=1" >}}


private bool OkToSend(DependencyTelemetry dependencyTelemetry)
{
    //always log dependency that failed,
    if (dependencyTelemetry.Success != true)
        return true;

    //ok filter out
    if (_forbiddenTelemetryStrings.Any(u => dependencyTelemetry.Data.IndexOf(u, StringComparison.OrdinalIgnoreCase) >= 0))
    {
        return false;
    }

    if (dependencyTelemetry.Properties.TryGetValue("Url", out var url))
    {
        if (_forbiddenUrl.Any(u => url.IndexOf(u, StringComparison.OrdinalIgnoreCase) >= 0))
        {
            return false;
        }
    }

{{< / highlight >}}

The second feature of this processor is avoid flooding AI if an exception trace goes south.  **The goal is avoiding too many identical exception in a short time range** ; if some part of the application is experiencing errors, we want at max 1 exception trace in a given interval.  **An error is symptom that something is wrong, if the Db is not reachable and I’m polling each 50ms, an exception each 5 minutes is perfectly ok and it is far better than an exception each 50ms.** > It is always a good practice to limit the number of logs you send to Application Insight, to avoid using too much bandwidth and clutter the server with garbage

 **For this reason we have a simple antiflood component to monitor how often we are sending telemetry identified with a give string, that uniquely identify the call.** As an example if I configure my antiflood with 5 minutes interval, whenever I call antiflood.ShouldPass method with a given string key, it returns true not more than one time each 5 seconds for the same string.

To have an unique string for an exception I use three properties, Loggername (the name of the class that is logging), Servicename (the name of the logical microservices that is logging) and finally User (if present is the name of the user that request a command, called api etc).  **The goal is avoid flooding the server, but also avoiding to miss some important exception.** {{< highlight csharp "linenos=table,linenostart=1" >}}


private bool OkToSend(ExceptionTelemetry exceptionTelemetry)
{
    //Some exception can be rogue, like pollers, they tend to flood the log with unuseful exception.
    String exceptionKey = "EXCEPTION/";
    var propertyNames = new[] { "Loggername", "ServiceName", "User" };
    foreach (var propertyName in propertyNames)
    {
        if (exceptionTelemetry.Properties.TryGetValue(propertyName, out var propertyValue))
        {
            //a single logger can go rogue.
            exceptionKey += propertyValue + "/";
        }
    }

    exceptionKey += exceptionTelemetry.Message.Substring(0, Math.Min(exceptionTelemetry.Message.Length, 50));
    return _antiflooder.ShouldPass(exceptionKey);
}

{{< / highlight >}}

If a single poller gone wild, I got no more than 1 exception each 5 minutes, but if the entire db is down, I got more exception because each 5 minutes I can have an exception for each logger, services and unique user. Usually  **this lead to hundreds of exception each minute, but this is a clear indication that something catastrophic is happening (db is down and every single component that depends from the db is failing).** Finally, the antiflooder maintains count of the number of discharged exceptions, and a timer will evict each string after the threshold time passed. This will allows me to log how many exception were really logged during the antiflood interval.

{{< highlight csharp "linenos=table,linenostart=1" >}}


private void Antiflooder_EventEvicted(object sender, Antiflooder.AntiFlooderEntryEvictedEventArgs e)
{
    if (e.Count > 1)
    {
        TraceTelemetry traceTelemetry = new TraceTelemetry();
        traceTelemetry.SeverityLevel = e.Entry.StartsWith("EXCEPTION") ? SeverityLevel.Error : SeverityLevel.Information;
        traceTelemetry.Message = $"Antiflood got N°{e.Count} occurrences of {e.Entry} in an interval of {e.GetElapsedSeconds()} seconds";
        ApplicationInsightConfiguration.Instance.GetTelemetryClient().TrackTrace(traceTelemetry);
    }
}

{{< / highlight >}}

If I have more than one calls, it means that the antiflood discharged some logs, but I want to trace how many error logs were really generated.

With few lines of code I was able to avoid my application to send tons of unnecessary traces (dependency and errors) to AI instance, keeping only interesting traces.

 **I was really amazed by the flexibility of Application Insight library, because it allows me to have full control** of the trace pipeline with few line of code. This example was made with C#, but you can obtain the same result with SDK for other tecnologies.

Gian Maria
