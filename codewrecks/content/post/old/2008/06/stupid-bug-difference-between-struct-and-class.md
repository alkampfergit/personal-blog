---
title: "Story of a stupid bug difference between struct and class"
description: ""
date: 2008-06-24T07:00:37+02:00
draft: false
tags: [Languages]
categories: [Languages]
---
I’ve incurred in a very stupid bug this afternoon, I run test on a new version of a component and I see that a lot of exceptions are raised about violating unique constraint of a simple strongly typed dataset I use to log information in database.

After a brief look at the code I found that I create new guid with the instruction *new Guid(),*I was really surprised because I really know that new guid should be created with Guid.NewGuid(). This is indeed caused by the fact that Guid() is a structure and not a class. The following test demonstrate this fact

{{< highlight csharp "linenos=table,linenostart=1" >}}
[Test]
public void CreateGuid()
{
    Assert.That(new Guid(), Is.EqualTo(Guid.Empty));
    Assert.That(Guid.NewGuid(), Is.Not.EqualTo(Guid.Empty));
}{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

This test will succeeds because Guid is a value type, and he always has a default constructor that can be called to create empty instance of the structure. If you look into the documentation of Guid you can in fact verify that default constructor is not even listed between the valid ones.

This is one of the most annoying difference from reference and value type: value type always have a default constructor and you cannot prevent the user to use it.

alk.

Tags: [.net value type](http://technorati.com/tag/.net%20value%20type)

<!--dotnetkickit-->
