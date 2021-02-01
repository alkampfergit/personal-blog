---
title: "Decouple controllers and other objects from context in aspnet mvc"
description: ""
date: 2009-04-20T10:00:37+02:00
draft: false
tags: [AspNet MVC]
categories: [AspNet MVC]
---
When I decided to write down a little class to manage a [menu](http://www.codewrecks.com/blog/index.php/2009/04/14/build-a-menu-for-aspnet-mvc-site/), I created a simple object that reads the menu data in xml, and transform it into a series of MenuItem object. The first thing I wanted to do is writing some test to verify that the logic is ok, but since my class uses Url.RouteUrl to build the url from the controller and action strings, testing becomes difficult, because it does not runs outside iis.

You can surely mock controller context in asp.net mvc, and there are a lot of good articles in the net dealing with this, but sometimes I prefer a simpler approach that I used a lot in classic webform asp.net applications. Since the class that contains the logic to format the menu needs only to access the UrlHelper class, I abstracted it with a simple interface.

{{< highlight CSharp "linenos=table,linenostart=1" >}}
public interface IUrlHelper
{
   String RouteUrl(RouteValueDictionary values);
   String RouteUrl(Object values); 
   String RouteUrl(String routeName, Object values); 
}{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

This simple interface does not even contains all methods of the standard UrlHelper, but it is enough for me, I'll add more methods when I'll need them. Now my class can declare a dependency to this interface.

{{< highlight CSharp "linenos=table,linenostart=1" >}}
   public class MasterLogic
   {
      public IUrlHelper Url { get; set; }

      public MasterLogic(IUrlHelper url)
      {
         Url = url;
      }{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

then create the real object that will be used in the site. It is a simple wrapper for the real UrlHelper

{{< highlight CSharp "linenos=table,linenostart=1" >}}
   public class MvcRouteHelper : IUrlHelper
   {
      public UrlHelper Helper { get; set; }

      public MvcRouteHelper(UrlHelper helper)
      {
         Helper = helper;
      }

      #region IUrlHelper Members

      public string RouteUrl(System.Web.Routing.RouteValueDictionary values)
      {
         return Helper.RouteUrl(values);
      }

      public String RouteUrl(Object values)
      {
         return Helper.RouteUrl(values);
      }

      public string RouteUrl(string routeName, object values)
      {
         return Helper.RouteUrl(routeName, values);
      }

      #endregion
   }{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

Now the controller that uses MasterLogic class can create instance with this simple code.

{{< highlight csharp "linenos=table,linenostart=1" >}}
masterLogic = new MasterLogic(new MvcRouteHelper(Url)){{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

For testing purpose I created another class that implements the IUrlHelper interface.

{{< highlight CSharp "linenos=table,linenostart=1" >}}
private class MyTestUrlHelper : IUrlHelper
{

   #region IUrlHelper Members

   public string RouteUrl(RouteValueDictionary values)
   {
      return RouteUrl((IDictionary<String, Object>)values);
   }

   public string RouteUrl(object values)
   {
      IDictionary<String, Object> dic = (IDictionary<String, Object>) values;
      return "/" + dic["controller"] + "/" + dic["action"];
   }

   public string RouteUrl(string routeName, object values)
   {
      return RouteUrl(values);
   }

   #endregion
}{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

It basically created url with a fixed rule, but the important thing that now I can test MasterLogic without worrying about someone changing routes, since I can inject my MyTestUrlHelper class into my MasterLogic class, here is a test.

{{< highlight xml "linenos=table,linenostart=1" >}}
[Test]
public void GrabMenuWithActionUrl()
{
   MasterLogic sut = new MasterLogic(new MyTestUrlHelper());
   List<MenuItem> menu = sut.CreateMenu("SampleFiles\\MenuType1.Xml").MenuItems;
   Assert.That(menu, Has.Count(2));
   Assert.That(menu[1].MenuItems[0], Has.Property("Url", "/Photo/ManageAlbum"));
}{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

You can complain that this is not mvc style of decoupling logic from the context, mvc has introduced the [System.Web.Abstractions](http://msdn.microsoft.com/it-it/library/system.web.httpcontextbase.aspx) namespace for doing this, but I still prefer this â€œold styleâ€ solution, because it works perfectly even for webforms. In classic asp.net applications when I need to access Session, or querystring or other context related data, I prefer to abstract everything with interfaces, so I can test outside the pipeline of IIS with little problem. The conclusion is that: if you want your classes to be testable, you should abstract every dependency with an interface, and not declare dependency to any concrete class.

alk.

Tags: [asp.net mvc](http://technorati.com/tag/asp.net%20mvc)
