---
title: "Plan for change"
description: ""
date: 2009-06-15T07:00:37+02:00
draft: false
tags: [Software Architecture]
categories: [Software Architecture]
---
Here is a possible dialog between Customer/PM/Analyst and a programmer

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2009/06/image-thumb7.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2009/06/image7.png)

Developers usually end with one or more of those thought

1. Analyst is a moron, he did a bad job not finding the real requirement of the customer
2. Customer are stupid because they does not know what they want, they are constantly changing requirements.
3. We lack requirement gathering phase, now we must loose time following desires of Analyst/Customer

Finally the programmer complains a lot about too much code to change, and how is painful working in an environment where noone is able to catch the real requirement of the customer.

Situation is much more different if you understand that the needs of the customer quite often change with time, we are in a fast world where moving slowly quite often leads to death, so it is absolutely normal that requirements changes with time. The only solution is *Plan in advance for change*, if you are ready for changes, you will having really less problem when some requirement changes over time.

Technically speaking, to have a software that can react quickly to change the key concept is *loose coupling*, through heavy use of Inversion of Control, you can minimize dependencies between the various part of the software. The more the software is loosely copuled, the more you can modify a part without affecting other parts.

Then you need a lot of tests, that can spot immediately when a change in some part of the software has introduced some bug. Then You need to setup a Continuous Integration machine, and make your tests run at each check-in, this assures you that tests are run frequently and automatically. Then you must setup a real good logging infrastructure, to trace immediately what is going wrong with the system. Finally you should work in asynchronous mode when possible, minimizing the coupling between different tiers in the software.

But probably the most difficult step is *changing the way we manage software developement.*We must change the way we approach the software, not fearing changes and reacting differently to change in requirements.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2009/06/image-thumb8.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2009/06/image8.png)

alk.

Tags: [Software Architecture](http://technorati.com/tag/Software%20Architecture)
