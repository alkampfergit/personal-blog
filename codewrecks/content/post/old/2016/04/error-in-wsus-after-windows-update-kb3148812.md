---
title: "Error in WSUS after Windows Update KB3148812"
description: ""
date: 2016-04-25T07:00:37+02:00
draft: false
tags: [General]
categories: [General]
---
I have a test lab with a Windows Server 2012 R2 domain controller, and one of the feature I like the most is WSUS, that allows me to spin of an update new Virtual Machines without the need to wait for all Windows Update to be downloaded from the Internet.

Yesterday I noticed that  **suddently the WSUS service stopped working** , a couple of Test VS gaves me error trying to connect to the update service, and in the WSUS Server the service was indeed stopped.

After a look in Event Viewer I was able to track down that the reason is the database is not operational. I **fired Sql Server Management studio and connected to the internal database** with the address

{{< highlight bash "linenos=table,linenostart=1" >}}


\\.\pipe\Microsoft##WID\tsql\query

{{< / highlight >}}

And noticed that the  **WSUS Database was in Recovering state** , the bad stuff is that I restored a previous backup but the problem did not go away. After a quick search I found [that someone blamed the update KB3148812](https://community.spiceworks.com/topic/1567653-heads-up-kb3148812-for-wsus-servers) to be the cause of this problem. After uninstalling that update and rebooting the server the issue went away.

Gian Maria.
