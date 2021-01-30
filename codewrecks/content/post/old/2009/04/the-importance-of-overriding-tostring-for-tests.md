---
title: "The importance of overriding ToString for tests"
description: ""
date: 2009-04-24T06:00:37+02:00
draft: false
tags: [NET framework,Testing]
categories: [NET framework,Testing]
---
Standard behavior of ToString is to print class or structure name. Sometimes if you never need to call tostring for class in application you will avoid to override this basic behavior. Suppose you have this simple structure.

{{< highlight CSharp "linenos=table,linenostart=1" >}}
public struct Range
{
    public Int32 Left;
    public Int32 Rigth;{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

This is a simple structure with two field, now I have this test.

{{< highlight csharp "linenos=table,linenostart=1" >}}
MultiRange res = wcbe.FindHit("thi*", baseText);
Assert.That(res.HitPositions.First().HitRange, Is.EqualTo(new MultiRange.Range(0, 5)));{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

And when the test fails the output is

{{< highlight csharp "linenos=table,linenostart=1" >}}
 Expected: RepManagement.Analyzer.Concrete.Auxiliary.MultiRange+Range
  But was:  RepManagement.Analyzer.Concrete.Auxiliary.MultiRange+Range{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

ouch, since I call for equality with EqualTo, the output is telling me that the objects are not equal, but it does not helps me very much. The best solution is to override the ToString for the Range class making it return some meaningful description.

{{< highlight CSharp "linenos=table,linenostart=1" >}}
public override string ToString()
{
   return String.Format("Range({0},{1})", Left, Rigth);
}{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

Overriding ToString in such a basic way is really simple and does not cost you time. Now when the test fails I see

{{< highlight csharp "linenos=table,linenostart=1" >}}
Expected: Range(0,5)
But was:  Range(0,4){{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

Now I understand immediately that I have two range object that are not equal, and I can spot immediately the difference.

alk.

Tags: [testing](http://technorati.com/tag/testing)
