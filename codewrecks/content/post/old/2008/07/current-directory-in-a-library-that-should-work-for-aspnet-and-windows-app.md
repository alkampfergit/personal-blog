---
title: "Current directory in a library that should work for aspnet and windows app"
description: ""
date: 2008-07-15T05:00:37+02:00
draft: false
tags: [Uncategorized]
categories: [General]
---
Suppose you created a library that needs to scan the “current directory” looking for some files, first solution that came in my mind was to use Enviroment.CurrentDirectory, but this is not correct. In a web.application or windows service you will find that CurrentDirectory is c:\windows\system32.

I need a generic way to find a file that is located in the same path of the executables in a windows app, and in base directory for a web.application, I do not want my dll reference the System.Web trying to find if the HttpContext is null, so I do not want to use Server.MapPath() or some other classes related to web project. The solution for such a problem is to use

{{< highlight csharp "linenos=table,linenostart=1" >}}
AppDomain.CurrentDomain.BaseDirectory{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

it works perfectly ;)

alk.

<!--dotnetkickit-->
