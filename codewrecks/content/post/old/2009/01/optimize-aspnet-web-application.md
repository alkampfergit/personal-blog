---
title: "Optimize aspnet web application"
description: ""
date: 2009-01-09T12:00:37+02:00
draft: false
tags: [ASPNET,Tools and library]
categories: [ASPNET,Tools and library]
---
The first step to optimize an application is "[measure measure measure](http://blogs.msdn.com/ricom/archive/2007/06/13/partly-sunny-chance-of-showers-bring-an-umbrella.aspx)", you cannot optimize nothing without measuring, you need some number that tells you where the application is slow and suggests you where to apply modifications, then after your optimization is done, run test suite again and measure again to check if performance are improved.

In web applications one of the most annoying stuff is a slow home page, and asp.net sites quite often can suffer of this problem. To analyze why a page is slow you can use a lot of tools, but two of them are worth to mention. The first is [Microsoft Visual Round Trip Analyzer](http://msdn.microsoft.com/en-us/magazine/dd188562.aspx), it is a great tool, but you cannot use in an environment where the browser and the server are on the same machine [as you can read here](http://rangeofmotion.spaces.live.com/blog/cns!7C83677C017E6E58!155.entry). The obvious solution is installing a virtual machine, then install VRTA on that machine and navigate from the virtual machine to your development machine, so you can use VRTA without any problem. You can read Msdn article above to find some useful informations on how to use VRTA.

Another great tool is [YSlow](http://developer.yahoo.com/yslow/), an addin for Firefox’s firebug. Yslow is really useful because it is really simple to use, just enable it and navigate to a page in firefox, then you gets results for the page.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2009/01/image-thumb3.png)](https://www.codewrecks.com/blog/wp-content/uploads/2009/01/image3.png)

The good thing about YSlow is that it gives you votes (A to F) to the page in different areas related to performances. In the above image I can see that the page has an F on the area "make fewer HTTP request", if you click on the text firefox open a [page](http://developer.yahoo.com/performance/rules.html#num_http) that explain the reason for this rule. This is important because it does not tells only where the site is slow but it tells you why. If you expand the rule you find some details

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2009/01/image-thumb4.png)](https://www.codewrecks.com/blog/wp-content/uploads/2009/01/image4.png)

Wow, this page makes a lots of http requests, and if you check it with windows round trip analyzer you can find that the reason for slow loading is mainly due to this problem. But YSlow can also show a clear graph that shows you the size of the page even with cache enabled

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2009/01/image-thumb5.png)](https://www.codewrecks.com/blog/wp-content/uploads/2009/01/image5.png)

I see that the first request is a huge 99 http request for 500k of data, and even with cache active we have a 67k and 81 http request. It is time to reduce the number of Css and Js files on the site :D

alk

Tags: [Asp.net](http://technorati.com/tag/Asp.net) [Optimization](http://technorati.com/tag/Optimization) [VRTA](http://technorati.com/tag/VRTA) [YSlow](http://technorati.com/tag/YSlow)
