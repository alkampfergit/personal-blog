---
title: "Optimizing Regular expression"
description: ""
date: 2009-04-24T05:00:37+02:00
draft: false
tags: [NET framework]
categories: [NET framework]
---
I have an application where I do a lot of search for pattern in text and I use a lot of regular expression. The program runs well, until the amount of text it has to search into is grown tremendously. It reaches a point where the standard daily task that was completed in a couple of hours now span for more than one day, and I need to run it each day, so I need to optimize.

I created a little test that uses actual data, and it tooks 4.5 seconds to execute, this is really wrong, because Iâ€™m actually doing about 30 of this searches and for each of these I search in a pool of 10.000 strings, so Iâ€™m doing a 300.000 searches and with 4 seconds for each search I reach a  stunning grand total of time of about 300 hoursâ€¦this is clearly unacceptable. This happens because the number of searches is grown of about two orders of magnitude in few days.

First of all I try to clear the cache for regular expression before the test with * **Regex.CacheSize = 0** *, the total time does not change. Then I try to raise this value with* **Regex.CacheSize = 200** *,  nothing changed, so it is not problem of cache. Then it is time to fire a profiler to see what is happening.

I use [DotTrace](http://www.jetbrains.com/profiler/), it is a very good profiler made by [JetBrains](http://www.jetbrains.com), I build a simple form with a button that runs the test, and here is the result of the first run

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2009/04/image-thumb4.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2009/04/image4.png)

All the time is taken from the MoveNext of the MatchEnumerator, that actually executes the regular expression. The profiler confirms me that I need to optimize the regular expression because quite all the time was spent in matching regular expressions. First of all I added the RegexOptions.Compiled option to the base option, this ones enables precompiling the regular expression and this make execution time drops from 4.5 seconds to 2.7 seconds, it was a good thing, but I decided to try to optimize a little bit more.

Next test is a more significant one, because I run the previous test 5 times on different pieces of test, the result was 14 seconds. Resulting time is not 4.5 \* 5 probably because differencies in text. Now some of the time is gone building regex object for each search. I pass a list of strings as search key, then into my routine I build regex objects based on these keys, if I call 5 times the routine I create 5 times the same regexes objects, so I decided to cache them into a static dictionary&lt;String, Regex&gt;, and clear the dictionary when the search is finished, not to waste memory. Now execution time drops to 11 seconds.

Another test with dottrace confirms me that all the time is spent doing regex matching.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2009/04/image-thumb5.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2009/04/image5.png)

I optimized total time, but still the regex is the only cause of slow routine. Iâ€™ll keep on investigating if can optimize more.

alk.

Tags: [Regular Expression](http://technorati.com/tag/Regular%20Expression) [.NET Framework](http://technorati.com/tag/.NET%20Framework)
