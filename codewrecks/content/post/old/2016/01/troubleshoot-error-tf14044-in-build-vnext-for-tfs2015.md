---
title: "Troubleshoot Error TF14044 in build vNext for TFS2015"
description: ""
date: 2016-01-15T17:00:37+02:00
draft: false
tags: [build,Tfs]
categories: [Team Foundation Server]
---
I upgraded a TFS2012 to TFS2015 Update 1 at a customer site and  **one of the reason why the customer want to upgrade is the new build system introduced in TFS 2015**. Sadly enough, after the upgrade we created a simple build but it failed returning a permission error.

> TF14044: Access Denied: User Project Collection Build Service (TEAM FOUNDATION) needs the CreateWorkspace global permission(s).

We were really puzzled, because the user used to run the build (TFSBuild) was correctly set into the Project Collection Build Service account, and that group has all the permissions to create a workspace. We double check permissions for TFSBuild and Project Collection Build Service account and everything is ok, still the error was there.

[![Error of the build](https://www.codewrecks.com/blog/wp-content/uploads/2016/01/image_thumb6.png "Error of the build")](https://www.codewrecks.com/blog/wp-content/uploads/2016/01/image6.png)

 ***Figure 1***: *Error raised for any build created with the new build system*

After spending some time double checking all permissions for the various groups without any success I realized that **I did not read with attention error message TFS was giving to me**. The error is telling me: * **User** **Project Collection Build Service needs the CreateWorkspace* and the key is on the word User.

To solve this problem simply open the security page of the Project Collection and select the Users tab. In this screen you should be able to see all the users that belongs to the collection and you should find a couple of special users called  **Project Build Service (TEAM FOUNDATION) and Project Collection Build Service (TEAM FOUNDATION).** [![The two users related to the new Build System](https://www.codewrecks.com/blog/wp-content/uploads/2016/01/image_thumb7.png "Users of the build system.")](https://www.codewrecks.com/blog/wp-content/uploads/2016/01/image7.png)

 ***Figure 2***: *The two users related to new Build System*

It turned out that those two users really did not have correct permission to create a workspace (due to some security restriction) and they does not belong to the Project Collection Build Service TFS Group. To solve this problem simply  **add those two users (Project Build Service (TEAM FOUNDATION) and Project Collection Build Service (TEAM FOUNDATION)) to the Project Collection Build Service Group** , so they will have all needed permission to issue a build.

If you are curious why are there two special Users to run the build, the reason is the ability on the new build system to choose the level of authorization you need on the general tab.

[![Build Job authorization scope for new build system.](https://www.codewrecks.com/blog/wp-content/uploads/2016/01/image_thumb8.png "Build Job authorization scope for new build system.")](https://www.codewrecks.com/blog/wp-content/uploads/2016/01/image8.png)

 ***Figure 3***: *Build Job authorization scope for new build system.*

Choosing Project Collection scope is needed if the build needs to access data from multiple Team Projects, if the build operates in a single Team Project you can safely use the Current Project setting.

Gian Maria
