---
title: "Convention over configuration Domain Event and Commanding"
description: ""
date: 2012-07-25T14:00:37+02:00
draft: false
tags: [DDD]
categories: [Domain Driven Design]
---
If you are [moving to a more DDD](http://www.codewrecks.com/blog/index.php/2012/07/06/poor-man-ddd/) oriented architecture probably you will adopt a solution that uses  **Commands** and  **Handlers**. Commands are the  **requests sent to BOUNDED CONTEXT from users or from external systems** , they are processed by Command Executors and usually execution is a matter of loading some AGGREGATE ROOT from the store and invoking Methods on it.

Even if you are not using EVENT SOURCING, (Es. you have your AGGREGATE ROOTS persisted on a SQL Database with NHibernate),  **you should leverage the concept of DOMAIN EVENTS letting each AGGREGATE ROOT to raise one or more DOMAIN EVENTS during execution of its methods**. This means that we need to build an infrastructure capable of identifying for each command the *single command handler capable of executing that command* and for each different type of DOMAIN EVENT *the list of Domain Event handlers that are interested in being notified about that event*.

When you move from a legacy system to a more DDD oriented pattern you usually proceed one step at a time and probably the simplest solution to implement commanding part of this system is using a [Request/Response architecture](http://www.codewrecks.com/blog/index.php/2012/04/23/evolving-request-response-service-to-separate-contract-and-business-logic/). This architecture basically solves the problem of binding each command to the command executor letting MEF to handle all the greedy details of scanning assemblies to find Command Executors (you can read all the details on [previous posts](http://www.codewrecks.com/blog/index.php/2012/04/23/evolving-request-response-service-to-separate-contract-and-business-logic/)). When you have such structure in place it seems normal to use the very same structure to manage in-process dispatching of DOMAIN EVENTS.

{{< highlight csharp "linenos=table,linenostart=1" >}}


static DomainEventDispatcher()
{
    var handlers = LoaderHelper.CreateMany<DomainEventHandler>();
    foreach (var handler in handlers)
    {
        Type handledType = handler.CommandHandledType();

        if (!ExecutorsForTypes.ContainsKey(handledType))
        {
            ExecutorsForTypes.Add(handledType, new List<DomainEventHandler>());
        }
        IList<DomainEventHandler> commandExecutorList = ExecutorsForTypes[handledType];
        commandExecutorList.Add(handler);
    }
}

{{< / highlight >}}

The concept is the very same used for command executor in Request/Response pattern, in static constructor I ask MEF to create all classes that Inherits from DomainEventHandler base class. Domain Event Dispatcher can use this static dictionary of handlers to dispatch the message to the right handler.

{{< highlight csharp "linenos=table,linenostart=1" >}}


if (ExecutorsForTypes.ContainsKey(realEvent.GetType()))
{
    var handlerList = ExecutorsForTypes[realEvent.GetType()];
    foreach (var handler in handlerList)
    {
        handler.Handle(realEvent);
    }
}

{{< / highlight >}}

The DomainEventHandler class is really simple, and is used primarily to automatically imports with MEF all the types that inherits from it, here its full definition.

{{< highlight csharp "linenos=table,linenostart=1" >}}


[InheritedExport]
public abstract class DomainEventHandler
{
    protected ILogger Logger { get; set; }

    public DomainEventHandler()
    {
        Logger = RepManagement.BaseServices.Castle.CastleUtils.CreateLogger(GetType());
    }

    public void Handle(BaseDomainEvent domainEvent)
    {
        try
        {
            OnHandle(domainEvent);
        }
        catch (Exception ex)
        {
            Logger.Error("Error in handler " + GetType().FullName, ex);
            throw;
        }
    }

    protected abstract void OnHandle(BaseDomainEvent request);

{{< / highlight >}}

Actually I have another couple of intermediate classes the first one is called  **SyncDomainEventHandler and is used when you want your domain event to be handled in the very same thread of the code that is raising the event** * **and if an handler raises an exception the whole command execution is aborted and a database transaction is rolled back** *.

I’m hearing you scream “WHAT? Database transaction???”, I know that in DDD architecture usually handlers of DOMAIN EVENTS are completely unrelated to the execution of commands, but actually *I’m using this structure in a legacy project based on well known assumptions carved in stone* and one of this assumption is that there should be the possibility to execute a series of operations in the domain transitionally.

{{< highlight csharp "linenos=table,linenostart=1" >}}


public abstract class SyncDomainEventHandler<T> : DomainEventHandler where T : BaseDomainEvent
{
    protected override void OnHandle(BaseDomainEvent domainEvent)
    {
        HandleRequest((T)domainEvent);
    }

    protected abstract void HandleRequest(T domainEvent);

    public override Type CommandHandledType()
    {
        return typeof(T);
    }
}

{{< / highlight >}}

Clearly there is another base class called  **AsyncDomainEventHandler where the OnHandle instead of directly call the HandleRequest abstract function uses a Task to call it asynchronously**. Whenever you write a Domain Event handler you have to choose if your handler is part of the command transaction (inherits from SyncDomainEventHandler) or if it should execute on a thread on its own without affecting command transaction. the vast majority of handlers are Async but very few needs to take part in command execution context. What is happening is that when certain DOMAIN EVENTS are raised, some handler should perform operations that, if failed, should abort the whole command.

In a real DDD architecture, especially if you are using EVENT SOURCING, everything is asynchronous, and if an handler fail its only option is to do a compensative action, but he has not the right to rollback anything.

This structure works, but in the long run it shows some limitation, most annoying one is that we can implement a single DOMAIN EVENT handling method per class, because the class should inherits from a base class and since.NET does not support multiple inheritance, each domain handler class can handle a single DOMAIN EVENT.

In a simple playground project based on CQRS (you can find it here: [https://github.com/andreabalducci/Prxm.Cqrs](https://github.com/andreabalducci/Prxm.Cqrs "https://github.com/andreabalducci/Prxm.Cqrs") ) we are moving toward a structure based on convention over configuration. In that project the convention is that a domain event handler is a class that implements the interface *IDomainEventHandler* and defines public method that returns void and accepts a single parameter that inherits from base DomainEvent class.

{{< highlight csharp "linenos=table,linenostart=1" >}}


public class NewInventoryItemCreatedEventHandler : IDomainEventHandler
{
    protected ILogger _logger;

    public NewInventoryItemCreatedEventHandler(ILogger logger)
    {
        _logger = logger;
    }

    public void ReactToInventoryItemCreated(InventoryItemCreated @event)
    {
        _logger.Debug(string.Format("[inventory] item {0} has been created and handled", @event.Sku));
    }
}

{{< / highlight >}}

This is much more interesting way to bind handlers to DOMAIN EVENTS. The IDomainEventHandler class has no method and is only a marker class, you can use an attribute if you prefer or you can completely remove this requirements and consider a domain event handler each class that defines public method that returns void and accepts a single argument that inherits from DomainEvent, but usually having a marker class or an attributes explicitly declared in the class prevents from bad surprise. The primary advantages is that you can define how many handler methods you need in the same class, so your handlers are better grouped together. As an example all denormalizers that manages Query Model in CQRS architecture usually needs to handle several related DOMAIN EVENT to maintain a single Query Model, with this infrastructure you can define a single class that manages a QueryModel and that handles all the DOMAIN EVENTS he needs.

In subsequent post I’ll show how simple is to create a class that manages loading and discovering of Handlers based on this convention.

Gian Maria.
