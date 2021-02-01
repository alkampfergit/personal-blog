---
title: "ASpNEt handlers locked down in Windows 7 IIS"
description: ""
date: 2011-08-04T15:00:37+02:00
draft: false
tags: [ASPNET,IIS]
categories: [ASPNET]
---
I'm configuring a site on a new virtual machine and when I browse to a site, IIS gives me this error

> This configuration section cannot be used at this path. This happens when the section is locked at a parent level. Locking is either by default (overrideModeDefault="Deny"), or set explicitly by a location tag with overrideMode="Deny" or the legacy allowOverride="false".

I don't know why, but on this Windows 7 virtual machine it seems that this section of the configuration is locked. If you find this error you can simply open an elevated permission command prompt, go to the *C:\Windows\System32\inetsrv* directory and type the commands

*appcmd unlock config -section:system.webServer/handlers       
appcmd unlock config -section:system.webServer/modules*

and everything works again :)

Alk.
