---
title: "Masstransit latest version even simpler than ever"
description: ""
date: 2012-09-11T19:00:37+02:00
draft: false
tags: [masstransit]
categories: [Frameworks]
---
In a recent post about Masstransit I’ve explained how to [setup communication using a Subscription Service](http://www.codewrecks.com/blog/index.php/2012/08/03/quick-start-on-mass-transit-and-msmq-on-windows/), and this configuration needs a dispatcher that can be build directly from MassTransit source code. If you do not want to have a central dispatcher, because you need to install a windows service (or run program in console) and a sql server used by the dispatcher you can also avoid this using Multicast.

The key is the  **call to sbc.UseMulticastSubscriptionClient() that basically permits you to completely avoid the complexity of having/maintaining a dispatcher with MSMQ. This works using** [**PGM on top of MSMQ**](http://msdn.microsoft.com/en-us/library/windows/desktop/ms740125%28v=vs.85%29.aspx), so if you want to create a simple program that listen for a specific message on the bus you can use a minimal configuration, here is all the code you need

{{< highlight csharp "linenos=table,linenostart=1" >}}


sbc.UseMsmq();
sbc.UseMulticastSubscriptionClient();
sbc.ReceiveFrom("msmq://localhost/test_basicCommunication");
sbc.Subscribe(subs =>
{
    subs.Handler<Message>(msg => Console.WriteLine(msg.MessageText));
});

{{< / highlight >}}

If you only want to publish messages on the bus the code is simpler, because you can completely avoid the Subscribe part, suppose you want to create a simple program that sends message, here is the whole code you need.

{{< highlight csharp "linenos=table,linenostart=1" >}}


Bus.Initialize(sbc =>
{
    sbc.UseMsmq();
    sbc.UseMulticastSubscriptionClient();
    sbc.ReceiveFrom("msmq://localhost/test_basicCommunication2");
});

........

Bus.Instance.Publish(new Message() { MessageText = message });

{{< / highlight >}}

Now you can fire both the program and when you call Publish on instance of the bus you are actually dispatching the message to everyone that registered to that specific message. This is really freaking simple to do and really shows the powerful API of Masstransit library.

Alk.
