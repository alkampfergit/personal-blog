---
title: "Maintain integrity in NHibernate bidirectional association"
description: ""
date: 2009-05-05T05:00:37+02:00
draft: false
tags: [Nhibernate,Software Architecture]
categories: [Nhibernate,Software Architecture]
---
Using Bidirectional Associations in nhibernate can be tricky, the problem is that you need to manage associations for both ends. This is really important: suppose you have a class called Parent with a collection of childs called Childs, and a child class with a property called Parent; if you expose these two property to the user, you can write this

{{< highlight csharp "linenos=table,linenostart=1" >}}
Parent John = new Parent();
Parent Mark = new Parent();
Child Bart = new Child();

John.Childs.Add(Bart);
Bart.Parent = Mark;{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

With such a code Bartâ€™s parent is Mark, but Bart is in John Child collection, this is WRONG. To avoid this problem you should maintain integrity in the domain model, managing the consistency of the relationship. Suppose you have the same situation with two objects, a StockKeepingUnit and a StockContainer, here it is the code for StockKeepingUnit

{{< highlight csharp "linenos=table,linenostart=1" >}}
 public virtual StockContainer Parent
 {
    get { return parent;}
    set
    {
       if (parent != null)
          parent._Content.Remove(this);

       parent = value;

       if (value != null)
          value._Content.Add(this);
    }
 }

 private StockContainer parent;{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

As you can see in the setter part I first check if this object has a parent, if yes we need to remove it from the \_Content collection of the parent object (because actually Iâ€™m detatching from it); then if the value is different from null it means that we have a new parent, so the object assign itself to the \_Content collection of the new father to mantain integrity. Surely you now need to map this property in directly on the field to avoid problem

{{< highlight xml "linenos=table,linenostart=1" >}}
<many-to-one name="parent" access="field" class="StockKeepingUnit"... />{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

It is of fundamental importance that you map to the field, this because when nhibernate rebuild the object from database, you must avoiding calling the Set part of the Parent property, because the coherence of the objects are guaranteed by nhibernate itself. Now here is how I implemented the Collection part on the SockContainer class

{{< highlight xml "linenos=table,linenostart=1" >}}
 public virtual IEnumerable <StockKeepingUnit> Content
 {
    get { return _Content;}
 }

 internal virtual ISet<StockKeepingUnit> _Content
 {
    get
    {
       return content ?? (content = new HashedSet <StockKeepingUnit>());
    }
    set
    {
        content = value;
    }
 }
 private ISet<StockKeepingUnit> content;{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

First of all the ISet class is a private field, and the accessor property, called \_Content, is internal because it must be accessed by the StockKeepingUnit code seen before, but must not be accessed from external code. The property is implemented with lazy creation, if the content property is null, I simply create an HashedSet, this is useful when you first create the object, because initially this property is null. When nhibernate rebuild the object from database data, the content private field is set by nhibernate, so I can avoid unnecessary creation of HashedSet. With this kind of structure you can map nhibernate to the \_Content property and not to the field.

Now a question arise: How can the user of this class access the Collection of StockKeepingUnit if the \_Content property is private? The answer is in the property Content that is of type *IEnumerable&lt;StockKeepingUnit&gt;.* With Ienumerable I permit the user to use fully LINQ syntax to access collection of StockKeepingUnit, this is enough for most scenarios because with LINQ you can iterate, filter, select and doing whatever you want to access all StockKeepingUnit contained in a stockContainer.

Alk

Tags: [NHibernate](http://technorati.com/tag/NHibernate) [Domain Model](http://technorati.com/tag/Domain%20Model)
