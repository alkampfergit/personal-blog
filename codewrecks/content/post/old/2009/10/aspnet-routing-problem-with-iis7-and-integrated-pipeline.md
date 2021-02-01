---
title: "AspNet routing problem with IIS7 and integrated pipeline"
description: ""
date: 2009-10-28T11:00:37+02:00
draft: false
tags: [ASPNET]
categories: [ASPNET]
---
I have an asp.net site that uses asp.net routing to dynamically create some reports. I mapped the extension.zip to asp.net ISApi, then with routing I map url

{{< highlight csharp "linenos=table,linenostart=1" >}}
 Using RouteTable.Routes.GetWriteLock()
            RouteTable.Routes.Add(New Route("reports/{reporttype}/{reportid}/report.zip", New MyReportRouter)){{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

everything works perfectly, until I move this site to IIS7 and try to use it with integrated pipeline mode. When I browse to a valid report url I got this error.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2009/10/image-thumb30.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2009/10/image30.png)

It seems that my request must be satisfied by UrlRouting.axd handler... very strange. If I attach a debugger to worker process I can verify that routing is ok, my IRouteHandler is called correctly, it creates the handler that will be used to satisfy the request, but the handler was never called. After a deep search on the internet I did not find anything, except [this link](http://stackoverflow.com/questions/643477/asp-mvc-routing-problem-with-iis7).

It seems that for a reason that I do not know, iis7 in integrated mode want to use UrlRouting.axd when routing is used, the solution is adding this line to the &lt;handlers&gt; section of config file

{{< highlight xml "linenos=table,linenostart=1" >}}
<add 
    name="UrlRoutingHandler" 
    preCondition="integratedMode" 
    verb="*" 
    path="UrlRouting.axd" 
    type="System.Web.HttpForbiddenHandler, System.Web, Version=2.0.0.0, Culture=neutral, PublicKeyToken=b03f5f7f11d50a3a" />
{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

The solution was to add an handler that maps, in integrated mode, the UrlRouting.axd to the HttpForbiddenHandler, now everything work perfectly.

Then I had another absurd problem when I moved everything on production server, the routing works, but it throws an exception my handler because httpContext.Current.Session is null. This is very strange, [but even stranger is the solution](http://stackoverflow.com/questions/218057/httpcontext-current-session-is-null-when-routing-requests), simply remove and readd session module in &lt;Modules&gt;

{{< highlight xml "linenos=table,linenostart=1" >}}
<modules>
    <remove name="Session" />
    <add name="Session" type="System.Web.SessionState.SessionStateModule"/>{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

This sounds absurd to me, but the real solution is another, putting  runAllManagedModulesForAllRequests into &lt;modules&gt; declaration.

{{< highlight xml "linenos=table,linenostart=1" >}}
<modules runAllManagedModulesForAllRequests="true">
{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

You can check some other details [here](http://weblogs.asp.net/scottgu/archive/2007/02/26/tip-trick-url-rewriting-with-asp-net.aspx) in ScottGu's blog.

Alk.

Tags: [Asp.Net Routing](http://technorati.com/tag/Asp.Net%20Routing)
