---
title: "Unit testing floating point numbers"
description: ""
date: 2011-05-05T15:00:37+02:00
draft: false
tags: [Unit Testing]
categories: [Testing]
---
Testing for equality Floating point numbers is usually a bad idea, this because rounding occurs with floating point operations and you need to test with a tolerance. Suppose you test that some algorithm produces the expected result and you find that unit test fails with this message.

> SharpTestsEx.AssertException : 2.36 Should Be Equal To 2.36.

This seems strange, but the problem is that the real value is 2.360000000003 that surely is different from 2.36. Now you have two different scenario, the first one is *the test is wrong because I want to verify that the two numbers are really equals*. With floating point calculation this cannot be achieved, you can use numbers with high precision, but doing operations with any floating point numbers lead to rounding, and you should never test for equality two floating point numbers.

A second and better scenario is when you the test is expressed with a tolerance, so you can write this assertion.

{{< highlight csharp "linenos=table,linenostart=1" >}}
result.Should().Be.EqualTo(expectedresult, 0.00001)
{{< / highlight >}}

This is a better assertion, Iâ€™m asking if the result is different from the expected value with a 0.00001 tolerance. This is possible with a simple extension of SharpTestEx.

{{< highlight csharp "linenos=table,linenostart=1" >}}
public static IComparableBeConstraints<Double> EqualTo(
this IComparableBeConstraints<Double> constraint,
Double expected,
Double tolerance)
{
constraint.AssertionInfo.AssertUsing<Double>(
new Assertion<Double, IComparable>(
"Equal to", expected, a => Math.Abs(a - expected) <= tolerance));
return constraint;
}
{{< / highlight >}}

Such test is much more interesting and correct, because it states the tolerance that you can suffer before stating that the algorithm is wrong.

Alk.
