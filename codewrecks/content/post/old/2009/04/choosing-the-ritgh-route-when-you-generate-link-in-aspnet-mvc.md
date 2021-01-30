---
title: "Choosing the ritgh route when you generate link in aspnet mvc"
description: ""
date: 2009-04-05T10:00:37+02:00
draft: false
tags: [AspNet MVC]
categories: [AspNet MVC]
---
Iâ€™m moving my first steps on asp.net mvc, and in my test project I added a route after the default one in this way.

{{< highlight csharp "linenos=table,linenostart=1" >}}
 RouteTable.Routes.MapRoute(
               "Default",
               "{controller}/{action}/{id}",
               new { controller = "Home", action = "Index", id = "" }
             );
            RouteTable.Routes.MapRoute(
                "PagedController",
                "{controller}/{action}/{pageid}/{id}",
                new { controller = "Home", action = "Index", pageid = 0, id = "" }
              );{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

As you can see the second route is used when the controller need the concept of current page, it is very close to the default one, but it has another parameter called pageid. Now I generate a link to the paged controller with the following code.

{{< highlight csharp "linenos=table,linenostart=1" >}}
Html.ActionLink(
    "Edit", 
    "ManageAlbum", 
    "PhotoManager", 
    new { pageid = ViewData.Model.CurrentPage, id = Guid.Empty},
    null){{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

But generated link is [PhotoManager/ManageAlbum/00000000-0000-0000-0000-000000000000?pageid=0](http://localhost:13164/PhotoManager/ManageAlbum/00000000-0000-0000-0000-000000000000?pageid=0 "http://localhost:13164/PhotoManager/ManageAlbum/00000000-0000-0000-0000-000000000000?pageid=0") that is wrong. The page id was put in querystring and not in the path as I want. The problem is derived from the order of routes, because the ActionLink function scans route from the first to the last. Since the first route match with the parameter the ActionLink method decides to use the â€œDefaultâ€ route, appending the pageid parameter to the querystring.

If you need to manually choose the route you need to generate your link you can use a different method of the Html helper object.

{{< highlight csharp "linenos=table,linenostart=1" >}}
Html.RouteLink(
    "Edit", 
    "PagedController", 
    new { 
        controller=  "ManageAlbum", 
        action = "PhotoManager", 
        pageid = ViewData.Model.CurrentPage, 
        id = Guid.Empty}, 
    null){{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

As you can see with the RouteLink() method you can choose exactly the route you want to use, and generate desidered link [/ManageAlbum/PhotoManager/0/00000000-0000-0000-0000-000000000000](http://localhost:13164/ManageAlbum/PhotoManager/0/00000000-0000-0000-0000-000000000000 "http://localhost:13164/ManageAlbum/PhotoManager/0/00000000-0000-0000-0000-000000000000").

alk.

Tags: [Asp.net MVC](http://technorati.com/tag/Asp.net%20MVC)
