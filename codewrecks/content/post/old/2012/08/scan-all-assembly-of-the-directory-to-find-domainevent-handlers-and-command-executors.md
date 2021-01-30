---
title: "Scan all assembly of the directory to find DomainEvent Handlers and command executors"
description: ""
date: 2012-08-04T08:00:37+02:00
draft: false
tags: [CQRS,DDD]
categories: [Domain Driven Design]
---
Structures based on [Commands, Events and respective handle](http://www.codewrecks.com/blog/index.php/2012/07/25/convention-over-configuration-domain-event-and-commanding/)r are really flexible and to maximize this flexibility  **adopting a convention over configuration is the key of success**. If you look at this simple [playground project](https://github.com/andreabalducci/Prxm.Cqrs) you can find that *we adopted a convention where a domain handler is any object that implements the IDomainHandler marker interface and any public Method that returns void and accepts a single parameter that inherits from the base class DomainEvent is a method handler*. The code to discover handlers is really simple and primitive, but serves the purpose of showing the basic concepts.

{{< highlight csharp "linenos=table,linenostart=1" >}}


var asmName = AssemblyName.GetAssemblyName(fileName);

Assembly dynamicAsm = Assembly.Load(asmName);
Type[] allAssemblyTypes = null;
 try
  {
       allAssemblyTypes = dynamicAsm.GetTypes();
 }
catch (ReflectionTypeLoadException rtl)

{{< / highlight >}}

Basically  **I scan all file that ends with dll present in the directory** and I try to load it as normal.NET assembly, an outer try catch, catches the BadImageFormatException that is raised if a non.NET dll is present in the directory,  **the goal is to enumerate all the.NET types of every assembly present in the folder**. Next step is finding all handlers.

{{< highlight csharp "linenos=table,linenostart=1" >}}


var handlers = allAssemblyTypes
                   .Where(t => t.IsClass && !t.IsAbstract && typeof(IDomainEventHandler).IsAssignableFrom(t))
                   .ToList();
foreach (var eventHandlerType in handlers)
{

    ParameterInfo[] parameters = null;
    foreach (var minfo in eventHandlerType
       .GetMethods(BindingFlags.Instance | BindingFlags.Public)
       .Where(mi => mi.ReturnType == typeof(void) &&
                        (parameters = mi.GetParameters()).Length == 1 &&
                        typeof(IDomainEvent).IsAssignableFrom(parameters[0].ParameterType)))
    {
        var eventType = parameters[0].ParameterType;

        //I've found a method returning void accepting a Domain Event it is an handler
        MethodInvoker fastReflectInvoker = minfo.DelegateForCallMethod();
        cachedHandlers.Add(new DomainEventHandlerInfo(fastReflectInvoker, eventHandlerType, eventType, _kernel, minfo.Name));
    }
}

{{< / highlight >}}

Code is really simple, first of all  **I filter only for types that are non abstract and implements the IDomainEventHandler marker interface, then I scan all methods, to look for method that matched the convention**. Thanks to the [fasterflect](http://fasterflect.codeplex.com/) library I create a MethodInvoker that is capable of invoking the method through Lightweight Code Generation, to avoid incurring in performance penalties due to reflection invocation.

This convention is really good because it permits me to write a QueryModel denormalizer with good names for methods.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2012/08/image_thumb.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2012/08/image.png)

Instead of having three classes each one with an Handle method for each of the domain event I’m interested into, or having a single class with Three method called Handle() and inherits three times the IDomainEventHandler&lt;&gt; interface (one for each type),  **I can name handlers method giving them business meaning, like CreateInventoryItem, UpdateQuantityOnPicking and UpdateQuantityOnReceived** , and  **a single class is capable of declaring how many handlers he need to do its work.** This simple convention makes code really clean without losing the basic structure of run-time binding of DOMAIN EVENT and relative handlers.

Gian Maria.
