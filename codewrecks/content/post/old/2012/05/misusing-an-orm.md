---
title: "Misusing an ORM"
description: ""
date: 2012-05-12T06:00:37+02:00
draft: false
tags: [NoSql,ORM]
categories: [Software Architecture]
---
I’ve blogged some time ago that I’m starting to [consider ORM an Antipattern](http://www.codewrecks.com/blog/index.php/2011/10/27/square-peg-in-a-round-hole/), and recently Mr Fowler [posted similar thoughts](http://martinfowler.com/bliki/OrmHate.html) in his bliki, moreover I have the pleasure to be one of the organizer of the [first RavenDB official Course in Italy](http://ravendb.net/events/82/3-days-ravendb-training-in-italy), with my dear friend [Mauro](http://milestone.topics.it/) as teacher.

Since I’m strongly convinced that in a full OOP approach to problem **objects should not have nor setter nor getter** , most of the work and complexities of an ORM is simply not needed, because you usually retrieve objects from the storage with only one function  **GetById** and nothing else. In my long experience with NHibernate, I verified that most of the problem arise when you need to  **show data in UI in specific format and you start to write complex Query** in HQL or ICRiteria or LINQ, then you need to spend time with NHProfiler to understand if the queries are good enough to run on production system and when objects changes a little bit  **you need to rewrite a lot of code to suite the new Object Model.** This last point is the real pain point in DDD, where you usually should create Object Model that will be manipulated a lot before reaching a good point, after all the main value of DDD approach is being able to create a dialog with a DOMAIN EXPERT and it is impossible to find a good Object Models at the first tentative. If refactoring a model become painful, you are not allowed to modify it with easy, you are going away from DDD approach.

This is where [CQRS](http://codebetter.com/gregyoung/2010/02/13/cqrs-and-event-sourcing/) can help you, for all objects belonging to the domain you need only to Save, LoadById, Update and delete, because every read model should be defined somewhere else. In such a scenario an ORM is really useful, because if you need to store objects inside Relational Database you can leave the ORM all the work to satisfy the CRUD part, where the R is the method GetById.  **To start easily with this approach you can create SQL View or stored procedures for all the Read Models** you need; this imply that whenever the structure of the Domain Model changes, you need only to change all affected Read Models, some view and some stored procedure, but you have no need to refactor the code.

In this situation the ORM can really helps you, because if you change the Domain Model, you should only change the mapping, or let some Mapping by convention do this for you ([ConfORM](http://fabiomaulo.blogspot.it/2010/02/conform-nhibernate-un-mapping.html) for NH is an example), regenerate the database and update only affected Read Models. If your domain is really anemic, if you expose properties from objects, even only with getters, whenever you change a domain class you should answer the question “If I change this property, what other domain objects will be affected? How many service class will be affected? How many query issued from Views will be affected?”. If you are not able to create a Read Model with SQL View or stored procedure, you can write a denormalizer that listens for DOMAIN EVENTS and populate the Read Model accordingly. In my opinion this is the scenario where an ORM can really helps you.

In such a situation a NoSql database can dramatically simplify your life, because you do not need an ORM anymore, cause you are able to save object graps into the storage directly, and you can create Read Models with Map/Reduce or with denormalizers.

But sadly enough, ORM are primarily used to avoid writing SQL and persist completely anemic domain, where all the logic reside on services. In such a scenario it is  **easy to abuse an ORM** and probably in the long term the ORM could become much more a pain than a real help.

Gian Maria.
