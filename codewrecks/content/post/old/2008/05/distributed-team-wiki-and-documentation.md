---
title: "Distributed team 8211 wiki and documentation"
description: ""
date: 2008-05-30T01:00:37+02:00
draft: false
tags: [Experiences]
categories: [Experiences]
---
One of the key problem with a distributed environment is a good sharing of documentation. It is not important what kind of Lifecycle you can have, from waterfall to Extreme programming, you will have some sort of documentation that needs to be shared among team members. The format of this documentation can vary, it can be composed by word document, UML diagrams, and whatever you like but it must satisfy some key requirements

- It should be readily available to every member of the team
- You need in any moment to grab older version of the document
- You need to track revision of the document

all these requirements are well satisfied by a SCS like subversion. For this reason one repository on our subversion is dedicated to documentation. With subversion you can track when and who change the document, and you can make diff of word document with easy.

But this is not enough, there are some information that are really most important than others. For example, we have some windows services that run in a remote server, when someone find a bug he/she should be able to react immediatly, compile the new version and to a deploy…but deploy is not always a simple stuff to do, you should know where to deploy the service, how to make a smoke test to see if that everything is ok….so you need a deploy document. These kind of document can reside on the SCS, but I prefer to have a wiki where every developer can write these information.

In the home page of the wiki you find a list of the project, then you go into the project page and you will immediatly found key information of the project, I found that a wiki is really useful for distributed developement, and greatly improve communication. Quite often other developers ask me “hey, how can I do stuff XYZ” and I answer “It’s in the wiki, in the XYZ section :D

Wiki is especially useful to share technical information, as an example, DBA can write a simple page where he/she enlist some standard query for sql2005 to understand index fragmentation and index suggestion, so when a database begin to get slow as data increase, even a developer with basic skill of sql 2005 can do basic check to simply verify that some important index is missing or whatever else.

Wiki+SCS for document and source code is the backbone of the distributed team in my opinion

Alk.

Tags: [Distributed Team](http://technorati.com/tag/Distributed%20Team)

<!--dotnetkickit-->
