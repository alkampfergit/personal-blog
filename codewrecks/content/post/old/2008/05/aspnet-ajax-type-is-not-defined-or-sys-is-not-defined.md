---
title: "AspNet Ajax Type is not defined or Sys is not defined"
description: ""
date: 2008-05-06T10:00:37+02:00
draft: false
tags: [ASPNET]
categories: [ASPNET]
---
Today I was developing a little asp.net user control with ajax functionality. The control should show a popup with some data and an image that is a preview of a site. Since getting the preview of the url (with a server external component) is time consuming process I simply setup a webservice and use scriptmanager to call the webservice function that does the work. This permits me to show to the user an image telling (“click here for PReview”) When the user click the image a new image is showed (“wait for preview to be generated”) and finally when the webservice function gives me the result I show the final image.

I included my javascript file into the ascx control, and I ran the page but I got “*Type is not defined*” exactly when I tried to define a Namespace in javascript. The problem arise because you should include your javascript files after the ones of the script manager, moreover I want the javascript file to be included only if the user control is used in the page.

The solution is to register webservice reference and script reference at runtime.

{{< highlight csharp "linenos=table,linenostart=1" >}}
  Protected Sub Page_PreRender(ByVal sender As Object, ByVal e As System.EventArgs) Handles Me.PreRender
      Dim scriptManager As ScriptManager = scriptManager.GetCurrent(Me.Page)
    If scriptManager Is Nothing Then
      Throw (New Exception("ASP.NET AJAX Required. Please add ScriptManager to the page."))
    End If

    Dim sr As New ScriptReference(AppUtils.AdjustLinkForVirtualPath("~/V2/scripts/PreviewAjax.js"))
     scriptManager.Scripts.Add(sr)
    Dim service As New ServiceReference(AppUtils.AdjustLinkForVirtualPath("~/Services/Preview.asmx"))
    scriptManager.Services.Add(service)
  End Sub
End Class
{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

As you can see the code Is really simple, I first get the reference to the current ScriptManager Object with the scriptManager.GetCurrent, throwing an exception if no ScriptManager is present on the page. Then I simply include the reference to my script and webservice. The function AppUtils.AdjustLinkForVirtualPath is used to handle the situation where the site is mounted in a subfolder of the main site.

With this method I’m sure that the script manager will include my scripts after the ajax.net ones and I can use all ajax client components in my scripts.

Alk.

Tags: [Asp.NET](http://technorati.com/tag/Asp.NET) [Ajax](http://technorati.com/tag/Ajax)
