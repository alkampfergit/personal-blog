---
title: "Continuous integration in Team Foundation Service for Git based Team Project"
description: ""
date: 2013-02-25T08:00:37+02:00
draft: false
tags: [Git]
categories: [Visual Studio ALM]
---
Some weeks are passed from the announcement of TF Service support to Git based Team Projects, and  **Git is becoming first class citizen in the Team Foundation Server environment.** Last week the latest update to TF Service **introduced the ability to** [**create build for Git Based Repository**](http://blogs.msdn.com/b/visualstudioalm/archive/2013/02/12/run-ci-builds-in-your-git-team-project.aspx).

If you compare to a standard build (based on standard TFS Source control), Git based build is slightly different, the most important one is that **a single build can be used to build multiple branches**. This feature is available due to the fundamental difference in how source control is organized in distributed source control system, that permits you to avoid the paradigm of “branch is a special copy of a folder”. In the build definition  **you can specify a list of branches that you want to monitor with that build**.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2013/02/image_thumb9.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2013/02/image9.png)

 ***Figure 1***: *You can specify more than one branch as Triggered branches*

With this settings, the build will be triggered for both the master branch as well as the testBranch, but you are actually defining the build only once. With these settings,  **whenever I push commits to master or testBranch the build will start and it will integrate that branch**. This is a really cool feature especially for highly customized builds, because you can create a single definition to build all the branches you need avoiding the need of multiple identical build definition that differs only from the path of the sln to build.

Clearly Git based build definition has already the support for running unit test with the new agile test runner (runs xunit, nunit, mstest based tests) and it still lacks some features, such as integration with work items, that will be added in the future.

As you can see, Git is becoming first class citizen in the Visual Studio ALM toolset.

Gian Maria.
