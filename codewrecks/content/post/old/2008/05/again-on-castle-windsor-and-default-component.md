---
title: "Again on castle windsor and default component"
description: ""
date: 2008-05-27T10:00:37+02:00
draft: false
tags: [Castle]
categories: [Castle]
---
In the [last post](http://www.codewrecks.com/blog/index.php/2008/05/27/castle-windsor-and-default-component/) I gave a solution to make possible to specify the default component in a dependency resolution with castle windsor. That solution is good for automatic dependency resolution, with respect to the previous post if you have a IPageDownloader that has a property of type ICache, if you do not set that property in castle configuration, at resolution time the Cache property of the PageDownloader will be the one marked with default=”true” if any.

All that stuff works, but if you ask directly for an ICache component with

{{< highlight xml "linenos=table,linenostart=1" >}}
IoC.Resolve<ICache>()
{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

You still get the first component defined in the configuration file. Sometimes you want that all resolution will honor the new default attribute, to accomplish this you have to change the facility.

{{< highlight xml "linenos=table,linenostart=1" >}}
public class DefaultComponent : AbstractFacility
{
    protected override void Init()
    {
        Kernel.ComponentRegistered += OnComponentRegistered;
        Kernel.AddSubSystem(SubSystemConstants.NamingKey, new NamingSubsystemForDefault(defaults));
    }

    private Dictionary<Type, IHandler> defaults = new Dictionary<Type, IHandler>();
    private void OnComponentRegistered(string key, IHandler handler)
    {
        if (handler.ComponentModel.Configuration != null && handler.ComponentModel.Configuration.Attributes["default"] == "true")
        {
            defaults.Add(handler.ComponentModel.Service, handler);
        }
    }
}{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

The facility is quite the same as before, first of all the dictionary use type as key and IHandler as value, this permits me to store the default handler for each service that has one of the component marked with default=”true”, then I add a *SubSystem*to the Kernel. SubSystems can be of different types, so you have a *SubSystemConstants* that you can use to specify witch subsystem you want to add. In this example I add a NamingKey, a subsystem that is used by the kernel to get the right IHandler based on user request. Here is the SubSystem

{{< highlight xml "linenos=table,linenostart=1" >}}
 1 internal class NamingSubsystemForDefault : DefaultNamingSubSystem
 2 {
 3     private Dictionary<Type, IHandler> defaults = new Dictionary<Type, IHandler>();
 4 
 5     public NamingSubsystemForDefault(Dictionary<Type, IHandler> defaults)
 6     {
 7         this.defaults = defaults;
 8     }
 9 
10     public override IHandler GetHandler(Type service)
11     {
12         if (defaults.ContainsKey(service))
13             return defaults[service];
14 
15         return base.GetHandler(service);
16     }
17 }{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

A Naming SubSystem can really be a big stuff to build, but I need only to make a little customization, so I use the DefaultNamingSubSystem as base class, so the default behaviour is the standard of the Kernel. The only function I need to override is the *GetHandler(Type)* that is called when the user ask to resolve a type without specifying any id, this means that this function gets called when the user want the *default component* for that service. The only thing you need to do is to check if you have a default for that service, and if one is found simply return the handler to the caller. VoilÃ !! the game is done.

Alk.

Tags: [Castle Windsor](http://technorati.com/tag/Castle%20Windsor) [IoC](http://technorati.com/tag/IoC)

<!--dotnetkickit-->
