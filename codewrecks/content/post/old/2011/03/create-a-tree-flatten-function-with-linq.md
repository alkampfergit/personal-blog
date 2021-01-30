---
title: "Create a tree flatten function to support LINQ queries"
description: ""
date: 2011-03-31T17:00:37+02:00
draft: false
tags: [LINQ]
categories: [LINQ]
---
Quite often I deal with tree structures where each node can contains a set of children nodes. When is time to cycle through all the nodes, to execute some logic, you need to write a standard recursive function, an operation that is quite boring and repetitive. The question is, is it possible to write a LINQ function called Flatten() that permits you to flatten down a tree of arbitrary depth down to an IEnumerable&lt;T&gt;? The answer is yes.

{{< highlight csharp "linenos=table,linenostart=1" >}}
public static IEnumerable<T> Flatten<T>(
this T root,
Func<T, IEnumerable<T>> getChildernFunc)
{
yield return root;
 
IEnumerable<T> descendants = getChildernFunc(root);
if (descendants != null)
foreach (T element in descendants)
{
foreach (T elementinner in element.Flatten(getChildernFunc))
{
yield return elementinner;
}
}
}
{{< / highlight >}}

It is amazing how simple is writing such a function with the [yield return](http://msdn.microsoft.com/en-us/library/9k7k7cf0%28v=vs.80%29.aspx) keyword. The code is based on an extension method that accepts an element of type T and a function that is capable to take an element of type T and return its childrens. Inside the body of the function I simply return the root as first, then I iterate on all childrens and for each one recursively call the Flatten function.

How easy. The code probably is not optimum for performance, but it is simple, and I always follow the rule of the three M, Measure Measure Measure, so I do not care for performance problems right now. Now I can write this simple test

{{< highlight csharp "linenos=table,linenostart=1" >}}
[Test]
public void TestRecursivePopulationThreeLevel()
{
Recursive r1 = new Recursive(1,
new Recursive(2,
new Recursive(4)),
new Recursive(3));
var flatten = r1.Flatten(r => r.Recursives);
flatten.Count().Should().Be.EqualTo(4);
flatten.Select(r => r.Id).Should().Have.SameSequenceAs(new [] {1, 2, 4, 3});
}
{{< / highlight >}}

To verify that the code really flatten down the tree. Thanks to Extension Method and yield keyword you can write a simple function that flatten down a hierarchy with fews lines of code.

Alk.
