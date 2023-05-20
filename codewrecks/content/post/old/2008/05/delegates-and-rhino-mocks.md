---
title: "Delegates and Rhino Mocks"
description: ""
date: 2008-05-20T09:00:37+02:00
draft: false
tags: []
categories: [General]
---
I love delegates, with c# 2.0 anonymous delegates and with C# 3.0 lambda, working with delegates is simply wonderful. Anonymous delegates makes possible to create [closure](http://en.wikipedia.org/wiki/Closure_%28computer_science%29), and I like to use delegate in a lot of places. When you have to test objects that accepts external delegates Rhino Mock is simply exceptional, here is a test I write this afternoon

{{< highlight xml "linenos=table,linenostart=1" >}}
MultiRange sut1 = CreateMultiRange(50, "pippo", 100, "pluto");
MultiRange sut2 = CreateMultiRange(60, "ted");
MultiRange.AnalyzeMatchInterval functor = repo.CreateMock<MultiRange.AnalyzeMatchInterval>();
Expect.Call(functor(50, 60, "pippo", "ted")).Return(true);
repo.ReplayAll();
MultiRange.MultipleIntersect(20, functor, sut1, sut2);{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

It is a simple test for a simple class that makes some form of intersection between ranges, it accepts a function that gets called whenever a range match, the function pass the min value, the max value, and the object tag associated with the match. The important thing is that with a simple line of code, I can set up an expectation and tells Rhino Mocks to verify that the function is called with a particular series of parameters.

This is a typical example of [Test Double](http://xunitpatterns.com/Test%20Double.html)  with use of [Mock](http://xunitpatterns.com/Mock%20Object.html), and Rhino Mocks makes all possible with minimum effort;

Alk.

Tags: [Rhino Mocks](http://technorati.com/tag/Rhino%20Mocks)
