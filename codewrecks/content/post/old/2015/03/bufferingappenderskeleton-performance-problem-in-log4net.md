---
title: "BufferingAppenderSkeleton performance problem in log4net"
description: ""
date: 2015-03-27T18:00:37+02:00
draft: false
tags: [log4net,Performance]
categories: [Tools and library]
---
## The problem

Today I was working to [Jarvis](http://www.ienumerable.it/) project and I got a warning from another developer telling me that MongoDbAppender for Log4net slows down the application during a full Rebuild of all projections. In that specific situation we have log level set to DEBUG and the rebuild generates 800k logs inside mongo database, so I’m expecting Mongo Appender to slow down a little bit. The problem is: **using a standard FileAppender to verify difference in speed it results that the FileAppender was really faster than the MongoDbAppender**.

Setting up a simple load test with a nunit test showed me that the result is true, logging 10k messages in my machine requires 2000ms with MongoDbAppender but only 97ms with a FileAppender. After some profiling with [ANTS Profiler](http://www.red-gate.com/products/dotnet-development/ants-performance-profiler/) I was puzzled, because  **time was not spent in my code**. The next step was: I created a test appender that inherits from BufferingAppenderSkeleton but does nothing (it does not log anything); with my surprise it takes almost the same time of my MongoDbAppender. Where is the bottleneck??

## Investigating how Log4Net works internally

 **This** [**post in Stack Overflow**](http://stackoverflow.com/questions/11319319/log4net-bufferingforwardingappender-performance-issue) **explains the problem.** To summarize here is what happens: LoggingEvent object from Log4net has lots of volatile variables. These variables have correct value when the event is passed to appender, but the value could not be valid afterwards. If you store LoggingEvents objects (as the BufferingAppenderSkeleton does) for later use, you need to call a method called [FixVolatileData](http://logging.apache.org/log4net/release/sdk/log4net.Core.LoggingEvent.FixVolatileData_overload_1.html) on LoggingEvent to avoid reading wrong data.

To verify that this is the real reason, I simply changed the PatternLayout of the FileAppender to use one of these volatile properties the username (I know that this is one expensive variable). Here is the new layout.

> “%date %username [%thread] %-5level %logger [%property{NDC}] – %message%newline”

Running again the test confirm my supposition, FileAppender execution time raised from 90ms to 1100ms, just because I asked it to include the %username property.  **This means that simply accessing UserName property slows down performance of a 10 factor**.

> <font>This test shows an important fact: performance of various log4net appenders is related to which information you are loggin.&nbsp; If you are not interested to the %username property, avoid using it because it will slow down a lot your appender. The same is true for Location property on LoggingEvent object.</font>

## Why BufferingAppenderSkeleton is so slow even if you do not log anything

Previous explanation on how FixVolatileData works gives me the explanation on  **why simply inheriting from BufferingAppenderSkeleton slows down the appender a lot** , even if you are doing nothing in the SendBuffer function.

> Since BufferingAppenderSkeleton cannot know in advance which fields of Logging Event you are going to access, it takes the most conservative approach: it fixes all the property on the LoggingEvent for every log, then stored in its internal buffer. Fixing every volatile property have the same penality of accessing them and this explain everything.

## How can you solve it

The solution is super-simple,  **BufferingAppenderSkeleton has a** [**Fix**](http://logging.apache.org/log4net/release/sdk/log4net.Core.LoggingEvent.Fix.html) **property** that has the same meaning of the same [Fix property](http://logging.apache.org/log4net/release/sdk/log4net.Core.LoggingEvent.Fix.html) on LoggingEvent object;  **it is a Flags enumeration specifying which field should be fixed**. It turns out that if you avoid fixing UserName and Location property (the two most expensive properties), you gain a real boost in performances. If you are not interested in these two, but you care for speed, this can be a solution.

Here is how my BufferedMongoDBAppender initializes itself.

{{< highlight csharp "linenos=table,linenostart=1" >}}


public override void ActivateOptions()
{
    try
    {
        if (Settings.LooseFix) 
        {
            //default Fix value is ALL, we need to avoid fixing some values that are
            //too heavy. We skip FixFlags.UserName and FixFlags.LocationInfo
            Fix = FixFlags.Domain | FixFlags.Exception | FixFlags.Identity |
                FixFlags.Mdc | FixFlags.Message | FixFlags.Ndc |
                FixFlags.Properties | FixFlags.ThreadName;
        }

{{< / highlight >}}

 **I’ve added a simple settings called LooseFix to specify to base class that I do not want to fix nor UserName nor LocationInfo**. This simple trick give a boost on performance to the appender, at the cost of renouncing to a couple of property in logging.  The name LooseFix is given because an obsolete method called [FixVolatileData](http://logging.apache.org/log4net/release/sdk/log4net.Core.LoggingEvent.FixVolatileData_overload_2.html) on LoggingEvent has a boolean parameter called fastButLoose, to avoid fixing properties that are slow to fix.

Here is what the documentation says about this parameter

> The *fastButLoose* param controls the data that is fixed. Some of the data that can be fixed takes a long time to generate, therefore if you do not require those settings to be fixed they can be ignored by setting the*fastButLoose* param to `true`.  **This setting will ignore the** [**LocationInformation**](http://logging.apache.org/log4net/release/sdk/log4net.Core.LoggingEvent.LocationInformation.html) **and** [**UserName**](http://logging.apache.org/log4net/release/sdk/log4net.Core.LoggingEvent.UserName.html) **settings.** This piece of documentation confirms me that the two most expensive variable to fix are UserName and LocationInformation.

## Conclusion

I’ve added also another little improvement to maximize performances:  **saving data on a dedicated thread to avoid blocking the caller when the buffer is full**. When BufferingAppenderSkeleton buffer is full it calls a virtual function synchronously with logger call; this means that the call that trigger buffer flushing needs to wait for all buffer objects to be saved into mongo.  **Using a different thread can avoid slowing down the caller, but you need to be really careful because you can waste lots of memory with LoggingEvents object waiting to be saved on Mongo**.

At the end, here the result of 10k logging with some simple timing.

{{< highlight bash "linenos=table,linenostart=1" >}}


With MongoAppender - Before flush 2152 ms
With MongoAppender - Iteration took 2158 ms
With MongoAppender Loose Fix - Before flush 337 ms
With MongoAppender Loose Fix - Iteration took 343 ms
With MongoAppender save on different thread - Before flush 1901 ms
With MongoAppender save on different thread - Iteration took 2001 ms
With MongoAppender Loose fix and save on different thread - Before flush 37 ms
With MongoAppender Loose fix and  save on different thread - Iteration took 379 ms

{{< / highlight >}}

The test is really simple: I log 10k times and takes timing, then call flush to wait for all the logs to be flushed and takes another timing. The first two lines shows me that standard buffered mongo appender is quite slow, it takes 2 seconds to handle all the logs. With LooseFix to true, we are renouncing to UserName and LocationInfo property, but the boost in performance is impressive, again we have no difference before and after the flush.

*The third copule of lines shows that saving on a different thread does not save great time if you fix all the properties, but last two lines shows that saving in different thread with LooseFix to true only needs 37 ms to logs (the appender is storing in memory all the logs to be saved on different thread), but you need a little bit more time when it is time to flush.*

To avoid hammering memory if you are logging an enormous quantity of logs, probably it is a good idea setting a limit on how many events to store in memory before triggering an internal flush and wait for the saving thread to reduce the buffer. Actually if I have more than 10k LoggingObjects in memory I block the caller until dedicated thread saved at least an entire buffer;

Gian Maria.
