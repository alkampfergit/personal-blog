---
title: "LINQ expression tree and linq to nhibernate"
description: ""
date: 2008-04-09T23:00:37+02:00
draft: false
tags: [NET framework]
categories: [NET framework]
---
When I first begin investigating lambda expressions I was fascinated by expression tree, so I decided to spent some time familiarizing with them. I try to create an alternate implementation of LINQ to NHibernate, I started from the excellent project of [Ayende](http://www.ayende.com) and I tried to create a new implementation from scratch. It is far from being a real and usable library, but it could be interesting to see how expression trees works. you can find it in subversion [http://nablasoft.googlecode.com/svn/trunk/NHibernate.Linq.Alt](http://nablasoft.googlecode.com/svn/trunk/NHibernate.Linq.Alt "https://nablasoft.googlecode.com/svn/trunk/NHibernate.Linq.Alt").

Most of the tests and the northwind domain as well some pieces of code are taken from linq 2 nhibernate of Ayende, and my version is only an experiment, trying to play around with expression tree. Most of the test still failed, but if you want to see some Expression tree manipulation the code could be interesting.

Alk.

Tags: [LINQ](http://technorati.com/tag/LINQ) [Expression Tree](http://technorati.com/tag/Expression%20Tree)
