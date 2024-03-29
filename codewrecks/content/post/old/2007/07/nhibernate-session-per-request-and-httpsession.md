﻿---
title: "NHibernate session per request and HTTPSEssion"
description: ""
date: 2007-07-12T01:00:37+02:00
draft: false
tags: [Nhibernate]
categories: [Nhibernate]
---
In an [old post](http://www.nablasoft.com/Alkampfer/?p=13) I talked about a strange error I had in a web  site. The last time I simply changed the logic not storing entities in httpsession anymore, now I face this error again and I decided to solve it. The problem is in the *session per request pattern* that I use to share nhibernate session for a whole request. My implementation of Session Per Request simply create a nhibernate session, start a transaction and commit or rollback the transaction with an HTTP Module that intercepts EndRequest Event. The error happended when I store entities in httpsession and the sessionstate is stored into sql server.

I have two entities, let’s call them Section and SectionLocalization. The section entity has a dictionary of SectionLocalization objects, indexed by a string that represent a langcode. The SectionLocalization objects are value object, so their lifecycle is determined by the owning Section. In a page I need to work a lot with a list of Section, to maximize performance I retrieve the list of Section from the database with a Nhibernate criteria, then I store the IList&lt;Section&gt; object in HTTP section since it will be used in read only mode for several postback. The problem arise when I add a new Section: I simply create a new Section, put into it some SEctionLocalization objects, then use session.Save() to persist and I also add the section to the IList&lt;Section&gt; actually stored in httpsession. When I need to modify a section object I simply reattach the object to nhibernate session with Session.Lock() since I’m sure that the object is not modified, then I modify the object and when EndRequest fires the changes are propagated to the database. When I try to change the new object I get “Reassociated object has dirty Collection” exception.

The problem is not showing if I use in memory asp.net session, so it should be caused by session serialization. The problem turns to be caused by the Session Per Request pattern. When I create new section object and save it into session this is the general flow of the operation.

![External Image](https://www.codewrecks.com/blog/wp-content/uploads/2007/07/071207-0853-nhibernates12.png)

The problem is the following, when I call session.save() nhibernate saves into database the section object because it has an autogenerated id, but section localization objects are value object and gets not saved at that time. Then I add the section into the list stored into HTTPSession and then this list gets serialized to store it into SQLServer, at that time the SectionLocalization objects of the new section are still unsaved, and  **they gets serialized in this state**. When EndRequest fires the session per request pattern commits the transaction, nhibernate session flushes all pending operations and SectionLocalization objects contained in the new section gets saved into db. At the next request, the list of section gets deserialized from the database, and the Section object created in the previous request still have the SectionLocalization objects in new state, because they were serialized  **before nhibernate persists them to database**. When I try to reattach the object with Session.Lock() the collection is found to be dirty.

After some investigation it turns out that to implement correctly the session per request pattern I need also to intercept the *PostRequestHandlerExecute* event, that gets fired immediately after the end of the execution of the page, and before serialization of the http session takes place. In this event I simply call session.flush() to be sure that all pending operation are completed before the serialization of the HTTPsession.

The conclusion is to pay great attention to “open in request pattern” when you store some entities into the httpsession that gets serialized (Sql server, out of proc), because the entities stored in httpsession get serialized while nhibernate session has still pending operations, so they will be stored with an inconsistent state.

Alk.
