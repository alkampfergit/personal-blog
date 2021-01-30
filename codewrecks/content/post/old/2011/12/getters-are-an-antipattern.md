---
title: "Getters are an antipattern"
description: ""
date: 2011-12-16T19:00:37+02:00
draft: false
tags: [Software Architecture]
categories: [Software Architecture]
---
When you realize that [property setters is an antipattern](http://www.codewrecks.com/blog/index.php/2011/10/20/protect-the-status-of-your-entities/), because you want to protect the status of your entity from direct external manipulation, the next step is starting to believe that even Getters can be considered an Antipattern.

This is some sort of extreme object oriented thinking, because getters does not modify the status of an object, so there is nothing evil in them… or not? If you look for the definition of Encapsulation from Wikipedia you can find this:

*encapsulation means that the internal representation of an*[*object*](http://en.wikipedia.org/wiki/Object_%28computer_science%29)*is generally  **hidden from view outside of the object’s definition**. Typically, only the object’s own methods can directly  **inspect or manipulate** its fields.*

If you read it carefully you can find that a well encapsulated object completely hides his status from the external world. One of the most interesting reason why you should avoid external world to read your internal status with getter is avoiding other object to do logic that belong to you. Whenever an object expose, even in read-only, part of its internal status, there is the risk that some other object uses that status to implement some logic and this is bad for many reasons.

First of all this is a symptom that logic is probably not in the right place. If you need to know the internal status of another object to implement something, probably that logic should be in other object.

Another drawback is that objects become to be too much entangled, when you modify the status of an object, if it is completely hidden to the outside world, you need only to take care on the logic inside the object; on the contrary, if the status is exposed with getters, you need to search all the usage of the status before modification.

This does not mean that you should use no getters whatsoever, but*you surely need to think twice when you want to expose some part of the status*, even if in read-only.

Gian Maria.
