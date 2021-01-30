---
title: "WCF services and silverlight"
description: ""
date: 2008-07-28T10:00:37+02:00
draft: false
tags: [Uncategorized]
categories: [General]
---
I’m doing the first steps with silverlight, and today I incurred in a very strange behavior. First of all I see that in my web project I can add WCF service or Silverlight-enabled WCF services. My first thought was…”why a wcf service should be different for silverlight”?

The only difference is that with a silverlight enabled wcf you will get a service already configured in a very specific way. First of all it does not use the separation of the interface, so you have only the service class like an old asmx service, moreover it configures web.config to use basicHttpBinding, because silverlight does not support ws\*, but the most important thing regards asp compatibility mode.

I deployed in my site a WCF service created in another Dll, I created.svc file, configured the web.config to use basicHttpBinding and called it from my silverlight application. The service use a Repository pattern based on nhibernate, so I have several session manager used in various scenario. The web is the simplest one, because you can use the famous [session per request pattern](http://www.hibernate.org/42.html). It turns out that my session manager seems not to work anymore, after a close inspection I found that HttpContext.Current is null inside the WCF service, so the session manager is not working properly.

This is a standard behaviour, because a WCF service has nothing to do with the concept of request, the fact that it is hosted by IIS indicates only that you want an endpoint in IIS. Since a WCF service can be hosted in a simple console, it has no sense to assume that it should have an HttpContext, even when hosted from IIS. As it is explained in [this article](http://msdn.microsoft.com/en-us/library/aa702682.aspx), you can request IIS to host the service in “Asp.NEt compatibility mode”, that is the default if you create a silverlight-enabled WCF service. This is obtained through a configuration in web.config

{{< highlight xml "linenos=table,linenostart=1" >}}
<serviceHostingEnvironment aspNetCompatibilityEnabled="true"/>{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

But this only enable the compatibility mode for the site, now each service should declare if he can run in this mode, to make a service compatible you can declare its implementation in this way.

{{< highlight chsarp "linenos=table,linenostart=1" >}}
[AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
public class TestServer : IExtTest{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

If you specify Allowed, the service will run in compatibility mode or not, if you specify Required or NotAllowed the service can be run only if the compatibilityMode is enabled or disabled respectively.

Alk.

<!--dotnetkickit-->

Tags: [wcf](http://technorati.com/tag/wcf) [Silverlight](http://technorati.com/tag/Silverlight)
