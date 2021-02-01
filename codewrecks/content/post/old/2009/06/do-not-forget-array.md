---
title: "Do not forget Array"
description: ""
date: 2009-06-11T06:00:37+02:00
draft: false
tags: [NET framework,Experiences]
categories: [NET framework,Experiences]
---
I wrote a stupid util that does this operation: it scans a folder with 500.000 + files (in various subfolder), all files have name that contains an integer that is an id of a row in a database. I need to find orphan files, so I simply take file name, es: myfile\_1002.txt, extracts the number 1002 and then verify if in a specific table of the database there is a row with index 1002.

To avoid poor performance I eager load all valid ids in memory (each id is an In32 (4 bytes) and I have 100k of them, so I'm keeping in memory 100k \* 4 bytes 400kbytes of RAM). Now I load all these id in a List&lt;Int32&gt;, then iterate into all files of a directory, for each file parse the name and verify that the List contains the id. To analyze 200k files the whole routine took 10.200 milliseconds. It is quite speedy, but if you profile it you can verify that most of the time was spent into checking that an id is contained in the list.

This is because search operations in List&lt;T&gt; are slow, a search is basically a scan of the whole list until you find the element or you find the end of the list. We are so used with List&lt;T&gt; that I saw a lot of developers completely forget the old Array class. Let's see how we can speed up the lookup with the old Array class.

{{< highlight xml "linenos=table,linenostart=1" >}}
//Load all id in ascending order into ValidLink List<Int32>
Int32[] links;
links = ValidLink.ToArray();{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

I've simply change the query to the database, asking for id in ascending order, then I populate the list as usual, and finally creates a simple Array of Int32 with the function ToArray(). now you can use [BinarySearch](http://en.wikipedia.org/wiki/Binary_search)

{{< highlight xml "linenos=table,linenostart=1" >}}
if (Array.BinarySearch<Int32>(links, id) > 0){{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

A lot of people forget that the [Array class natively supports Binary search](http://msdn.microsoft.com/en-us/library/system.array.binarysearch.aspx) for ordered array, when I ran the sample again execution time was dropped to 2.392 seconds, and now most of the time is spent reading Disk structure.

Pay attention to the data structure you use ;)

Alk.
