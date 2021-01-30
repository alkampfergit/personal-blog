---
title: "Optimizing regular expression part 2"
description: ""
date: 2009-04-29T10:00:37+02:00
draft: false
tags: [General]
categories: [General]
---
If you look at [this post](http://www.codewrecks.com/blog/index.php/2009/04/24/optimizing-regular-expression/), you can see that I had some performance problem with regular expression. After the first round of optimization it turns out that performances are still quite slow. My next step will be to remove regular expression doing search by a custom algorithm.

I need to search word in text with the possibility to specify wildcards like Sampl?, or Samp\*. This kind of search is really simple with regular expression, but is slow. I suspected that doing manual search with indexOf could be quicker. In few minutes I created a new component that uses indexof, fire all test, verify that the component is ok, and then I fire again the text against a big file.  Doing a series of tests with the original optimized regex object returns.

{{< highlight csharp "linenos=table,linenostart=1" >}}
Elapsed:7058
Elapsed:9740
Elapsed:3254
Elapsed:16423
Elapsed:1520{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

Running the same suite of tests with the object that does not uses regex returns.

{{< highlight csharp "linenos=table,linenostart=1" >}}
Elapsed:1895
Elapsed:1896
Elapsed:595
Elapsed:2987
Elapsed:274{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

Iâ€™m quite happy, because I gain more than 70% performances with my first implementation that is the first think that comes in my mind. Now it is time again to fire [DotTrace](http://www.jetbrains.com/profiler/).

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2009/04/image-thumb7.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2009/04/image7.png)

Since IndexOf is the one that occupies all the time, there is nothing more to optimize. Thanks to DotTrace I avoid wasting more time trying to optimize a function when all the time is spent in a framework function.

alk.
