---
title: "Dynamic Linq expression generator"
description: ""
date: 2008-11-19T03:00:37+02:00
draft: false
tags: [LINQ]
categories: [LINQ]
---
Some time ago I read th[is post](http://weblogs.asp.net/scottgu/archive/2008/01/07/dynamic-linq-part-1-using-the-linq-dynamic-query-library.aspx) that speaks about dynamic query library. I downloaded the code sample, it is interesting, but is bound to Linq to Sql, now I need an implementation of a Dynamic Linq Query generator. Since I already worked in the past with expression parser and I have some generic Infix to postfix converter in a three hours of work I was able to put everything in a project and now I can write

{{< highlight xml "linenos=table,linenostart=1" >}}
Func<Customer, Boolean> f = DynamicLinq.ParseToFunction<Customer, Boolean>("Name == 'Gian Maria'");
Assert.That(f(aCustomer), Is.True);{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

This example shows that I can build a simple function that accepts an entity (Customer) and a string representing some conditions, then Iâ€™m able to dynamically parse the string, create an expression tree and call Compile on it to obtain a function that I can use in code. As soon as possible Iâ€™ll show a complete example if you are interested in.

alk.

Tags: [LINQ](http://technorati.com/tag/LINQ) [Dynamic Expression Generation](http://technorati.com/tag/Dynamic%20Expression%20Generation)
