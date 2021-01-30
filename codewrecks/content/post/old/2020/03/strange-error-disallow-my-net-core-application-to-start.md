---
title: "Strange error disallow my NET core application to start"
description: ""
date: 2020-03-23T08:00:37+02:00
draft: false
tags: [General]
categories: [General]
---
Today I cloned in my workstation a.NET core application that works perfectly on my laptop, but when I started it I got this error

> An attempt was made to access a socket in a way forbidden by its access permissions

I’ve spent almost 10 minutes to find why my netsh rule is not working (I work with a user that is not administrator of the machine) and finally, by frustration I opened Visual Studio with administrator user, just to verify that the error is still there.

For whatever reason (I’ve not time to investigate right now) port 21000 is somewhat blocked by some firewall rule apparently, because it is free, but kesterel is continuing giving me that error even if runs as admin.

Changing port solved the issue, but left me puzzled :/

Gian Maria.
