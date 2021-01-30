---
title: "Making Castle and MEF happy togheter"
description: ""
date: 2012-08-13T19:00:37+02:00
draft: false
tags: [Castle,MEF]
categories: [Castle]
---
If you use Mef to dynamically load handlers for your services (as described in [this post](http://www.codewrecks.com/blog/index.php/2012/04/23/evolving-request-response-service-to-separate-contract-and-business-logic/)), you will probably need to declare dependencies to various other software service. Since MEF is not born to handle dependencies, you will probably use other libraries for DI, Es. Castle.Windsor. Now the problem is “how can I make MEF and my IoC container living together happily with minimum effort?”. To keep everything simple you will need to understand typical scenario, you want to solve, a first problem you need to solve is “ **Mef imported classes should be able to declare dependencies on services defined in my primary IoC container engine§.** The simplest solution you can use is using MEF attributes to declare dependencies from other service with the ImportAttribute.

{{< highlight csharp "linenos=table,linenostart=1" >}}


[Import]
public IXXXService PostProcessingService { get; set; }

{{< / highlight >}}

This will instruct MEF that  **this service needs an instance of IXXXService to work properly** , but I want to resolve it with my IoC system and not with MEF. To solve this problem you can use a cool feature of Mef and export IXXXService from a property of a simple helper class.

{{< highlight csharp "linenos=table,linenostart=1" >}}


public class CastleToMefBridge
{
    [Export(typeof(IXXXService))]
    public IXXXService XXXService
    {
        get
        {
            return IoC.Resolve<IXXXService>();
        }
    }

{{< / highlight >}}

{{< highlight chsarp "linenos=table,linenostart=1" >}}
public class CastleToMefBridge
{
    [Export(typeof(IXXXService))]
    public IXXXService XXXService
    {
        get
        {
            return IoC.Resolve();
        }
    }{{< / highlight >}}

This code will not export a complete class, but  **it marks the XXXService property as an Export of IXXXService, now whenever MEF will find an ImportAttribute for the IXXXService type it will call this property that internally simple use my primary IoC to resolve dependency**.

When you use this technique you need to pay a lot of attention to the lifecycle of the dependencies, because if they are transient [you will need to call Release in Castle container to avoid keeping a reference to it forever](http://www.codewrecks.com/blog/index.php/2007/08/08/the-importance-of-windsorcontainerrelease/). Usually this problem is mitigated by the fact that*all types exported by MEF are by default singleton, so even if they declare an Import of a type that has a transient lifetime with castle, you will never need a call to release because Mef Imported component will live for the entire duration of the application*.

Gian Maria.
