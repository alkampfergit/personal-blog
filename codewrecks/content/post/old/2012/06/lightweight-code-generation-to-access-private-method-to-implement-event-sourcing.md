---
title: "Lightweight code generation to access private method to implement Event Sourcing"
description: ""
date: 2012-06-04T15:00:37+02:00
draft: false
tags: [DDD]
categories: [Domain Driven Design]
---
I like really much to play with [Expression Tree or Dynamic Code Generation](http://www.codewrecks.com/blog/index.php/2008/10/09/again-on-expression-tree-vs-reflection/), a couple of techniques useful to do fast reflection, to maintain all the coolness of reflection (Es. invoking non public members) but without incurring in the penalties of calling methods through pure reflection calls. There are really good libraries around the web, like [FastReflect](http://fasterflect.codeplex.com/) that internally uses the power of LCG to invoke private methods, but the main question is:  **why you should be use such a dirty technique** ?? After all *if a method is Non Public the declaring type probably has lots of reason for having it declared this way and it is not a good practice to break this rule*. So lets see a scenario where such functionality can be useful.

If you download and have a look at [Greg Young](http://codebetter.com/gregyoung/)’s [example on CQRS called m-r](https://github.com/gregoryyoung/m-r) you can find that the AggregateRoot base class actually exposes an ApplyChange method defined in this way.

{{< highlight csharp "linenos=table,linenostart=1" >}}


private void ApplyChange(Event @event, bool isNew)
{
    this.AsDynamic().Apply(@event);
    if(isNew) _changes.Add(@event);
}

{{< / highlight >}}

Basically the AsDynamic() is an extension [taken from this article](http://blogs.msdn.com/b/davidebb/archive/2010/01/18/use-c-4-0-dynamic-to-drastically-simplify-your-private-reflection-code.aspx) that shows how to create a simple library to call private method with dynamic syntax and is used by the AggregateRoot class to call the right Apply method defined by child class that will change the status [accordingly to the EVENT SOURCING](http://codebetter.com/gregyoung/2010/02/20/why-use-event-sourcing/) pattern.  **Event Sourcing is a pattern where change of the status of a domain entity is driven by a DOMAIN EVENT and whenever an entity raise a DOMAIN EVENT the eventual change of internal status happens only in a method that is able to elaborate the event that was raised**.

Here is an example, in an hypothetical Character class of a role playing game, we have these methods defined inside the Character class.

{{< highlight csharp "linenos=table,linenostart=1" >}}


protected void Apply(CharacteristicAugmented domainEvent)
{
  ...
}

protected void Apply(CharacteristicAugmentBlocked domainEvent)
{
  ...
}

{{< / highlight >}}

When I call a method of Character class and some Domain Rules were violated, one of his characteristic will be blocked and cannot be augmented anymore, so  **the object raises a CharacteristicAugmentBlocked event through a specific method of the AggregateRoot base class** , that in turns should call the right Apply method that finally will change the status of the object. The key aspect is that the internal change of status is made in the correct Apply method, this means that in the future, if we want to reconstruct the status of an entity, we can simply ask them to reapply all the domain events he raised in the past.

 **Those two methods are non public because they should not be called from external code, but only from the base class AggregateRoot**. The situation is the following, the AggregateRoot class has this method.

{{< highlight csharp "linenos=table,linenostart=1" >}}


internal void ApplyHistory(IEnumerable<DomainEvent> listOfEvents)
{
    foreach (var domainEvent in listOfEvents)
    {
        applyInvokers.Invoke(this, domainEvent);
    }
}

{{< / highlight >}}

Each class should have the ability to reconstruct the internal status from the list of events he raised in the past, but since this code is implemented in the base AggregateRoot class, he cannot be aware of the real method to call for each derived class, so you need to use reflection and Convention Over Configuration: *each method that is capable of handling should be named  **Apply** and he should return void and accepts a single parameter that inherits from  **DomainEvent** *. With these rules in mind I can build the ApplyInvokers class (this version is not thread safe, it serves only demo purpose).

{{< highlight csharp "linenos=table,linenostart=1" >}}


internal class LcgApplyInvoker : IApplyInvoker
{
    /// <summary>
    /// Cache of appliers, for each domain object I have a dictionary of actions
    /// </summary>
    private Dictionary<Type, Dictionary<Type, Action<Object, Object>>> lcgCache = 
        new Dictionary<Type, Dictionary<Type, Action<Object, Object>>>();

    private class ObjectApplier
    {

        private Dictionary<Type, RuntimeMethodHandle> appliers =
            new Dictionary<Type, RuntimeMethodHandle>();
    }

    public void Invoke(Object obj, DomainEvent domainEvent)
    {
        if (!lcgCache.ContainsKey(obj.GetType()))
        {
            var typeCache = new Dictionary<Type, Action<Object, Object>>(); 

            var applyMethods = obj.GetType().GetMethods(
                BindingFlags.NonPublic |
                BindingFlags.Instance);

            foreach (var item in applyMethods
               .Where(am => am.Name.Equals("apply", StringComparison.OrdinalIgnoreCase))
               .Select(am => new { parameters = am.GetParameters(), minfo = am })
               .Where(p => p.parameters.Length == 1 &&
                    typeof(DomainEvent).IsAssignableFrom(p.parameters[0].ParameterType)))
            {
                var localItem = item;
                Action<Object, Object> applier = ReflectionExtension.ReflectAction(obj.GetType(), item.minfo);
                typeCache[localItem.parameters[0].ParameterType] = applier;
            }
            lcgCache[obj.GetType()] = typeCache;
        }
        var thisTypeCache = lcgCache[obj.GetType()];
        Action<Object, Object> invoker;
        if (thisTypeCache.TryGetValue(domainEvent.GetType(), out invoker)) {
            invoker(obj, domainEvent);
        }
    }
}

{{< / highlight >}}

This class is composed of a primary dictionary where, for each type (domain object type), it stores another dictionary that in turn, for each type of concrete DomainEvent (domain event type), contains an Action&lt;Object, Object&gt; to invoke dynamically the relative apply method of the right type of domain object that is capable to handle that domain object. The only strange part of this class is the ReflectionExtension class, that is used to create a DynamicMethod to access the right apply code given a MethodInfo. Basically  **for each type of domain object I search with reflection all Apply methods that satisfy the convention and create a fast invoker to call it in the future**.

{{< highlight csharp "linenos=table,linenostart=1" >}}


public static Action<Object, Object> ReflectAction(Type objType, MethodInfo methodinfo)
{

    DynamicMethod retmethod = new DynamicMethod(
        "Invoker" + methodinfo.Name,
        (Type) null,
        new Type[] { typeof(Object), typeof(Object) },
        objType,
        true); //methodinfo.GetParameters().Single().ParameterType
    ILGenerator ilgen = retmethod.GetILGenerator();
    ilgen.Emit(OpCodes.Ldarg_0);
    ilgen.Emit(OpCodes.Castclass, objType);
    ilgen.Emit(OpCodes.Ldarg_1);
    ilgen.Emit(OpCodes.Callvirt, methodinfo);
    ilgen.Emit(OpCodes.Ret);
    return (Action<Object, Object>)retmethod.CreateDelegate(typeof(Action<Object, Object>));
}

{{< / highlight >}}

This method uses LCG, it just creates a DynamicMethod that is capable of invoking the method identified by the MethodInfo passed as argument. The key is in the declaration of the DynamicMethod, because I passed true as the last parameter to tell CLR to skip the check visibility because the method I want to call can be non public, and the game is done.

Gian Maria.
