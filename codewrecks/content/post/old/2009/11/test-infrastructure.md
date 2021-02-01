---
title: "Test infrastructure"
description: ""
date: 2009-11-24T11:00:37+02:00
draft: false
tags: [Unit Testing]
categories: [Testing]
---
Unit tests must be as clearer as possible, I found that in standard project I'm working, I use nhibernate + stored procedures for massive operations. Most of the tests contains code to preload database, recreate structure or manage transaction, so, lot of time ago I decided to build some infrastructure to make this possible.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2009/11/image_thumb20.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2009/11/image20.png)

It makes my test really simple to read. This test use SqlServer, and it needs to be transactional, so every test run inside a Transaction, but I can specify more complex stuff

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2009/11/image_thumb21.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2009/11/image21.png)

I can ask to clear the database at each test, I can ask also to execute all the tests with integrity check disabled, and also I'm able to make the test impersonate specific user, belonging to specific role.

I know that spending some time, building an infrastructure for your test can give you great value.

Alk.

Tags: [Unit Testing](http://technorati.com/tag/Unit%20Testing)
