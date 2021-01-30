---
title: "Unable to create workspace after TFS upgrade a workspace already exists"
description: ""
date: 2015-02-26T18:00:37+02:00
draft: false
tags: [TFVC]
categories: [Team Foundation Server]
---
At a customer site we performed an upgrade from TFS 2010 to TFS 2013,  **moving from a computer in Workspace to a computer in Domain**. With this operation we finally  **defined a DNS name for tfs so all user can access it from tfs.company.local name, instead of using machine name**. After we performed the upgrade, all the user were warned of this change and we simply told them to recreate workspaces pointing to the new server.

After the upgrade some of the users were not able to create a workspace in the same location of the old workspace, Visual Studio complains because a workspace already exists in the same location.

Using  **tf workspaces** or  **tf workspace** commands did not solve the problem, even if we delete all workspaces associated to the user, when he try to recreate the workspace he get an error because a workspace already existed at that location.

After a brief investigation we found the reason. TFS instasnce was migrated from a workspace to a domain and some of the user in domain have the same name they have in workspace machine. Upgrading a TFS with backup and restore preserves everything,  **migrated TFS instance still contains old workspaces**.  **When one of the user try to create a new workspace in the same location on Disk, TFS complains because the old workspace is still there, but if we try to delete the workspace with the tf workspaces command it failed because it uses the new users, that is different, even if the name is identical**.

Whenever you have this kind of problem, the easiest solution is to download and install [TFS Sidekicks](http://www.attrice.info/downloads/index.htm#tfssidekicks2013), connect to TFS with an account that has administrative privilege, and verify all the workspaces that are configured in the system.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2015/02/image_thumb7.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2015/02/image7.png)

 ***Figure 1***: *Tfs Sidekicks in action, showing all workspaces defined in a Project Collection*

Thanks to this tools, we verified that even if we deleted old workspaces with command line, they are still there because the user, despite having the same name, are different. Deleting old workspaces from Sideckicks resolved the problem and users were able to recreate all workspaces.

If you have problems with workspaces, sidekicks is a really useful tool because it gives you a nice GUI tool to list, check, delete and manage all workspaces defined in your TFS.

Gian Maria.
