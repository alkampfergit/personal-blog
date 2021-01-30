---
title: "Reassociated object has dirty collection"
description: ""
date: 2007-04-27T08:00:37+02:00
draft: false
tags: [Nhibernate]
categories: [Nhibernate]
---
Today I Hitted this exception working with NHibernate, after consulting some posts on the net I discovered that this exception is raised when a detached object is reattached to a session with lock and the object has a one-to-many relation that was changed. The strange thing is that the same code works perfectly on a test web site and throw this error in production site. Moreover I’m sure that the whole object graph is unchanged and that the collections is not changed

After a couple of minutes I realized that a control store a detatched object in asp.net session and reattach with session.lock…the problem is that in production code session state is managed in sql server, so the object graph is serialized, then deserialized at the next request and reattached with session.lock(). It seems that the operations of serialization and deserialization make nhibernate think that the collection of objects is somewhat changed.

Alk.
