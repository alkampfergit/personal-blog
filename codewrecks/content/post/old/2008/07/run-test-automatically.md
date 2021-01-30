---
title: "Run test automatically"
description: ""
date: 2008-07-15T01:00:37+02:00
draft: false
tags: [Testing]
categories: [Testing]
---
The third commandment of unit testing is “Run Test Automatically”, Do not rely on individual developers to run test, the temptation to avoid test run is behind any corner. Use some Continuous Integration tool like CC.NET to make all tests run on every check-in, and set the CC to broke the build if some test fails.

It is easy to setup a central system that runs your tests at every modification on the code, and most important, noone should check-in code that broke some tests, because it would be a regression of the software itself. A CC.NET can easily avoid such a situation.

Alk.

Tags: [CC.NET](http://technorati.com/tag/CC.NET) [Unit Testing](http://technorati.com/tag/Unit%20Testing)

<!--dotnetkickit-->
