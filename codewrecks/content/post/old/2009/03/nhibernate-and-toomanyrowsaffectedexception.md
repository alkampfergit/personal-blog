---
title: "NHibernate and TooManyRowsAffectedException"
description: ""
date: 2009-03-25T02:00:37+02:00
draft: false
tags: [Nhibernate]
categories: [Nhibernate]
---
Today I received a log of an error in a windows service that runs some scheduled actions, the error was * **TooManyRowsAffectedException** *and it is thrown by nhibernate when a session is flushed. The exact message said * **Unexpected row count: 2; expected: 1** *, after a little moment of confusion I immediately realize that the problem is due to a trigger.

I modified a table to keep a log of all modifications of every row, and I did this with a simple trigger that, for each update, saves the last value of each modified row in an history table. Since the trigger runs in the same context of the update operation, when you update a row, the trigger fired, insert a row in history table and the whole update operation returns 2 as the number of affected rows. NHibernate check the affected row count to verify that the row was really updated by the UPDATE statement, when he saw a rowcount of 2 he throws exception because something was wrong since it issue an update of a single row.

The obvious solution is to issue a ***SET NOCOUNT ON*  **at the beginning of the trigger and a** *SET NOCOUNT OFF***at the end. This is a good practice, because in this way the trigger does not affect the number of affected rows. After all the trigger should be completely transparent to the application, and this is the best way to achieve this result.

alk.

Tags: [NHibernate](http://technorati.com/tag/NHibernate) [Triggers](http://technorati.com/tag/Triggers)
