---
title: "Visual Studio Database Edition First steps"
description: ""
date: 2009-05-27T08:00:37+02:00
draft: false
tags: [Sql Server]
categories: [Sql Server]
---
I began using Visual Studio Database Edition today, I did not used it before because Iâ€™m the only one in the team that have this edition, others developers used VS professional, but Iâ€™m the one who cares of database in this project, quite all modifications are done by myself, so I decided to create a DataBase Project.

I was amazed because in few seconds Visual Studio scanned developement database, and creates a database project where each database object is represented by a single.sql Files. I was ready to work in 5 minutes.

I was immediately amazed because VS solved a problem, I have a lot of old stored procedures in database, made by people that does not work anymore in the project, I needed a tool to verify if there are  stored that reference old tables deleted from database. When I try to build database project I got errors.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2009/05/image-thumb7.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2009/05/image7.png)

Cool, it is exactly what I needed, VS is telling me that there are database object that contains unresolved references, so I was able to delete all old garbage from the db. Then I simply did a Database Schema Compare between my project and My dev database and VS generates for me the script to sync the two. Great!!!

But the most important thing is that now I can edit my db inside visual studio, having everything under source control. Now it is the time to refactor my database.

Alk.

Tags: [Visual Studio](http://technorati.com/tag/Visual%20Studio) [.NET Framework](http://technorati.com/tag/.NET%20Framework) [Sql Server](http://technorati.com/tag/Sql%20Server)
