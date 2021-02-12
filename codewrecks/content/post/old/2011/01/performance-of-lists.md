---
title: "Performance of Lists"
description: ""
date: 2011-01-19T09:00:37+02:00
draft: false
tags: [Performance]
categories: [NET framework]
---
In a [previous post](http://www.codewrecks.com/blog/index.php/2011/01/18/linq-distinct-with-lambda/) I explained how to create a simple LINQ extension method to use the Distinct() method with a lambda and not an IEqualityComparer. That solution uses a simple List&lt;T&gt; as temporary storage to implement the concept of *distinct elements*. To verify if an object was already returned I simply searched into the temp List&lt;T&gt; looking if an element that satisfy the Predicate, this will permit me to return only distinct elements.

The question is, it is slow? The answer is yes, because List&lt;T&gt; performs really bad when you search elements in it, because it needs to scan all the elements until it find an element that satisfy the predicate or you finish all the elements.

I created a list with 320 elements and benchmark the time needed to execute 2000 times an iteration with the Distinct() method I wrote.

{{< highlight csharp "linenos=table,linenostart=1" >}}
for (int i = 0; i < 2000; i++)
{
foreach (Test test in list.Distinct(
(t1, t2) => t1.BlaBla.Equals(t2.BlaBla)))
{
//do nothing only iterate
}
}
{{< / highlight >}}

It executes in about 3800 milliseconds, but is it slow? is it fast? can we optimize it?

The solution is running this simple test under a profiler, like [ANT profiler](http://www.red-gate.com/products/dotnet-development/ants-performance-profiler/), just to see if there is some Hot path

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2011/01/image_thumb8.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2011/01/image8.png)

From this image it is clear that 98% of the time is spent inside the Exists() method of the List&lt;T&gt;, and this is something we already know, but the profiler is confirming our suspects, searching elements inside a simple IList&lt;T&gt; is really slow. A simple solution is writing this helper to create an IEqualityComparer with lambda.

{{< highlight csharp "linenos=table,linenostart=1" >}}
public class Comparer<T> : IComparer<T>, IEqualityComparer<T> {
 
private readonly Func<T, T, Int32> compareFunc;
private readonly Func<T, Int32> hashFunc;
 
public Comparer(Func<T, T, Int32> compareFunc, Func<T, Int32> hashFunc)
{
this.compareFunc = compareFunc;
this.hashFunc = hashFunc;
}
 
#region IComparer<T> Members
 
public int Compare(T x, T y) {
return compareFunc(x, y);
}
 
#endregion
 
#region IEqualityComparer<T> Members
 
public bool Equals(T x, T y) {
return compareFunc(x, y) == 0;
}
 
public int GetHashCode(T obj) {
return hashFunc(obj);
}
 
#endregion
}
 
public static class ComparerFactory {
 
public static Comparer<T> Create<T> (
Func<T, T, Int32> compareFunc,
Func<T, Int32> hashFunc)
{
return new Comparer<T>(compareFunc, hashFunc);
}
{{< / highlight >}}

This is a class that implements IComparer and IEqualityComparer based on lambda. IEqualityComparer&lt;T&gt; is a special interface, because it has the GetHasCode function that permits to use Hashtable to store objects and use fast search algorithm. Thanks to a simple helper factory, you can create an IEqualityComparer&lt;T&gt; based on a lambda with a single instruction.

{{< highlight csharp "linenos=table,linenostart=1" >}}
Utils.Comparer<Test> comparer = ComparerFactory.Create<Test>(
(t1, t2) => t1.BlaBla.CompareTo(t2.BlaBla),
t => t.BlaBla.GetHashCode());
{{< / highlight >}}

Thanks to the Factory class I can create a Comparer&lt;T&gt; based on two functions, one implements the concepts of equality, the other return an hashcode for an object. The general rule is that two object that are equals must return the same hashcode. Since I want to compare instance only by BlaBla property, I implement the hash function simply using BlaBla.GetHashCode(). Now I can use the base Distinct() LINQ function.

{{< highlight csharp "linenos=table,linenostart=1" >}}
for (int i = 0; i < 2000; i++)
{
foreach (Test test in list.Distinct(comparer))
{
//do nothing only iterate
}
}
{{< / highlight >}}

If you compare this code with the one that use the lambda it is really similar, in the end all you want is to be able to use the Distinct operator with a Lambda function that implements the concept of Equality; in the first sample you can pass the lambda directly to the distinct() operator, in the second example you need to write some extra code to create the comparer passing the lambda object and an HashCode function, but the result is the same: being able to use Distinct() method with a Lambda.

If you run this second snippet, the time of execution drops from 3800 ms to 90ms, because the base implementation of Distinct, (thanks to IEqualityComparer) can use some hash based container to store objects and perform faster searches.

alk.
