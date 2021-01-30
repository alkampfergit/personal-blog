---
title: "Is my Domain Model really anemic"
description: ""
date: 2012-01-23T10:00:37+02:00
draft: false
tags: [DDD]
categories: [Domain Driven Design]
---
I’m reading the exceptional [Object Thinking](http://www.amazon.com/Object-Thinking-DV-Microsoft-Professional-David/dp/0735619654) book, full of interesting considerations about thinking with an Object Oriented mind. One of the main concept of the book is that *quite often we are using objects in a procedural way so we are still in the realm of procedural programming even using inheritance, constructor, etc etc*. As an example we can have a domain where each object is only a container for data (properties) and a bunch of other classes (services) are using that domain objects to accomplish business rules.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2012/01/image_thumb11.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2012/01/image11.png)

Is this OOP? Probably not, because we have a domain with all the  **data** and service layer with all the  **logic** , and this is what we are used to call [procedural programming](http://en.wikipedia.org/wiki/Procedural_programming).

This is the typical situation of an [Anemic Domain Model](http://en.wikipedia.org/wiki/Anemic_Domain_Model), a domain that does not contains business logic but almost only data; the more the business logic is away from the domain, the more your domain is: *anemic, less OOP and more procedural-like*. Now suppose you start to move your Business Logic (methods) from services to domain’s objects. Surely this will make your domain less anemic if you accept the previous definition of “Anemic Domain” and if you move every method from services to domain objects you really have a Domain model? The answer is *maybe*, but it is still far from sounding like DDD to me.

In my opinion the mere distinction on *Where the methods are defined* is only part of the problem;  if the business logic is *simply moved from Services to Domain Objects*, but the logic remains the same had I created a really different architecture? What happened if you stretch the definition of the domain and*include all service classes in whatever you are calling Domain?* With this new definition I moved from an Anemic Domain to a Domain Model without changing a single line of code, just considering Services Classes part of the domain.

What is different in OOP is that you should create groups of objects that solve a problem (the business logic) with *collaboration and messages exchanging.*The simple act of moving the Logic from service to Domain Objects without changing how that logic works, sometimes creates a network of objects so complicated that you gain no benefit.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2012/01/image_thumb12.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2012/01/image12.png)

When you started with an architecture of Service + Data Classes and you simply start moving the very same logic from services to Data Classes, the risk is having the situation depicted in the above picture and when you need to change one of the object is a pain because the modification forces you to change all the objects that actually are using that object, etc etc.

Time passed and I started to believe that a *the term anemic is related on how much state an object exposes to other objects.*If we use the term  **anemic** to identify  **how much our domain is procedural instead of Object oriented** , a possible definition  **IMHO** can be:

 **A domain model is completely anemic when all the objects expose their status through getters and setters; the opposite situation, a domain model with no anemia, is when domain objects are fully encapsulated (no getter, no setter).** It sounds really harsh definition, but after all this is the basic concept of encapsulation

[WIKIPEDIA](http://en.wikipedia.org/wiki/Encapsulation_%28object-oriented_programming%29): … encapsulation means that the internal representation of an [object](http://en.wikipedia.org/wiki/Object_%28computer_science%29) is generally hidden from view outside of the object’s definition. Typically, **only the object’s own methods can directly *inspect* or *manipulate***its fields.

After all Domain Driven Design is heavily based on: “Bounded Context” and “Domain Events”, because this reduces the coupling between objects, reduce the need for getter (and make setters useless) and lead to a less anemic Domain Model.

Gian Maria.
