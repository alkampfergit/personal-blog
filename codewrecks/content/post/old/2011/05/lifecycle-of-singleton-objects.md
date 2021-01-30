---
title: "Lifecycle of singleton objects"
description: ""
date: 2011-05-06T08:00:37+02:00
draft: false
tags: [Architecture,Castle,IoC]
categories: [Software Architecture]
---
Some days ago I blogged about an implementation of persistent cache component based on Managed Esent and [PersistentDictionary](http://managedesent.codeplex.com/wikipage?title=PersistentDictionaryDocumentation). This component is injected into other components thanks to Inversion of Control and it is a *[Singleton](http://en.wikipedia.org/wiki/Singleton_pattern)* object.

![](http://zenit.senecac.on.ca/wiki/imgs/Singleton_UML.png)

Being a singleton is a requisite because it permits to different dependent objects to share the same cache, moreover *PersistentDictionary* does not permit to have multiple instances that insists on the same directory. This will make EsentCache a perfect candidate of Singleton Object Pattern. Now another dilemma arise, *since PersistentDictionary implements IDisposable to flush all resources into disk, who will call Dispose on a Singleton object?*

The solution is obvious, this is a duty of the Inversion Of Control engine you use and this is another reason to base your architecture with Dependency Injection in mind. With a IoC container, being a singleton is a â€œpropertyâ€ of registered instance making the IoC container responsible of the lifecycle of the *singleton. I*n my application there is a static  **IoC** class (a [service locator pattern](http://en.wikipedia.org/wiki/Service_locator_pattern)) used by infrastructural code to create objects, based on Castle.Windsor container. Since a WindsorContainer is a Disposable object I want to be sure that it got disposed when the application exit.

{{< highlight csharp "linenos=table,linenostart=1" >}}
static IoC()
{
AppDomain.CurrentDomain.ProcessExit += new EventHandler(CurrentDomain_ProcessExit);
BaseInitialization();
}
{{< / highlight >}}

Static constructor will set an handler for [ProcessExit](http://msdn.microsoft.com/en-us/library/k8xz23w3%28v=VS.90%29.aspx) event of current domain. This event have a special purpose, as you can read in MSDN documentation

> The [EventHandler](http://msdn.microsoft.com/en-us/library/system.eventhandler%28v=VS.90%29.aspx) for this event can perform termination activities, such as closing files, releasing storage and so on, before the process ends.

The only drawback is that the execution time of this method is limited as explained in the documentation

>  **Note:** > 
> The total execution time of all ProcessExit event handlers is limited, just as the total execution time of all finalizers is limited at process shutdown. The default is two seconds. An unmanaged host can change this execution time by calling the [ICLRPolicyManager::SetTimeout](http://msdn.microsoft.com/en-us/library/ms164398%28v=VS.90%29.aspx) method with the [OPR\_ProcessExit](http://msdn.microsoft.com/en-us/library/ms231056%28v=VS.90%29.aspx) enumeration value.

This could be a problem, because shutting down the IoC engine will call dispose method for each singleton object that was resolved and we cannot anticipate how time this operation will need, but we have no other option to have a fallback technique to avoid people forgetting to call dispose on the IoC container.

The implementation of the event handler is really simple

{{< highlight csharp "linenos=table,linenostart=1" >}}
static void CurrentDomain_ProcessExit(object sender, EventArgs e)
{
Shutdown();
}
{{< / highlight >}}

All work is delegated to the Shutdown() event, this will make possible for programs to dispose the IoC engine gracefully. For windows program you can simple put a call to Shutdown before the end of Main() method, this will pose no limit on Shutdown execution time, but if for some reason, people forgets to call Shutdown explicitly when the application is ending, resources will be released thanks to the ProcessExit event handler.

alk.
