---
title: "Task versioning for TFS  VSTS Build"
description: ""
date: 2017-02-04T13:00:37+02:00
draft: false
tags: [build]
categories: [Team Foundation Server]
---
The build system of TFS / VSTS, introduced with TFS 2015, is evolving quite fast and release after release is always full of interesting new features. One of my favorites is the  **simple extention point to write a custom task to perform custom operation**. The whole process is really simple and is [described in this post.](http://www.codewrecks.com/blog/index.php/2016/03/17/writing-a-custom-task-for-build-vnext/)

One of the major problem when you manage a task is versioning, because you can have lots of builds using that task and  **if an update require to break the compatibility with the past, releasing a new version can really be a nightmare of many broken build**.

> Whenever you update a build task, there are many builds that are using it and if you introduce breaking changes, you risk to break all the builds that are using that task.

This is not a problem in VSTS / TFS, because a nice versionig control is in place; if you open a build you can find a flag near some build tasks.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2017/02/image_thumb.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2017/02/image.png)

 ***Figure 1***: *Alerting on task that warn you about a new version of the task.*

In  **Figure 1** you can find that a purple flag is telling you that you are using an old version of the task and that there are newer version available. This happens because a  **major version is available, but to preserve compatibility, existing build still uses the old version.** If you look at task detail you can choose the version to use, as shown in  **Figure 2** [![SNAGHTMLf0c767](http://www.codewrecks.com/blog/wp-content/uploads/2017/02/SNAGHTMLf0c767_thumb.png "SNAGHTMLf0c767")](http://www.codewrecks.com/blog/wp-content/uploads/2017/02/SNAGHTMLf0c767.png)

 ***Figure 2***: *Choose version of task to use in the build*

As you can see, **you do not need to select an exact version, instead you can choose only the MAJOR version of the task** , according to [Semver](http://semver.org/). This logic follows semantic versioning, that states: *whenever a breaking changes occurs, you need to change Major number.* TFS / VSTS Build system assumes that a task, until a major version is not changes, is fully compatibile so it always uses the most recent version of that major.

> When upgrading your custom task, update the major number if you are introducing breaking changes, this will prevent existing build to automatically use the new version.

This works not only with built-in tasks, but the same method works for any task, so,  **whenever you need to introduce some breaking changes in your custom build task, be sure to increment the major version**. This will prevent existing build to use the new version, so you can upload the task in your account without problem. Once the new version is uploaded you can migrate each build without the risk of a big bang upgrade.

 **Also, if you find bug in an older version, you can still increment minor or patch number to fix task for all build that still uses old version**. If you are at version 3.x.x but some builds still uses 2.x.x, if you need to fix a bug in that version you can simply patch version 2.x.x, assign number 2.x.x+1 (increment patch) and then upload the task.

> Due to TFS /VSTS task versioning, I strongly suggests you to use GitFlow to develop your task, so it is easy for you to patch older version if needed.

 **If you include release notes in task.json you will also give the user information on what was changed.** [![image](http://www.codewrecks.com/blog/wp-content/uploads/2017/02/image_thumb-1.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2017/02/image-1.png)

 ***Figure 3***: *Task.json file with release notes*

Release notes are shown in the Build ui when you select specific version, and this can be used to give details on what is changed to explain why the major version is changed.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2017/02/image_thumb-2.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2017/02/image-2.png)

 ***Figure 4***: *Release notes for the task are shown on the UI during build edit.*

Version checking will really made management of build task a breeze.

Happy TFS / VSTS.

Gian Maria
