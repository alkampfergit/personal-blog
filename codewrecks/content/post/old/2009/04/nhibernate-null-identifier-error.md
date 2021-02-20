---
title: "NHibernate 'null identifier' error"
description: ""
date: 2009-04-02T08:00:37+02:00
draft: false
tags: [Nhibernate]
categories: [Nhibernate]
---
Today I received a strange *null identifier* error when saving an object to db with nhibernate. Immediatly I realize that this error is caused by a Trigger INSTEAD OF INSERT, that apperars to broke the SCOPE\_IDENTITY() function. Since NHibernate uses SCOPE\_IDENTITY() to retrieve the id of the generated object, when you use INSTEAD OF INSERT Trigger the SCOPE\_IDENTITY() returns null, and nhibernate could not know the value of the inserted record.

I first tried to specify with &lt;sql.insert&gt; the query to use, to make use of @@identity, but it does not work. After some time I discovered a [issue](http://nhjira.koah.net/browse/NH-727) that was fixed only in the trunk. My only solution was removing the trigger (fortunately I can do it) because nhibernate does not permits me to use &lt;sql-insert&gt; with entities that use identity to generate ids.

Another good reason not to use identity with nhibernate, but my project is a legacy one where a lot of operations are massive ones performed by stored procedure.

alk.
