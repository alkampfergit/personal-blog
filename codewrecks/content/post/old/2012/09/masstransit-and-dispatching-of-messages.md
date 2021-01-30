---
title: "Masstransit and dispatching of messages"
description: ""
date: 2012-09-03T18:00:37+02:00
draft: false
tags: [masstransit]
categories: [Frameworks]
---
One of the coolest aspect of Masstransit is  **simplicity of use (even if it still lacks a really comprehensive documentation** ), dispatching of message is one of this aspect. The key of Masstransit is that dispatching is done on type of the message instead that address, *we can simply ignore everything in the middle, we have just components that declares to Masstransit that they are able to handle a certain type of messages, other components will simply publish messages in the bus and dispatching is done thanks to the CLR type of message sent*.

As an example I’ve created a little [supersimple demo](http://sdrv.ms/TCPQiG) with three console program (ProgramA B and C) each one is completely identical to the other, except that he registers for a different type of message (respectively, MessageA N or C) and each one listen on a different queue.

{{< highlight csharp "linenos=table,linenostart=1" >}}


sbc.Subscribe(subs =>
{
    subs.Handler<MessageA>(msg => Console.WriteLine(msg.ToString()));
});

{{< / highlight >}}

The above snippet is taken from ProgramA that register itself for Message of type MessageA. Each program has a main loop that accepts input string from the user, and each string should begin with the char a b or c to decide what type of message we want to send. You do not need anything else, everything is ready to run (remember that [in MSMQ on windows you need to run the MassTransitRuntimeService](http://www.codewrecks.com/blog/index.php/2012/08/03/quick-start-on-mass-transit-and-msmq-on-windows/) that takes care of dispatching. If you fire all three programs everything works.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2012/08/image_thumb9.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2012/08/image9.png)

 ***Figure 1***: *MassTransit in action*

Each program can send message to each other but the key point is that **you are not interested *Where* to send a message but *What***message to send. This technique is basically a publish/subscribe structure that you obtain with few lines of code. Just as an example you can now fire all three message console and send a couple of message to ProgramB from the other programs to verify that everything works.

*Now takes the executable of ProgramB present in the bin\debug folder and move in another folder, then edit the Programb.exe.config file, and change the MSMQ address used by the program*.

{{< highlight xml "linenos=table,linenostart=1" >}}


  <appSettings>
    <add key="localqueue" value="msmq://localhost/Programb2"/>
  </appSettings>

{{< / highlight >}}

This operation is needed because you cannot start two programs that listen in the same MSMQ; if you do this, message will not be dispatched anymore because multiple listener on the same MSMQ is not permitted. In the above snippet I simply configure a copied version of ProgramB to use a Programb2 queue, then I start ProgramB from the other folder and when I send MessageB messages from other programs they will get dispatched to both instance of ProgramB, as visible in Figure2.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2012/08/image_thumb10.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2012/08/image10.png)

 ***Figure 2***: *The first console is ProgramC that send two MessageB messages, the second one is sent when the other instance of ProgramB is run, and it gets dispatched to both the instances.*

This structure is especially useful in CQRS and DDD architectures, where a BOUNDED CONTEXT usually publish some of its DOMAIN EVENTS to the outside world, but it is not interested in *where to send the message* or if *there is some other BOUNDED CONTEXT interested in message*, so he can simply call Bus.Publish(DomainMessage) and  **let MassTransit care to understand if there is a listener out of there to route the message to**.

SourceCode: [Download from SkyDrive](http://sdrv.ms/TCPQiG)

 **RelatedArticles** :

- [Quickstart on MassTransit and MSMQ on Windows](http://www.codewrecks.com/blog/index.php/2012/08/03/quick-start-on-mass-transit-and-msmq-on-windows/)

Alk
