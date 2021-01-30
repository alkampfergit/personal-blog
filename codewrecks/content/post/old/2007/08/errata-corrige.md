---
title: "Errata corrige"
description: ""
date: 2007-08-06T14:00:37+02:00
draft: false
tags: [Nhibernate]
categories: [Nhibernate]
---
Thanks to my friend [Janky](http://blogs.ugidotnet.org/janky) for notice that I made a mistake in a [previous post](http://www.nablasoft.com/Alkampfer/?p=100). In that post I speak about a “conversation” but actually I was describing a UnitOfWork, that was my fault. The exact definition of a conversation is given in “Hibernate In Action” where Gavin King states that.

*“We call a unit of work that completes in several client/server request and response cycles a  **conversation** “.*

So a conversation is really a unit of work, but more complex than a standard one because it span several request, and naturally it use more than one NHibernate session.

Thanks again to janky for making me notice the error.

Alk.
