---
title: "LINQ ForEach for IEnumerableltTgt"
description: ""
date: 2008-08-13T07:00:37+02:00
draft: false
tags: [LINQ]
categories: [LINQ]
---
It seems to me strange that LINQ does not define an extension method *ForEach* to apply some Action&lt;T&gt; on an IEnumerable&lt;T&gt;. Array and List both  have ForEach() method, and IEnumerable really miss it a lot, but fortunately implementing it is a matter of few lines of code.

{{< highlight xml "linenos=table,linenostart=1" >}}
public static IEnumerable<T> ForEach<T>(
    this IEnumerable<T> source, 
    Action<T> act)
{
    foreach (T element in source) act(element);
    return source;
}{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

I decided to make the ForEach&lt;T&gt; return the original list, so I can use with chaining in fluent interface, but you can also make it return void, thus restricting its use only at the end of a linq chain.

Alk.

<!--dotnetkickit-->

Tags: [LINQ](http://technorati.com/tag/LINQ)
