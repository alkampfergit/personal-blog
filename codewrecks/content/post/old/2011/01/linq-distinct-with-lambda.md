---
title: "Linq distinct with lambda"
description: ""
date: 2011-01-18T08:00:37+02:00
draft: false
tags: [LINQ]
categories: [LINQ]
---
Linq Distinct function accepts an IEqualityComparer&lt;T&gt; used to compare values of the IEnumerable to remove *equal* objects to implement the Distinct() function. Sometimes it is more useful to specify a simple Func&lt;T, T, Boolean&gt;, a simple predicate that will implement the concept of Equality between elements. To support such a scenario you can write this simple Extension method.

{{< highlight csharp "linenos=table,linenostart=1" >}}
public static IEnumerable<T> Distinct<T>(
this IEnumerable<T> source,
Func<T, T, Boolean> comparer)
{
return new DistinctByLambda<T>(comparer, source);
}
{{< / highlight >}}

All the work is done by the DistinctByLambda class, that accepts a reference to the original IEnumerable sequence of elements and the predicate to verify for equality. Here is the code.

{{< highlight csharp "linenos=table,linenostart=1" >}}
public class DistinctByLambda<T> : IEnumerable<T>
{
private Func<T, T, Boolean> _comparer;
 
private IEnumerable<T> _source;
 
public DistinctByLambda(Func<T, T, bool> comparer, IEnumerable<T> source)
{
_comparer = comparer;
_source = source;
}
 
public IEnumerator<T> GetEnumerator()
{
List<T> alreadyFound = new List<T>();
foreach (T element in _source)
{
if (!alreadyFound.Exists(el => _comparer(el, element)))
{
alreadyFound.Add(element);
yield return element;
}
}
}
 
IEnumerator IEnumerable.GetEnumerator()
{
return GetEnumerator();
}
}
{{< / highlight >}}

The code is really simple, the IEnumerable.GetEnumerator function is implemented with a simple internal list that stores all distinct elements. For each element of the original list, if it is not equal to any element of the original list it is stored in the list and then returned to the caller; if the element is equal to one element in the list, it gets not returned.

You can use the following function in this simple way.

{{< highlight csharp "linenos=table,linenostart=1" >}}
[Test]
public void VerifyDistinctByLambda()
{
IList<Test> list = new List<Test>() {new Test("a", 11), new Test("a", 12), new Test("b", 12)};
var result = list.Distinct((t1, t2) => t1.BlaBla == t2.BlaBla);
Assert.That(result.Count(), Is.EqualTo(2));
Assert.That(result, Is.EquivalentTo(new List<Test>() {new Test("a", 11), new Test("b", 12)}));
}
{{< / highlight >}}

I use a simple Test class that contains two properties, and call Distinct with a  function that compare only the BlaBla property. Now you can use lambda with distinct ![Smile](https://www.codewrecks.com/blog/wp-content/uploads/2011/01/wlEmoticon-smile.png)

Alk.
