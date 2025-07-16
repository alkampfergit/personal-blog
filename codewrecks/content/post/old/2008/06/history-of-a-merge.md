---
title: "History of a merge"
description: ""
date: 2008-06-05T00:00:37+02:00
draft: false
tags: [Experiences]
categories: [Experiences]
---
Source control management is the key to work on a team, but to work with it efficiently there is the need of experience. In a project, I’m working with some windows services that gather some data that is to be showed in a web application. I’m not supposed to work with the web application, that is developed by other two people of the team.

some days ago one of these programmer goes into big refactoring of the front end of the site, so he tells the other programmer not to modify a series of pages, to avoid conflicts. At the same time I was refactoring the database, I changed some stored procedures, and I move sorting and pagination in the server to speedup the application, this force me to do some little change on some pages.

After a couple of days, when the programmer attempts to check in all the files he changed, there were some conflicts with the page I modified in these two days…so he told me “you were not supposed to modify the front end part, now I have a lot of page to merge manually :(“

Problems like these needs to be analyzed to avoid that this situation will happen again in the future.

The first reason of the problem is * **lack of communication** *, if everyone in the team was told not to modify front end until the refactoring was not finished nothing whould happened. I have a lot of work to do, so there would be no problem for me waiting to modify the page.

The second reason is due to * **lack of explicit boundaries in the project** *, I work on the back end system, but there are no clear boundaries. In a project is important that the different parts are actually supervised by a referrer. In this way I can simply fire a issue for the project “use my new stored procedure xyz instead of WZY”, so I never had to touch the front end by myself. Moreover, since I worked on a part that is not under my supervision I should ask to the referrer “hey, can I make some modification in the front end?”, that was my mistake.

The third reason is * **lack of knowledge of tools** *, subversion and other SCS makes possible to impose a lock on files. If I see that some files are locked I can read the reason and decided to wait to apply my modification. Locks can be misused, but they are really useful when you need to tell the team “hey, these file should not be modified until I release them again”. It is a form to improve Communication.

In the end I want also to point out that it is better to do small check-in. Quite often, big refactoring can be divided into pieces. If you have to change the aspect of 50 pages in the project, there is no reason why you need to modify all 50 then do a checkin, it is better to modify each page at a time doing a commit for each page. I tend to prefer small check-in, as an example: correct a bug -&gt; checkin, add a new class to the project -&gt; checkin (because you are modifying the project file). I feel uncomfortable when more than a couple of hours passed without a checkin :D

Alk.

Tags: [Distributed Team](http://technorati.com/tag/Distributed%20Team)
