---
title: "Firefox and missing offsetX value from event object"
description: ""
date: 2009-01-02T07:00:37+02:00
draft: false
tags: [General]
categories: [General]
---
As you can verify in various [articles](http://www.reloco.com.ar/mozilla/compat.html) the event object in javascript is really different between IE and firefox. This is one of the most annoying part of javascript programming, taking into account the various differences of avaliable browser.

I have an old routing that uses event.offsetX to do some logic on an image depending on the relative position of the mouse respect to the image top-left corner, it works only for IE but now I need to make it compatible with firefox. Since now I'm a great fan of [JQuery](http://jquery.com/) I immediately try to solve this problem with JQuery. The first problem is that the event object is really different from IE and firefox, but I find this solution

{{< highlight csharp "linenos=table,linenostart=1" >}}
1 var offX;
2 if (!evt.offsetX)
3     offX = evt.layerX - $(evt.target).position().left;
4 else
5     offX = evt.offsetX;{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

I first start in line 2 with a simple condition, â€œcheck if the event object has a property called  **offsetX** ), if not I need to calculate the mouse X position relative to the control that generated the event using the  **position()** jquery function, that returns the position of the first element of the wrapped set relative to its offset parent. This value is the position of the image that generated the event, that can be used to calculate relative position.

Alk.
