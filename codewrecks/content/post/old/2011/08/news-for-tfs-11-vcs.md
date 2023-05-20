---
title: "News for TFS 11 VCS"
description: ""
date: 2011-08-03T06:00:37+02:00
draft: false
tags: [Team Foundation Server,VCS]
categories: [Tfs]
---
In [this post of Mr. Brian Harry](http://blogs.msdn.com/b/bharry/archive/2011/08/02/version-control-model-enhancements-in-tfs-11.aspx) some of the news regarding TFS 11 VCS are unveiled. While there is still no DVCS, there are a lot of improvements with the introduction of *local workspaces*.

Actually TFS Workspaces status is kept on the server, so whenever you issue a GetLatest, the server check the status of the Workspace and send you only new data. This causes sometimes behavior that surprise most developer coming from other VCS like subversion. One of this surprising behavior is *delete a file from the file system, then issue a Get Latest, the file is not downloaded again*. This happens because the server does not know that you deleted the file, he still thinks that the file is there so you need to do a Get Specific version, or issue a [tfpt scorch](http://visualstudiogallery.msdn.microsoft.com/c255a1e4-04ba-4f68-8f4e-cd473d6b971f) command. Another aspect developers do not like is having Read-only file that needs to be checked out before starting to work with.

In Tfs 11 another type of Workspace is introduced, it is called *local workspace* and it is really different from other ones, because now it is the master so you can do whatever you like with files in the Workspace, delete, edit with notepad++, etc etc, this makes local workspace really similar to subversion local copies.

In the [original post](http://blogs.msdn.com/b/bharry/archive/2011/08/02/version-control-model-enhancements-in-tfs-11.aspx) there is also a video that shows some of these news, check-it.

alk.
