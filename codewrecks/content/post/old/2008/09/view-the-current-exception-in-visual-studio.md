---
title: "View the current exception in Visual Studio"
description: ""
date: 2008-09-26T02:00:37+02:00
draft: false
tags: [Tools and library]
categories: [Tools and library]
---
Sometimes you write pieces of code like this.

{{< highlight csharp "linenos=table,linenostart=1" >}}
 catch
        {
          LogException(....{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

This type of exception handler catch everything and log, despite the fact that is not so good practice to catch every exception that a piece of code could raise, one of the most frustrating thing is that if you place a breakpoint in the LogException line, since you have not specified in the catch clause no exception you have no way to see detail of the exception.

You should know that you can see current exception detail in watch windows with the special syntax $exception or @exception

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2008/09/image-thumb5.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2008/09/image5.png)

But if you want, the same information is always displayed in the local windows. This is a basic functionality of visual studio, but many people does not know it ;)

Alk.

Tags: [Visual Studio](http://technorati.com/tag/Visual%20Studio) [.Net Framework](http://technorati.com/tag/.Net%20Framework)

<script type="text/javascript">var dzone_url = 'http://www.codewrecks.com/blog/index.php/2008/09/26/view-the-current-exception-in-visual-studio/';</script><script type="text/javascript">var dzone_title = 'View the current exception in Visual Studio';</script><script type="text/javascript">var dzone_blurb = 'View the current exception in Visual Studio';</script><script type="text/javascript">var dzone_style = '2';</script><script language="javascript" src="http://widgets.dzone.com/widgets/zoneit.js"></script> 

[![DotNetKicks Image](http://www.dotnetkicks.com/Services/Images/KickItImageGenerator.ashx?url=http://www.codewrecks.com/blog/index.php/2008/09/26/view-the-current-exception-in-visual-studio/&amp;bgcolor=0080C0&amp;fgcolor=FFFFFF&amp;border=000000&amp;cbgcolor=D4E1ED&amp;cfgcolor=000000)](http://www.dotnetkicks.com/kick/?url=http://www.codewrecks.com/blog/index.php/2008/09/26/view-the-current-exception-in-visual-studio/)
