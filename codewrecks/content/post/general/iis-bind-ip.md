---
title: "Avoid IIS to use all of your IP and other amenities"
description: "In developers machine, sometimes you need to use the same port from many programs and this can be a problem if you are using IIS"
date: 2021-03-15T22:00:00+02:00
draft: false
tags: ["IIS"]
categories: ["Programming"]
---

Let's suppose you have a Microservices based solution, you have many different processes and each process communicates with standard WebAPI. The usual developer solution is **using a different port for each different program**, this lead to http://localhost:12345, http://localhost:12346 and so on. This is far from being optimal, because in production, probably, each service could potentially be exposed with a different hostname, something like https://auth.mysoftware.com, https://orders.mysoftware.com and so on. Another problem is that, in production, everything **must be exposed with https** and too many times developer are not testing with TLS enabled.

> I strongly prefer using a developing environment similar to production one, this is the reason why I always use TLS for services and always with certificates that are valid for the machine.

Using https everywhere in a developer machine is not a problem using some interesting utilities like [mkcert](https://github.com/FiloSottile/mkcert), the usual problem is that **IIS or the first microservice that starts, bind to port 443 so you are forced to use different port for TLS for each service**... Or no?



{{< highlight yaml "linenos=table,linenostart=1" >}}

{{< / highlight >}}


Gian Maria.