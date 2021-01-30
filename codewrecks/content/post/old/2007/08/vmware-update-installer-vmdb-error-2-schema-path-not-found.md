---
title: "VmWare update installer  Vmdb error -2 Schema path not found "
description: ""
date: 2007-08-06T22:00:37+02:00
draft: false
tags: [General]
categories: [General]
---
This morning I turn on a virtual machine, and when I try to change configuration a strange error (Vmdb error -2: Schema path not found ) appears. After a little search I discover that my server version is version 1.0.3 and the console is 1.0.2. The error turns out to be caused by the installer of the upgrade. Instead of upgrading the old link it install side by site newer version of the client and create a new link. Since I thought that my old link was upgraded I did not notice the mismatch.

I think that a warning would be useful, something saying “You are trying to connect to a server newer than the console”

Alk.
