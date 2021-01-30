---
title: "Update GitVersion for large repositories"
description: ""
date: 2017-04-22T09:00:37+02:00
draft: false
tags: [build,Git]
categories: [Azure DevOps,Team Foundation Server]
---
As you know I’m a fanatic user of [GitVersion](http://www.codewrecks.com/blog/index.php/2015/10/17/integrating-gitversion-and-gitflow-in-your-vnext-build/) in builds, and  **I’ve** [**written a simple task**](http://www.codewrecks.com/blog/index.php/2016/03/17/writing-a-custom-task-for-build-vnext/) **to use it in a TFS Build automatically**. This is the typical task that you write and forget, because it just works and you usually not have the need to upgrade it. But there is a build where I start to see really high execution timing for the task, as an example GitVersion needs 2 minutes to run.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2017/04/image_thumb-7.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2017/04/image-7.png)

 ***Figure 1***: *GitVersion task run time it is too high, 2 minutes*

This behavior is perfectly reproducible on my local machine,  **that repository is quite big, it has lots of tags, feature branches and seems that GitFlow needs lot of time to determine semantic versioning**.

Looking in the GitHub page of the project, I read some issue regarding performance problem, the good part is that all performance problem seems to disappear with the newer version, so it is time to upgrade the task.

Thanks to the new build system, updating a task in VSTS / TFS is really simple, I just deleted the old GitVersion executable and libraries from the folder where the task was defined, I copied over the new Gitversion.exe and libraries and  **with a tfx build tasks upload command I can immediately push the new version on my account**.

Since I changed GitVersion from version 2 to version 3,  **it is a good practice to update the** [**Major number of the task**](http://www.codewrecks.com/blog/index.php/2017/02/04/task-versioning-for-tfs-vsts-build/) **, to avoid all build to automatically use the new GitVersion executables, because it could break something**. What I want is all build to show me that we have a new version of the task to use, so you can try and stick using the old version if Gitversion 3.6 gives you problems.

> Whenever you do major change on a TFS / VSTS Build task it is a good practice to upgrade major number to avoid all builds to automatically use the new version of the task.

Thanks to versioning, you can decide if you want to try out the new version of the task for each distinct build.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2017/04/image_thumb-8.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2017/04/image-8.png)

 ***Figure 2***: *Thanks to versioning the owner of the build can choose if  the build should be upgraded to use the new version of GitVersion task.*

After upgrading the build just queue a new build and verify if the task runs fine and especially if the execution time is reduced.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2017/04/image_thumb-9.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2017/04/image-9.png)

 ***Figure 3***: *New GitVersion executable have a real boost in performance.*

With few minutes of work I upgraded my task and I’m able to use new version of GitVersion.exe in all the builds, reducing the execution time significantly. Comparing this with the old XAML build engine and you understand why you should migrate all of your XAML Build to the new Build System as soon as possible.

Gian Maria.
