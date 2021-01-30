---
title: "Pay attention to MembershipGetUser"
description: ""
date: 2007-05-16T02:00:37+02:00
draft: false
tags: [ASPNET]
categories: [ASPNET]
---
Yesterday I was looking at database usage made by some pages of a project that I’m coordinating. With the profiler I saw with horror that a page made about 40 query to the asp.net user database at every post or get. Inspecting the code I realized that the developer has inserted some row based logic for a gridview, He handled the RowDataBound event (fired once for each row) and in the code He calls Membership.GetUser(). Since most of the major scalability problems with asp.net applications derive from I/O it is better to reduce the calls to membership API function. A possible solution is using the session to cache user data, or if the session is not a suitable choice, it is possible to use httpcontext, in this way if a page is composed by several user control, and each one needs to interact with the membershipuser object, only the first call goes to the database, and subsequent one will find the object in memory.

Alk.
