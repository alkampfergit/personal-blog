---
title: "Quick start on Mass Transit and MSMQ on windows"
description: ""
date: 2012-08-03T16:00:37+02:00
draft: false
tags: [masstransit]
categories: [Frameworks]
---
[**MassTransit**](http://masstransit-project.com/) **is a bus implementation for.NET that promise frictionless configuration and simple usage**. The main problem about MassTransit in my opinion is the lack of organic documentation, especially a quick start guide that shows you really the basic concepts behind MassTransit. If you jump into online documentation there is a nice page called “[Show Me the code](http://docs.masstransit-project.com/en/latest/configuration/quickstart.html)” that promise a quick start to jump into MassTransit concepts. The problem with that example is that  **it shows a single snippet of code that opens a bus based on Windows MSMQ and send a message to itself**.

In my opinion  **this is a too simplistic “Hello MassTransit” example** , because it does not show a typical sender/receiver configuration. If you try to write another simple console application to send message to the first one you build following the “Show me the code” instruction you will need this code.

{{< highlight csharp "linenos=table,linenostart=1" >}}


Bus.Initialize(sbc =>
{
    sbc.UseMsmq();
    sbc.VerifyMsmqConfiguration();
    sbc.UseMulticastSubscriptionClient();
    sbc.ReceiveFrom("msmq://localhost/test_queue_client");
    sbc.ConfigureService<RoutingConfigurator>(
        BusServiceLayer.Session,
        rc => rc.Route<YourMessage>().To("msmq://localhost/simple_first_server")
        );
});
Bus.Instance.Probe();
Bus.Instance.WriteIntrospectionToConsole();
String read;
while (!String.IsNullOrEmpty(read = Console.ReadLine())) 
{
    Bus.Instance.Publish(new YourMessage { Text = read });
}

{{< / highlight >}}

The code is really similar to the code of the other application,  **it just change the ReceiveFrom address and add the sbs.ConfigureService to rout the YourMessage to the queue used by the server**. A things worth notice in this example: the ConfigureService method is obsolete and deprecated and the reason is that this is not the typical scenario MassTransit want to solve. *The problem with this code is that is modeling a classic SOA model, where  **a client sends messages to a well known service** *and such a situation is so simple that you probably do not need a bus to handle it. The real feature that MassTransit offers you is the ability to just send and manage Messages from your applications, leaving all the gory details to the bus infrastructure.

*To create a more interesting example add this line to the configuration of the first application, that one that subscribed to the YourMessage message*.

{{< highlight csharp "linenos=table,linenostart=1" >}}


sbc.UseSubscriptionService("msmq://localhost/mt_subscriptions");

{{< / highlight >}}

{{< highlight csharp "linenos=table,linenostart=1" >}}
sbc.UseSubscriptionService("msmq://localhost/mt_subscriptions");{{< / highlight >}}

 **This lines tells MassTransit to handle subscription of messages through the queue called mt\_subscriptions**. Now modify the other application console substituting the call to sbc.ConfigureService with the same above line. This will remove the need to specify the address of the receiver. Now the application can simply publish messages to the bus with the Bus.Instance.Publish call and let MassTransit take care of everything, especially routing messages to the application that subscribed to that specific message.

Now the main question is: *what is the mechanism that route the message from the sender application to the listening application*? The answer is: MassTransit and this is one of the cool reason to use a bus instead of directly using MSMQ or using WCF.  **When the first application subscribe to the YourMessage message, this subscription is sent to the subscription service in the queue mt\_subscriptions and when the other application publish the message, the subscription service is used to understand where the message should be routed**. The routing service will check the incoming message that is a message of type YourMessage, then verify if there is anyone that is registered to listen to that message, if a match is found it routes the message to the right application. The problem is that if you run the above two programs you will get a nasty exception.

> Failed to create the bus service: SubscriptionRouterService
> 
> Timeout waiting for subscription service to respond

 **The reason is that you need to run a third program, called MassTransit.RuntimeServices.exe that actually manages all the routing stuff**. If you got MassTransit reference through NuGet you surely miss the runtimeservice components. The simpliest thing is *downloading MassTransit source from GitHub, follow the instruction in the readme to build with build.bat and finally you will end with all you need in the folder MassTransit\build\_output\Services\RuntimeServices*

The MassTransit.RuntimeServices.exe application needs a database to store data and since it uses nhibernate you can use almost any database you want, just edit the MassTransit.RuntimeService.exe.config file and configure nhibernate to access your preferred database. In my example I used SqlExpress,  **just create a database called MassTransitRuntimeServices and create the schema running the script file located in \src\MassTransit.RuntimeServices\SetupSQLServer.sql.** Once the database and the configuration file MassTransit.RuntimeService.Exe.config are modified correctly, you can run the service that basically is a simple console application that do the routing. Remember that you need to run it as administrator because it need some administrative permission to setup stuff (like creating queue).

When the subscription service is running well you can run both your applications and everything should work.

[You can found code here](http://sdrv.ms/N8hMtP).

Gian Maria.
