---
title: "Build a menu for aspnet mvc site"
description: ""
date: 2009-04-14T08:00:37+02:00
draft: false
tags: [AspNet MVC]
categories: [AspNet MVC]
---
I have a little site with mixed webform and mvc pages, and I need a simple way to create a main menu. Since asp.net mvc have the concept of controllers and action I like to express my menu with a simple xml file like this.

{{< highlight xml "linenos=table,linenostart=1" >}}
<?xml version="1.0" encoding="utf-8" ?>
<menu>
   <submenu text="administration">
      <url url="/Login.aspx" text="Login Page" />
      <url url="/CreateUser.aspx" text="Registration Page" />
   </submenu>
   <submenu text="Web Forms">
      <url url="/Photo/PhotoAlbumManager.aspx" text="Album manager" />
      <url url="/Photo/AlbumSearch.aspx" text="Album Search" />
      <url url="/Photo/AlbumSearchPr.aspx" text="Album Search Pr" />
   </submenu>
   <submenu text="MvcSite">
      <action controller="PhotoManager" action="ManageAlbum" text="Album Manager" />
   </submenu>
</menu>{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

This xml has a really simple structure, it have root node called menu, then a set of submenu and finally url node or action node, i use url node for classic asp.net pages, and action node for asp.net mvp pages. I like the Idea of Action Node, because it is more mvc like than express a simple route. Moreover If we change routing structure I need not to change a single line of the menu, because links are expressed in forms of Controller and action.

The first thing to do is creating a model capable of parsing this file and building a list of object that can be used from the view engine. I decided to create a couple of classes to represent a menu in memory

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2009/04/image-thumb3.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2009/04/image3.png)

The MasterModel classes has the responsibility to create data for the master page. In this version it has only the CreateMenu function that can be used to parse the xml files with the menu and create a root menuitem class. The MenuItem has a method called Render that is capable to render an anchor link with the corresponding page. The good part is that the real url is created with the UrlHelper class

{{< highlight chsarp "linenos=table,linenostart=1" >}}
         else if (element.Name == "action")
            return new MenuLink(
               element.Attribute("text").Value, 
               Url.RouteUrl("Default", new 
               {
                  controller = element.Attribute("controller").Value,
                  action =  element.Attribute("action").Value, 
               }));{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

Since Iâ€™m doing partial rendering, I do not want each action in the controller to render the menu, so I create a base controller with this property

{{< highlight csharp "linenos=table,linenostart=1" >}}
      public MenuItem RootMenu
      {
         get { return rootMenu ?? (rootMenu = MasterModel.CreateMenu(Path.Combine(Global.PhysicalPath,"WebMvcSitemap.Xml"))); }
      }
      private MenuItem rootMenu;{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

As you can see, only when I access the MenuItem object the menu gets reconstructed. In this version there is no cache, so the file is read each time the menu needs to be rendered, but it is good enough for now. When I call an action that needs to render the whole page I simply access the RootMenu property to create and pass to the view menudata

{{< highlight csharp "linenos=table,linenostart=1" >}}
public ActionResult ManageAlbum(Guid? id, Int32? pageid, Int32? pagesize)
{
   AlbumManager model = new AlbumManager();
   model.MainMenu = RootMenu;{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

With the above code I reconstruct the menu and passed to the view in the MainMenu property. When I call an action that needs only to render partial part of the page, I simply avoid to set the MainMenu property, and the menu gets not reconstructed, since the view needs to do partial rendering it has no master page and so it does not access the menu part. Finally I created a simple view that is able to render the menu as a series of nested &lt;ul&gt; tags and called it in the master page.

Code is contained in photoalbum project (Subversion address: [http://dotnetmarcheproject.googlecode.com/svn/trunk/src/Projects/DotNetMarche.PhotoAlbum](http://dotnetmarcheproject.googlecode.com/svn/trunk/src/Projects/DotNetMarche.PhotoAlbum "http://dotnetmarcheproject.googlecode.com/svn/trunk/src/Projects/DotNetMarche.PhotoAlbum"))

alk.

Tags: [Asp.Net MVC](http://technorati.com/tag/Asp.Net%20MVC)
