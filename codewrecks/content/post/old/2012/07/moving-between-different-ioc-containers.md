---
title: "Moving between different IoC containers"
description: ""
date: 2012-07-26T20:00:37+02:00
draft: false
tags: [Castle]
categories: [Castle]
---
I must admit that I always prefer castle Windsor over other IoC containers, but the main reason is that I’m really used to it and all its facilities. I know how to write facilities, and I know how it behave, this makes difficult for me moving to other Container because I usually need time to find how to do same stuff I do with castle with the new Toy.

Actually I’m using Unity sometimes and today I **need to mimic the** [**IStartable**](http://docs.castleproject.org/Default.aspx?Page=Startable-Facility&amp;NS=Windsor&amp;AspxAutoDetectCookieSupport=1) **facility of Castle** , because I need Start method to be called whenever the object gets registered, and stop called when the container is disposed. The very first tentative is this code.

{{< highlight csharp "linenos=table,linenostart=1" >}}


public class StartableBuilderStrategy : BuilderStrategy
{
    public override void PostBuildUp(IBuilderContext context)
    {
        base.PostBuildUp(context);
        if (context.Existing is IStartable)
        {
            ((IStartable)context.Existing).Start();
        }
    }

    public override void PreTearDown(IBuilderContext context)
    {
        if (context.Existing is IStartable)
        {
            ((IStartable)context.Existing).Stop();
        }
        base.PreTearDown(context);
    }
}

{{< / highlight >}}

This code seems to me legitimate to write, but I encounter a problem,  **when I dispose the container the PreTearDown method is not called**. This happens because the  **PreTearDown method is called only when someone explicitly calls TearDown on the Unity container actually asking the container to teardown the object**. Actually I do not like very much how unity track lifetime of object and I suggest you reading [this post](http://www.ladislavmrnka.com/2011/03/unity-build-in-lifetime-managers/) for a good introduction on the subject, but in my situation I only need these two feature for singleton object (ContainerControlledLifetimeManager).

1. *When the object get constructed I want its start method called*

2. *When the container gets disposed I want the method stop called.*
3. *Create the object (and call start) when the object is registered in the container*

With unity you can solve these two point with really few lines of code, first of all if you want a method to be called when the object gets constructed you can both call the method in the constructor (if any) or you can use a specific attribute

{{< highlight csharp "linenos=table,linenostart=1" >}}


[InjectionMethod]
public void Start()
{

{{< / highlight >}}

The InjectionMethod attribute gets called after the object is constructed without the need of any other configuration, for the point 2 simply implement IDisposable and call Stop in the Dispose Method. This is still not the very same behavior of Castle [Startable facility](http://docs.castleproject.org/Windsor.Startable-Facility.ashx), because it starts the object immediately upon its registration. The purpose of Startable Facility is the ability to being able to start objects during registration and not when they are first used to resolve a dependency. In unity you can mimic this adding this extension

{{< highlight csharp "linenos=table,linenostart=1" >}}


public class StartableExtension : UnityContainerExtension
{
    protected override void Initialize()
    {
        Context.Registering += Context_Registering;
    }

    void  Context_Registering(object sender, RegisterEventArgs e)
    {
        if (typeof(IStartable).IsAssignableFrom(e.TypeTo))
        {
            Container.Resolve(e.TypeFrom);
        }
    }
}

public interface IStartable
{

}

{{< / highlight >}}

As you can see the IStartable interface does not define any method, because actually Start() and Stop() should be called with the InjectionMethodAttribute and IDisposable, but it is needed only to automatically create an instance of the type during registration.

Gian Maria.
