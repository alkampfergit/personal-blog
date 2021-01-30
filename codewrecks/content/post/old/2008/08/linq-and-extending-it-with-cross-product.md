---
title: "LINQ and extending it with cross product"
description: ""
date: 2008-08-13T08:00:37+02:00
draft: false
tags: [LINQ]
categories: [LINQ]
---
Linq to object is really useful in a lot of places around my daily code. This afternoon I have to setup some routine to do crossproduct of some objects. With the term cross product I mean having two set, one made by elements of type X and the other made by elements of type Y, all that I need is creating a new set that contains an element of type Z from every combination of these two set. As an example I want to write this simple piece of code.

{{< highlight csharp "linenos=table,linenostart=1" >}}
Int32[] first = new Int32[] {1, 2, 3, 4};
Int32[] second = new Int32[] { 10, 20, 30, 40 };
foreach (Int32 num in first.CrossProduct(second, (l, r) => l * r))
    Console.WriteLine(num);{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

And have this output

{{< highlight csharp "linenos=table,linenostart=1" >}}
10 20 30 40 20 40 60 80 30 60 90 120 40 80 120 160{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

But I need also to express conditions on both the sets, because I want to exclude some elements, so I want to be able to write also this code.

{{< highlight xml "linenos=table,linenostart=1" >}}
Int32[] first = new Int32[] { 1, 2, 3, 4 };
Int32[] second = new Int32[] { 10, 20, 30, 40 };
foreach (Int32 num in first.CrossProduct(second, f => f > 2, s => s < 30, (l, r) => l * r))
    Console.Write(num + " ");{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

and have it output 30 60 40 80. As you can see I setup a condition for the first set to take elements greater than 2 and for the second set I want to take only elements that are less than thirty.

Here is my implementation, I did it in few minutes

{{< highlight xml "linenos=table,linenostart=1" >}}
public static IEnumerable<K> CrossProduct<T, U, K>(
    this IEnumerable<T> left,
    IEnumerable<U> right,
    Func<T, U, K> selector)
{
    return new CrossProductImpl<T, U, K>(left, right, selector);
}

public static IEnumerable<K> CrossProduct<T, U, K>(
    this IEnumerable<T> left,
    IEnumerable<U> right,
    Func<T, Boolean> leftFilter,
    Func<U, Boolean> rightFilter,
    Func<T, U, K> selector)
{
    return new CrossProductImpl<T, U, K>(left, right, leftFilter, rightFilter, selector);
}{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

Both the extension methods return a CrossProductImpl class, here is the full code.

{{< highlight xml "linenos=table,linenostart=1" >}}
public class CrossProductImpl<T, U, K> : IEnumerable<K>
{
    private Func<T, U, K> selector;
    private IEnumerable<T> left;
    private IEnumerable<U> right;
    private Func<T, Boolean> leftFilter = e => true;
    private Func<U, Boolean> rightFilter = e => true;

    public CrossProductImpl(IEnumerable<T> left, IEnumerable<U> right, Func<T, U, K> selector)
    {
        this.selector = selector;
        this.left = left;
        this.right = right;
    }

    public CrossProductImpl(IEnumerable<T> left, IEnumerable<U> right, Func<T, bool> leftFilter, Func<U, bool> rightFilter, Func<T, U, K> selector)
    {
        this.selector = selector;
        this.left = left;
        this.right = right;
        this.leftFilter = leftFilter;
        this.rightFilter = rightFilter;
    }

    #region IEnumerable<K> Members

    public IEnumerator<K> GetEnumerator()
    {
        foreach (T leftElement in left.Where(leftFilter))
            foreach (U rightElement in right.Where(rightFilter))
                yield return selector(leftElement, rightElement);
    }

    #endregion

    #region IEnumerable Members

    System.Collections.IEnumerator System.Collections.IEnumerable.GetEnumerator()
    {
        return GetEnumerator();
    }

    #endregion
}{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

This technique is used to make lazy evaluation, all the code is really executed only when the caller iterates on the result of the method, this feature is known as *deferred execution.*To verify it you can execute this piece of code

{{< highlight xml "linenos=table,linenostart=1" >}}
Int32[] first = new Int32[] { 1, 2, 3, 4 };
Int32[] second = new Int32[] { 10, 20, 30, 40 };
IEnumerable<Int32> result = first.CrossProduct(second, f => f > 2, s => s < 30, (l, r) => l*r);
foreach (Int32 num in result)
    Console.Write(num + " ");
Console.WriteLine();
first[0] = 10;
foreach (Int32 num in result)
    Console.Write(num + " ");{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

And the output shows that each time I iterate in result, the code gets executed again.

{{< highlight csharp "linenos=table,linenostart=1" >}}
30 60 40 80 
100 200 30 60 40 80 {{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

I added also a couple of overload extension methods that instead of accepting a Func&lt;T, U, K&gt; as the last argument accepts an Action&lt;T, U&gt; and returns void. This helps me in situation when I do not need to generate another set, but I’m interested only in knowing all the permutation of the two original set.

alk.

Tags: [LINQ, Cross Product](http://technorati.com/tag/LINQ,%20Cross%20Product)

<!--dotnetkickit-->
