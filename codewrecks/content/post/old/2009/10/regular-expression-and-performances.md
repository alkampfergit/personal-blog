---
title: "Regular expression and performances"
description: ""
date: 2009-10-26T09:00:37+02:00
draft: false
tags: [NET framework]
categories: [NET framework]
---
Regular expressions are really powerful, but sometimes they can be quite slow, especially when you have to deal with large amount of data.

I have a lot of string in database that have this format â€¦textâ€¦||â€¦anothertextâ€¦||..anothertextâ€¦ and we need to split using || as separator. Since string.split accepts only a char, we used a simple regular expression to parse text.

{{< highlight xml "linenos=table,linenostart=1" >}}
@"(>|\||^|(\.\.\.))(?<prev>.+?)(<|\||$|(\.\.\.,))"{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

This regular expression was a leftover by some old code, it splits string with tag like &lt;xxx&gt;â€¦text&lt;/xxx&gt; and was left here even if now the string format is really simplier. Now we experienced some slow excel report creation and I verified that most of the time is spent in parsing this string (that is called previews).

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2009/10/image-thumb18.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2009/10/image18.png)

In this test 20 seconds are wasted in function that used those old regex. Now I simply rewrite it using indexof while loop.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2009/10/image-thumb19.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2009/10/image19.png)

Thanks to [dottrace](http://www.jetbrains.com/profiler/index.html) i verify that now the most expensive function is ManageModifiedRowContent. The morale is, pay attention to regular expression because they can be slow. If you need to manage large amount of data, do not use regex for simple task.

alk.

Tags: [Regular Expression](http://technorati.com/tag/Regular%20Expression)
