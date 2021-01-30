---
title: "Slow tests with nunit 24 and nhibernate"
description: ""
date: 2008-09-05T10:00:37+02:00
draft: false
tags: [Uncategorized]
categories: [Testing]
---
I noticed that when I used nunit 2.4 test runner it is really slower than 2.2. The reason is that in 2.4 the nunit test runner will use log4net as default logger, and if you do not disable logging, you will see in log tab an enormous amount of text.

The reason is that nunit used default log level of “DEBUG”, and this in turn means that nhibernate will run with full logging enabled, and this is a really waste of time because nhibernate really log everything with DEBUG level. The solution was (until version 2.6) to disable the log tab of the test runner, but in subsequent version this behavior seems to be corrected. So upgrade to the latest version if you experience slow tests with nhibernate and nunit 2.4.x where X &lt; 8 :D.

alk.
