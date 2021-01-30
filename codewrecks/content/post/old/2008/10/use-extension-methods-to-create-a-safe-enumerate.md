---
title: "Use Extension methods to create a safe enumerate"
description: ""
date: 2008-10-04T03:00:37+02:00
draft: false
tags: [General]
categories: [General]
---
When you use the foreach construct to enumerate in a IEnumerable object, one of the most annoying things is that you cannot modify the IEnumerable object adding or removing component. This is a really standard way to work, since when you are enumerating a sequence, if you add or remove an element, the sequence is changed and the whole enumeration operation should be aborted. This behaviour can be frustrating, because quite often I need to iterate through a dictionary object, and I want to be able to remove some element depending on some condition, but I cannot use a foreach beacuse I cannot modify the dictionary while enumerating. A possibile solution is to create a copy of the original enumeration and enumerate on the copy, this will permits you to modify the original sequence.

{{< highlight xml "linenos=table,linenostart=1" >}}
        public static IEnumerable<T> SafeEnumerate<T>(this IEnumerable<T> source)
        {
            List<T> copy = source.ToList();
            return copy;
        }{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

It has the unconventient problem that it creates a copy of the original enumeration, but for few elements it is not so bad.

alk.
