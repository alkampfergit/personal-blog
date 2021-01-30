---
title: "Exposing WCF service without svc extension"
description: ""
date: 2013-03-12T07:00:37+02:00
draft: false
tags: [Castle,Wcf]
categories: [Castle]
---
I know, this is a weird requirement, but sometimes they appear in your backlog. The story is:  **as company XXX I want to expose a service based on WCF in IIS without having the.svc suffix in the address**. I’m actually using Castle Windsor WCF Integration to resolve my service class with castle, and it turns out that exposing a service without using standard.svc files it is just a matter of configure routing. This line of code is configuring the route of a specific name to a wcf service

{{< highlight csharp "linenos=table,linenostart=1" >}}


RouteTable.Routes.Add(
  new ServiceRoute("UiService", 
    new DefaultServiceHostFactory(IoC.GetContainer().Kernel), typeof(IUiService)));

{{< / highlight >}}

This indicates to Asp.Net engine that the UiService address route actually maps to the DefaultServiceHostFactory of Castle and it will be solved by the implementation of a IUiService. Remember that you need to enable  **aspNetCompatibilityEnabled** in your servicemodel section of web config and all the service should have the attribute

{{< highlight csharp "linenos=table,linenostart=1" >}}


    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]

{{< / highlight >}}

If you do not remember how to enable aspNetCompatibility it is just a setting in your web.config inside the ServiceModel section

{{< highlight xml "linenos=table,linenostart=1" >}}


    <serviceHostingEnvironment aspNetCompatibilityEnabled="True">

    </serviceHostingEnvironment>

{{< / highlight >}}

Now your service is exposed as a simple url, ex: [http://www.mysite.org/services/UiService](http://www.mysite.org/services/UiService)

Gian Maria.
