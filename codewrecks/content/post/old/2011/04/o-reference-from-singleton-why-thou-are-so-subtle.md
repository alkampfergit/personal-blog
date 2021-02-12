---
title: "WeakReference to delegate are you sure it is a good idea"
description: ""
date: 2011-04-15T19:00:37+02:00
draft: false
tags: [MVVM]
categories: [NET framework]
---
When an object references another object, he prevent garbage collector to reclaim referenced objects, this fact is known by every developer and we need to pay specific attention when dealing with singleton objects.

One of the most common risk is having a Singleton reference other objects and thus keeping them alive until the application consumes all available memory; I have a [primitive](http://www.codewrecks.com/blog/index.php/2010/07/26/primitive-broker-class/) IBroker interface implemented by a ConcreteBroker class that have a singleton lifecycle; since all ViewModels register themselves into the broker to receive messages, we can end with all ViewModels not being released from memory because referenced from the Broker singleton instance.

![](http://ricchezza-fotovoltaico.jujol.com/wp-content/uploads/2008/03/broker.jpg)

Each VM correctly deregister all registered handler from the broker, but I wish to be able to improve the design, avoding the broker to keep hard reference to called object using a WeakReference. The broker have a couple of way to register message, the first one accepts a token and a Action&lt;Message&lt;T&gt;&gt; delegate and the token is used to deregister all messages associated with the token. With this interface I can pass the instance of the ViewModel as token, and since the ViewModelBase implements the IDisposable interface, I deregister all messages related to *this*, thus avoiding hard reference problem.

This is quite good, but I want to prevent the broker from keeping hard references to objects, so I created a test class to verify that the broker prevents objects from being disposed.

{{< highlight csharp "linenos=table,linenostart=1" >}}
private static Int32 _finalizeCount = 0;
 
public class Finalizable
{
~Finalizable()
{
Interlocked.Increment(ref _finalizeCount);
}
 
public Finalizable(Broker broker)
{
broker.RegisterForMessage<String>(ExecuteMessage);
}
 
private void ExecuteMessage(object obj)
{
//do nothing.
}
}
{{< / highlight >}}

This class accepts a reference to a broker in the constructor, and simply increment a shared variable when it got finalized. Now we can write a test.

{{< highlight csharp "linenos=table,linenostart=1" >}}
[Test]
public void Verify_broker_does_not_prevent_object_to_be_disposed()
{
Int32 initialValue = _finalizeCount;
Broker sut = new Broker();
new Finalizable(sut);
GC.Collect();
Thread.Sleep(100);
GC.Collect();
Thread.Sleep(100);
GC.Collect();
_finalizeCount.Should().Be.EqualTo(initialValue + 1);
}
{{< / highlight >}}

Such a test is not probably a perfect UnitTest, because it is not deterministic (it is based on assumpion on GarbageCollection); it simply creates a Finalizable instance passing the broker as a reference, then forces garbage collection, and finally checks if the instance of the Finalizable class was finalized. Clearly this test fails.

In such a scenario a possible solution is the [WeakReference](http://msdn.microsoft.com/en-us/library/hbh8w2zd%28v=VS.71%29.aspx) class, available since version 1.1 of the framework. This is needed because the Broker stores delegate to member function of object and thus it is preventing objects from being disposed. Now I changed the broker to use WeakReference, since the broker stores a Registration object for each registered message, I simply changed the registration object in this way.

{{< highlight csharp "linenos=table,linenostart=1" >}}
public class Registration
{
private Object token;
private WeakReference action;
private Boolean _executeInUiThread;
public Registration(object token, object action, Boolean executeInUiThread)
{
this.token = token;
this.action = new WeakReference(action);
_executeInUiThread = executeInUiThread;
}
 
public WeakReference Action
{
get { return action; }
}
 
public object Token
{
get { return token; }
}
 
public Boolean ExecuteInUiThread
{
get { return _executeInUiThread; }
}
}
{{< / highlight >}}

Now the above test passes, because the Broker does not store hard references to the object, but is this really a good solution? Probably not, and we will see in another post why this solution is wrong.

Alk.
