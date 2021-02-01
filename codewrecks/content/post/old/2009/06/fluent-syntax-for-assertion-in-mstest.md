---
title: "Fluent Syntax for Assertion in msTest"
description: ""
date: 2009-06-10T10:00:37+02:00
draft: false
tags: [Testing]
categories: [Testing]
---
Switching from [Nunit](http://www.nunit.org) to [MsTest](http://en.wikipedia.org/wiki/MSTest) is quite simple, but the first thing I really miss with mstest was the lack of a fluent assertion syntax. Consider the assertion you must write if you want to check that a number is lesser than 100 or greater than 200

{{< highlight xml "linenos=table,linenostart=1" >}}
[TestMethod]
public void BaseAssertFluentWithSyntaxHelperLtOrGtRo()
{
    Int32 obj = 400;
    Assert.IsTrue(obj < 100 || obj > 200);
}{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

It is quite clear, but with fluent syntax you can write test like this

{{< highlight csharp "linenos=table,linenostart=1" >}}
[TestMethod]
public void BaseAssertFluentWithSyntaxHelperLtOrGtR()
{
    Int32 obj = 400;
    FluentAssert.That(obj, Is.LesserThan(100).Or.GreaterThan(200));
}{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

I find it really clearer than the first form. The advantage of a fluent syntax is that you can read the assertion as if were English text. I'm actually writing an helper assembly to support fluent syntax with msTest, if someone is interested in I can publish in source form. For now I'm able to support basic syntax with operator precedence and parenthesis

{{< highlight csharp "linenos=table,linenostart=1" >}}
[TestMethod]
public void TestBasic2()
{
    IConstraint c = Is.LesserThan(100) | Is.GreaterThan(200) & Is.GreaterThan(300);
    Assert.IsTrue(c.Validate(99));
}

[TestMethod]
public void TestBasicParenthesis()
{
    IConstraint c = (Is.LesserThan(100) | Is.GreaterThan(200)) & Is.GreaterThan(300);
    Assert.IsFalse(c.Validate(99));
}{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

As you can see the first test pass because the And operator ( expressed by & because you cannot overload &&) has higher precedence over the or operator. The second test pass because you can alter precedence with parenthesis.

Alk.
