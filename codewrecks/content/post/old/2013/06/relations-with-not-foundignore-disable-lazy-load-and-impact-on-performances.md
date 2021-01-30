---
title: "Relations with not-foundrdquoignorerdquo disable lazy load and impact on performances"
description: ""
date: 2013-06-18T12:00:37+02:00
draft: false
tags: [Nhibernate]
categories: [Nhibernate]
---
NHibernate has a lot of interesting and specific option for mapping entities that can really cover every scenario you have in mind, but you need to be aware of every implication each advanced option has on performances.

If you are in a **legacy-database scenario where entity A reference Entity B, but someone outside the control of NHibernate can delete record from table used by Entity B, without setting the corresponding referencing field on Entity A**. We will end with a Database with broken reference, where rows from Table A references with a field id a record in Table B that no longer exists. When this happens, if you load an Entity of type A that reference an Entity of type B that was deleted, it will throw an exception if you try to access navigation property, because NHibernate cannot find related entity in the Database.

If you know NHibernate  **you can use the not-found=”Ignore” mapping option** , that basically tells NHibernate to ignore a broken reference key, if EntityA references an Entity B that was already deleted from database, the reference will be ignored, navigation property will be set to Null, and no exception occurs. This kind of solution  **is not without side effects** , first of all you will find that Every time you load an Entity of Type A another query is issued to the database to verify if related Entity B is really there. This actually disable lazy load, because related entity is always selected. This is not an optimum scenario, because you will end with a [lot of extra query](http://www.niceideas.ch/roller2/badtrash/entry/hibernate_s_not_found_ignore) and this happens because **not-found=”ignore” is only a way to avoid a real problem: *you have broken foreign-key in your database* **.

My suggestion is, fix data in database,** keep the database clean without broken foreign-keys and remove all not-found=”ignore” mapping option **unless you really have no other solution. Please remember that even if you are using NHibernate, you should not forget SQL capabilities. As an example SQL Server (and quite all of the relational database in the market) has the ability to** setup rules for foreign-key, es  **[** ON DELETE SET NULL **](http://msdn.microsoft.com/en-us/library/ms186973%28v=sql.105%29.aspx)** that automatically set to null a foreign key on a table, when related record is deleted**. Such a feature will prevent you from having broken foreign key, even if some legacy process manipulates the database deleting records without corresponding update in related foreign-key.

Gian Maria.
