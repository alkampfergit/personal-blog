---
title: "ASPNEt and ObjectDataSource"
description: ""
date: 2008-05-19T01:00:37+02:00
draft: false
tags: [ASPNET]
categories: [ASPNET]
---
I do not like very much the ObjectDataSource object of ASP.Net, but sometimes it gets useful, expecially when I already have a service class that extracts exactly the data you want. Today I did some cleanup on a project that is born with standard DAL with Enterprise Library and now Is evolving with nhibernate. I use my loved refactor to make some Safe Delete of old classes…I deleted 5 class that are not used anymore…but…..some of then are used through objectDataSource, so the project still compile well, but the site crash in a couple of page.

This is one of the reason I do not like ObjectDataSource, It use objects with reflection and you do not detect any error until runtime.

alk.

Tags: [ObjectDataSource](http://technorati.com/tag/ObjectDataSource)
