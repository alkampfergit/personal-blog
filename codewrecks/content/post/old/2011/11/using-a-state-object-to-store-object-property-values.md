---
title: "Using a state object to store object property values"
description: ""
date: 2011-11-29T18:00:37+02:00
draft: false
tags: [Architecture]
categories: [Software Architecture]
---
In an [old post](http://www.codewrecks.com/blog/index.php/2011/06/13/leverage-the-concept-of-state-of-your-entities/) I dealt with a possible implementation of a BaseEntity class that stores all properties in a State object (based on a dictionary to store properties). Technically speaking, this solution have no drawbacks respect using field variables to store properties values, but it can give a lot of benefit. If you see the object from the outside, it presents a bunch of properties and thanks to encapsulation you can use the technique you prefer to store the real data inside the object. This approach has some drawbacks, first of all accessing the value of a property can be slower, because you need to find the value inside a dictionary instead of reading directly from a memory location (the field value). Another drawback is that I use the property names as dictionary keys, so you waste more memory to store the keys of the state dictionary, but you can limit this problem using [string interning](http://en.wikipedia.org/wiki/String_interning).

This model has indeed some advantages respect using field variables, first of all you can easily find the value of every property from the String representation without the need of reflection. One of the first advantage is the ability to [Deep Clone](http://en.wikipedia.org/wiki/Deep_copy#Deep_copy) an object with a simple routine.

{{< highlight csharp "linenos=table,linenostart=1" >}}
public virtual T Clone<T>() where T : BaseEntity
{
return (T) Clone();
}
 
public virtual BaseEntity Clone()
{
BaseEntity newEntity = (BaseEntity)
Activator.CreateInstance(GetType(), true);
newEntity._state = State.Clone();
return newEntity;
}
{{< / highlight >}}

As you can verify from the code I simply create another instance of the entity, then simply assign a clone of the original status to the new entity.

{{< highlight csharp "linenos=table,linenostart=1" >}}
public State Clone()
{
State clone = new State();
foreach (var o in _state)
{
if (o.Value is BaseEntity)
{
//we need to deep clone this entity.
BaseEntity be = o.Value as BaseEntity;
clone._state.Add(o.Key, be.Clone());
}
else if (o.Value is IEnumerable<BaseEntity>)
{
//need to deep clone a collection
IEnumerable<BaseEntity> be = o.Value as IEnumerable<BaseEntity>;
IList copiedbe = Activator.CreateInstance(be.GetType()) as IList;
foreach (var entity in be)
{
copiedbe.Add(entity.Clone());
}
clone._state.Add(o.Key, copiedbe);
}
else
{
clone._state.Add(o.Key, o.Value);
}
 
}
return clone;
}
{{< / highlight >}}

Clone method is quite simple and it is not tested in all scenario (I’ve tested for basic classes) but it works quite well and solves easily the needs to deep clone an object. I’m not sure that in strong OOP oriented software Deep Cloning is a needed thing, but when you work with ORM and User Type (more in future posts), it is quite useful.

Gian Maria
