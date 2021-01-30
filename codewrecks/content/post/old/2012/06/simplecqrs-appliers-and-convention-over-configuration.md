---
title: "SimpleCQRS appliers and convention over configuration"
description: ""
date: 2012-06-25T14:00:37+02:00
draft: false
tags: [CQRS,DDD]
categories: [Domain Driven Design]
---
I was playing around with [**SimpleCQRS**](https://github.com/andreabalducci/SimpleCQRS)  **project** because my friend [Andrea](http://www.ienumerable.it/) started to work on it recently.  **We now have Mongo repository for the events** so I forked the project to have a look on it and contribute to Andrea works. I’ve opened the solution, ran the program, created some InventoryItems, then I look into mongo database to verify if snapshot of objects are correctly taken but I found this.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2012/06/image_thumb5.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2012/06/image5.png)

 ***Figure 1***: *Snapshot of objects inside mongo*

All snapshot are null, so I started investigating to understand the root cause and the reason is in this code

{{< highlight csharp "linenos=table,linenostart=1" >}}


public InventoryItem(string id, string description)
{
    Apply(new InventoryItemCreatedEvent(id, description)
                {
                    AggregateRootId = Guid.NewGuid()
                });
}
protected void OnItemCreated(InventoryItemCreatedEvent e)
{
    this.Id = e.AggregateRootId;
    this.ItemId = e.ItemId;
    this.Description = e.Description;
}

{{< / highlight >}}

Can you spot the problem? The fact is that such kind of problem is difficult to spot out because of the convention that were choose to apply EVENT SOURCING. First of all remember that  **in an architecture based on event sourcing the change of status of objects are done reacting to a DOMAIN EVENT** , thus when you call the constructor of InventoryItem it calls the method Apply() on the AggregateRoot passing the DOMAIN EVENT that contains all the information about the creation of the object,  **then the AggregateRoot in turn should call the method OnItemCreated that actually do the real change of status**. This tricky code is necessary because it should be possible to reconstruct the object from the stream of events he generated in the pase, so you need to**decouple the method that contains the business logic (the constructor in this example) from the method that perform the change of status, lets call it the *applier method****.*With such a structure if you want to reconstruct the state of the object you can simply reload all events from the event store and reapply to the object calling OnXXXX methods.

Now the original problem can be spotted if you look at the Apply() method of the AggregateRoot() that in turn calls ApplyEventToInternalState.

{{< highlight csharp "linenos=table,linenostart=1" >}}


private void ApplyEventToInternalState(DomainEvent domainEvent)
{
    var domainEventType = domainEvent.GetType();
    var domainEventTypeName = domainEventType.Name;
    var aggregateRootType = GetType();

    var eventHandlerMethodName = GetEventHandlerMethodName(domainEventTypeName);
    var methodInfo = aggregateRootType.GetMethod(eventHandlerMethodName,
                                                    BindingFlags.Instance | BindingFlags.Public |
                                                    BindingFlags.NonPublic, null, new[] {domainEventType}, null);

    if(methodInfo != null && EventHandlerMethodInfoHasCorrectParameter(methodInfo, domainEventType))
    {
        methodInfo.Invoke(this, new[] {domainEvent});
    }

    ApplyEventToEntities(domainEvent);
}

{{< / highlight >}}

As you can see *the base class use reflection to find a method in the class that have a specific method name that is determined by the GetEventHandlerMethodName() method*

{{< highlight csharp "linenos=table,linenostart=1" >}}


private static string GetEventHandlerMethodName(string domainEventTypeName)
{
    var eventIndex = domainEventTypeName.LastIndexOf("Event");
    return "On" + domainEventTypeName.Remove(eventIndex, 5);
}

{{< / highlight >}}

This means that if the event is called *InventoryItemCreatedEvent* the corresponding *applier method*must be called *OnInventoryItemCreated*, and if you misspell the name, the method is simply not called and the object does not change status. **Now look again to the original piece of code of InventoryItem domain object, and you will find that the *applier method* is mistakenly called OnItemCreated, this means that it gets never called **, and the object never change state. What happened in this situation is that you will end with an InventoryItem that has null ItemId and null description and this is the reason why all data in the snapshot is null.

I really do not like this convention; what happens if I call my domain event something like OrderShippedEventMaster? I can agree that this name is not so good for a domain event, but if you look at the GetEventHandlerMethodName you fill find that probably you will have to do some string math to understand how the applier method should be called.** In my personal opinion this violates the principle of least surprise, and can lead to annoying bug difficult to spot when you are developing **. So I decided to do a really little modification

{{< highlight csharp "linenos=table,linenostart=1" >}}


public InventoryItem(string id, string description)
{
    RaiseEvent(new InventoryItemCreatedEvent(id, description)
                {
                    AggregateRootId = Guid.NewGuid()
                });
}

protected void Apply(InventoryItemCreatedEvent e)
{
    this.Id = e.AggregateRootId;
    this.ItemId = e.ItemId;
    this.Description = e.Description;
}

{{< / highlight >}}

I’ve modified the method of AggregateRoot from Apply to** *RaiseEvent***that sounds more correct to me, and I’ve changed the convention of the *applier method*, simply stating that **an applier method should be called *Apply* and it must accept a single parameter that represent the related DOMAIN EVENT that this method will apply to the internal state**. This convention is more natural in my mind, because the binding from the *applier method* to the DOMAIN EVENT is naturally expressed by the parameter of the method, and you do not need to do any strange string manipulation to understand how the event should be called. I’ve also added [Lightweight Code Generation](http://www.codewrecks.com/blog/index.php/2012/06/04/lightweight-code-generation-to-access-private-method-to-implement-event-sourcing/) to make invocation of *applier method*faster, because calling GetMethod for each applier is not the best idea in production code.

Now I fired the UI again, created an InventoryItem and now I can see correct result in the Snapshot collection in Mongo database.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2012/06/image_thumb6.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2012/06/image6.png)

 ***Figure 2***: *Now that I fixed the applier method the new object I created is now correctly saved in the snapshot because it correctly change the state reacting to the InventoryItemCreatedEvent DOMAIN EVENT*

Convention over configuration is really a good strategy for your software, but conventions should be chosen with great care, because complex conventions can lead to *tricky to find bugs*.

Gian Maria.
