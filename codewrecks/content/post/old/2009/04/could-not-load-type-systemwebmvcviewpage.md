---
title: "Could not load type 8216SystemWebMvcViewPageltltgtrsquo"
description: ""
date: 2009-04-05T04:00:37+02:00
draft: false
tags: [AspNet MVC]
categories: [AspNet MVC]
---
First of all thanks to [Andrea Balducci](http://dotnetmarche.org/blogs/andreabalducci/) that gave me this solution. I have a asp.net application where I enabled Asp.Net mvc following a link in the web. Everything works well until I try to use Strongly Typed View. When I try to have a page that inherits from ViewPage&lt;T&gt; where T is one of my model the system gave me an error of type

> Could not load type ‘System.Web.Mvc.ViewPage&lt;â€¦&gt;

In a asp.net site created with the wizard everything works ok. I check both web.config to be sure that actually I did not forgot anything, then I stumble across [this post](http://blog.benhall.me.uk/2009/01/aspnet-mvc-rc1-removing-code-behind.html). Basically I need to modify Page directive of my web config in this way

{{< highlight xml "linenos=table,linenostart=1" >}}
<pages 
     pageParserFilterType="System.Web.Mvc.ViewTypeParserFilter, System.Web.Mvc, Version=1.0.0.0, Culture=neutral, PublicKeyToken=31BF3856AD364E35" 
     pageBaseType="System.Web.Mvc.ViewPage, System.Web.Mvc, Version=1.0.0.0, Culture=neutral, PublicKeyToken=31BF3856AD364E35" 
     userControlBaseType="System.Web.Mvc.ViewUserControl, System.Web.Mvc, Version=1.0.0.0, Culture=neutral, PublicKeyToken=31BF3856AD364E35"> 
{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

I really do not understand why the site created with the asp.net wizard works because it does not have this directive, then Andrea told me to chek the View directory, because it has a dedicated web.config. Here is the solution. The view directory must contains a web.config like this

{{< highlight xml "linenos=table,linenostart=1" >}}
<?xml version="1.0"?>
<configuration>
   <system.web>
      <httpHandlers>
         <add path="*" verb="*"
             type="System.Web.HttpNotFoundHandler"/>
      </httpHandlers>

      <!--
        Enabling request validation in view pages would cause validation to occur
        after the input has already been processed by the controller. By default
        MVC performs request validation before a controller processes the input.
        To change this behavior apply the ValidateInputAttribute to a
        controller or action.
    -->
      <pages
          validateRequest="false"
          pageParserFilterType="System.Web.Mvc.ViewTypeParserFilter, System.Web.Mvc, Version=1.0.0.0, Culture=neutral, PublicKeyToken=31BF3856AD364E35"
          pageBaseType="System.Web.Mvc.ViewPage, System.Web.Mvc, Version=1.0.0.0, Culture=neutral, PublicKeyToken=31BF3856AD364E35"
          userControlBaseType="System.Web.Mvc.ViewUserControl, System.Web.Mvc, Version=1.0.0.0, Culture=neutral, PublicKeyToken=31BF3856AD364E35">
         <controls>
            <add assembly="System.Web.Mvc, Version=1.0.0.0, Culture=neutral, PublicKeyToken=31BF3856AD364E35" namespace="System.Web.Mvc" tagPrefix="mvc" />
         </controls>
      </pages>
   </system.web>

   <system.webServer>
      <validation validateIntegratedModeConfiguration="false"/>
      <handlers>
         <remove name="BlockViewHandler"/>
         <add name="BlockViewHandler" path="*" verb="*" preCondition="integratedMode" type="System.Web.HttpNotFoundHandler"/>
      </handlers>
   </system.webServer>
</configuration>{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

Thanks again to Andrea for the solution.

alk.

Tags: [ASP.NET Mvc](http://technorati.com/tag/ASP.NET%20Mvc)
