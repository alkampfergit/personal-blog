---
title: "Intercept events from HttpModule"
description: ""
date: 2007-07-03T22:00:37+02:00
draft: false
tags: [ASPNET]
categories: [ASPNET]
---
This morning I was reading an interesting article ([http://msdn2.microsoft.com/en-us/library/9z52by6a.aspx](http://msdn2.microsoft.com/en-us/library/9z52by6a.aspx)) on how to perform custom authentication in a webservice. This article is interesting but actually does not run “as is”, it miss a little part, the Global.Asax code that listen for the HttpModule Event. The question is “*How can I listen to an event raised from an Http module if the instance of that module is created by asp.net engine?”*. The answer is not so intuitive, because each event raised from an httpmodule can be intercepted by global.asax with a not so evident autowiring. It turns out that if you want to listen for an event raised from httpmodule you have to create a method in global.asax that match the signature of the event and name it with this pattern *modulefriendlyname\_eventname*. In the example of the above article I enabled the event with this code in web.config

&lt;httpModules&gt;  
&lt;addname=“Auth“type=“Microsoft.WebServices.Security.WebServiceAuthenticationModule“/&gt;  
&lt;/httpModules&gt;

It turns out that in my global.asax I can listen for the event with this code.

protectedvoid  Auth\_Authenticate(Object  sender,  WebServiceAuthenticationEvent  e)  {  
  
//Your  code  here  
}

Alk.
