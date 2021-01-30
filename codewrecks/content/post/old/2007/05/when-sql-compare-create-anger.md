---
title: "When sql compare creates anger"
description: ""
date: 2007-05-03T10:00:37+02:00
draft: false
tags: [Sql Server]
categories: [Sql Server]
---
I enabled session store in database in a test server, the application is ok and after some test I proceed to store the session in database even in the production site. I create a new session state database into the production server and I copy structure doing a synchronization with session state database of the test server. The application stops to work, whenever I ask for a page the server returns a blank page and nothing is showed on the browser. After investigating log files I checked that asp.net still search state database with the name of the database in temp server. The problem originates from the fact that all the stored procedures that are in session state server use three part name. Golden rule is that asp.net session store database and authentication database should be created using aspnet\_regsql.exe and not with a synchronization procedure from an existing database.

Alk.
