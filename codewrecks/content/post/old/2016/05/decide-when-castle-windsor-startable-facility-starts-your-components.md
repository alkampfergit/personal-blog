---
title: "Decide when CastleWindsor Startable Facility starts your components"
description: ""
date: 2016-05-15T16:00:37+02:00
draft: false
tags: [Castle,IoC]
categories: [Programming]
---
[Castle.Windsor Startable facility](https://github.com/castleproject/Windsor/blob/master/docs/startable-facility.md) is a nice facility that automatically starts component that implements a specific interface (IStartable) or components registered with specific extensions method (ex StartUsingMethod).

This approach is really nice, and the Facility has different way to work, the old aggressive mode that  **try to start a component immediately after is registered, and another, more useful, that starts a component only when all its dependencies are registered.** This feature is helpful, because it avoid you to worry about order of registration.

Basically the problem is: if component A implements IStartable and depends from service B and *service B is registered after A, Houston we have a problem*.  In that scenario the Startable facility try to Instantiate A to call Start(), but A cannot be resolved because it still misses B dependency. To avoid this problem Startable facility support a deferred start, where A is instantiated (and started) only after all dependencies (in this scenario B) are correctly registered.

But this is not enough in some scenario. I have a problem because I not only need that the component is started after all dependencies are registered, but **I want also to be sure that the component is started after I’ve started Rebus IBus interface**.

> Generally speaking there are a lot of legitimate situations where you want to control WHEN the Startable Facility actually instantiate Startable Components.

A standard solution is not using the facility at all, when you want to start IStartable components,  **you can simple scan all registered components in Castle to find those ones that implements IStartable, create and intsantiate it**.

This approach is wrong, because it has a couple of problem: the first one is that it does not work for components registered with StartUsingMethod fluent interface, the second problem is that the startable facility also takes care of calling stop during decommition phase.

To overcome this problem you can write a modified version of Startable Facility, with a simple method that has to be manually called to start everything. Here is a possible implementation

{{< highlight csharp "linenos=table,linenostart=1" >}}


public class MyStartableFacility
    : AbstractFacility
{private ITypeConverter converter;
    protected override void Init()
    {
        converter = Kernel.GetConversionManager();
        Kernel.ComponentModelBuilder.AddContributor(new StartableContributor(converter));
    }

    public void StartAllIStartable()
    {
        IHandler[] handlers = Kernel.GetAssignableHandlers(typeof(object));
        foreach (var handler in handlers)
        {
            if (typeof(IStartable).IsAssignableFrom(handler.ComponentModel.Implementation) ||
                IsStartable(handler))
            {
                handler.Resolve(CreationContext.CreateEmpty());
            }
        }
    }

    public static bool IsStartable(IHandler handler)
    {
        var startable = handler.ComponentModel.ExtendedProperties["startable"];
        var isStartable = (bool?)startable;
        return isStartable.GetValueOrDefault();
    }
}

{{< / highlight >}}

Most of this code is actually taken from the original implementation of the facility. It actually add the StartableContributor to the kernel as for the original IStartable interface, but it does not start anything automatically. To start everything you need to call StartAllIStartable method, that simply scans all registered component, and if it is startable it just resolve the object.

 **Actually all the dirty work is done by basic accessories classes of IStartable (StartableContributor) and you only need to resolve IStartable object to have everything works as expected.** To understand if a component is IStartable you can simply check for Extended property “startable” that is inserted by the StartableControbutor.

Gian Maria.
