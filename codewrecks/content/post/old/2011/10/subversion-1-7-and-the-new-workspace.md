---
title: "Subversion 17 and the new workspace"
description: ""
date: 2011-10-21T07:00:37+02:00
draft: false
tags: [VCS]
categories: [Tools and library]
---
Subversion 1.7 has a new format of the workspace, the first important stuff is that there are not a.svn folder for each mapped folder, but it has only a single.svn folder in the root of the local mapping of the repository. This lead to a tremendous improvement in performance with very big repository. Actually doing an update from my SSD on a project that has thousands of folder is almost instantaneous. Just install the new version of tortoise, update the local workspace and you are done.

This demonstrates how much important it has the decision on how to map server data with local version in a  Version Control System. The old workspace in Subversion, really suffer from poor performance when you have a lot of folders and really big repository, caused from a huge amount of disk reads to find and read all.svn folders scattered all around the repository. In a project where I’m working, people with a  standard 7.200 RPM old disk, waits for almost a minute before the client was able to start downloading update from the server, and the pc is freezed due to the massive disk access. In my system with an SSD it taked 4 seconds, but now it is instantaneous.

I’m forcing all other dev to update :), so if you still use tortoise svn older than 1.7.x please take your time to update.

Gian Maria.
