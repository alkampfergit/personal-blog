---
title: "Parser Error Message Unable to generate a temporary class result1"
description: ""
date: 2008-04-04T08:00:37+02:00
draft: false
tags: [ASPNET]
categories: [ASPNET]
---
I’m moving one project on a new server, when I launched the site it gives me the error "*Parser Error Message: Unable to generate a temporary class (result=1)*" it turns out that the user used to run the worker process does not have access to windows temp directory…..but I supposed that windows temp directory is accessible to everyone.

I give IIS\_WPG full control over temp directory and everytingh works again

Alk.

Tags: [IIS](http://technorati.com/tag/IIS) [ASP.NET 2.0](http://technorati.com/tag/ASP.NET%202.0)
