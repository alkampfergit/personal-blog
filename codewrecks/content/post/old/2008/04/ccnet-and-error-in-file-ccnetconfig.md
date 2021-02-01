---
title: "CCNEt and error in file ccnetconfig"
description: ""
date: 2008-04-02T00:00:37+02:00
draft: false
tags: [Uncategorized]
categories: [General]
---
Sometimes it happens that editing xml file ccnet.config you can made some mistake, if for example the xml is not well formed, the cc.net server simply ignore the change.

As a rule of thumb, when I make modification in ccnet.config file I stopped the server, modify the file and then launch ccnet.exe from commandline, in this way I can easily find any error in the config. When the config is ok I start the service again.

Alk.
