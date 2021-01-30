---
title: "AspNet accessing network shared files returns Logon failure unknown user name or bad password"
description: ""
date: 2008-04-08T08:00:37+02:00
draft: false
tags: [ASPNET]
categories: [ASPNET]
---
Today I’m creating a simple page that needs access to a network shared file, when I ran the page asp.net gives me the error

> *Logon failure: unknown user name or bad password.*

this happens because the user used by IIS to run the page does not have permission to access the share, a quick solution is to use impersonation on web.config

{{< highlight xml "linenos=table,linenostart=1" >}}
<identity impersonate="true" userName="alkampfer" password="xxxx" />{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

A better solution is create a worker process for your site, run that process with a dedicated user, and finally give to that user access to network share, in my actual dev machine, with windows xp and iis5, I cannot create worker process nor different site, so I resolved to impersonate in web.config.

and then be sure that this user has access to network share. Be sure also that the user has the minimum access to every resource of the system, this to prevent that some security bug permits to a malicious user to create problem in the server.

alk.

Tags: [asp.net](http://technorati.com/tag/asp.net)
