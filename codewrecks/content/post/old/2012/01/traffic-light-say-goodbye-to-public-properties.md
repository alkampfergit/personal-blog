---
title: "Traffic light say goodbye to public properties"
description: ""
date: 2012-01-30T10:00:37+02:00
draft: false
tags: [DDD]
categories: [Domain Driven Design]
---
I’ve more to say about the Traffic Light example I explained in a [previous post](http://www.codewrecks.com/blog/index.php/2011/11/07/traffic-light-experiment/), if you look at that post, you can notice that the Domain is composed by properties that have only getter and not setters. This needs is explained [in this post](http://www.codewrecks.com/blog/index.php/2011/10/20/protect-the-status-of-your-entities/), where I explain why you should protect the status of your entities from external direct manipulation.

If I wish to use my simple Traffic-Light example in a class to teach OOP principle, it is not good enough, because it breaks the concept of *[Encapsulation](http://en.wikipedia.org/wiki/Encapsulation_%28object-oriented_programming%29)*. As stated in Wikipedia

> encapsulation means that the internal representation of an [object](http://en.wikipedia.org/wiki/Object_%28computer_science%29) is generally  **hidden from view outside of the object’s definition**. Typically, only the object’s own methods can directly  **inspect** or manipulate its fields

Having no setters prevent status from external modification, but the getters permits to the outside world to view inside the object. If you think that getters are not an antipattern and that you can always use them in your domain classes without problem, probably you are still thinking in procedural code, or at least not fully Object Oriented.

> If you permit to the outside world to read one property of an object, you risk that the outside world will use that value to implement logic that should be contained in the object, so you are breaking encapsulation.

Whenever you ask yourself “I need to search in code all part of the software that access this property because I’m going to modify it”, you are implicitly looking for *logic that is actually using that property but it is outside the object*. The result is that you have piece of Business Logic that

- Read properties of several objects
- implement logic based on these properties.

Then all these objects are bounded together by that external logic and you loose encapsulation and you are not fully OOP. Based on this considerations I took my traffic light sample and decide to try to remove all getters and thanks to DOMAIN EVENTS it was really simple, more than I tought. Here is my new domain.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2012/01/image_thumb13.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2012/01/image13.png)

Even if this is a trivial domain, I appreciate a lot that I ended having a couple of DOMAIN EVENTS composed only by readonly properties (events are in the past and are immutable) and a couple of Domain Classes that contains only methods. Removing all properties actually does not required me to modify any test, and actually I found that each time I found some code that use a getter, that code looked really better after the access to the getter is removed.

If you really can structure your core domain with object that contains only methods, you have a really modular domain where each class is really an autonomous piece of software that does some business in the domain without the need of a direct relation with other entities except communicating with Domain Events.

I know that this is a super simple trivial example (a couple of traffic light is not even close to a real business case), but the result of this stupid and little experiment convinced me that it is the right road.

Gian Maria.
