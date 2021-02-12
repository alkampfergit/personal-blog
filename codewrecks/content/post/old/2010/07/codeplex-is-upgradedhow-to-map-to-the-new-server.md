---
title: "Codeplex is upgraded-how to map to the new server"
description: ""
date: 2010-07-27T09:00:37+02:00
draft: false
tags: [Tfs]
categories: [Team Foundation Server]
---
My frient Guardian [blogged](http://www.primordialcode.com/blog/post/update-tfs-workspace-codeplex-upgrade-tfs2010) some minutes ago explaining how you can change the mapping of your codeplex project now that codeplex is migrated to TFS2010. There is even a simpler solution, first of all open Visual Studio, then connect to the new tfs server. As you can see in  **Figure 1** I have projects in three project collection, I select to connect to the TFS08 project collection where I'm contributor to two project

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2010/07/image_thumb19.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2010/07/image19.png)

 ***Figure 1***: *Connect to the new codeplex address*

Now, after you are connected to the right project collection, simply open the code from the local workspace that still maps to the old server, and Visual Studio should upgrade everything automatically. To verify if everything is ok, go to menu: *File â€“&gt; Source Control â€“&gt; Workspaces* and verify the server mapped in the workspace as in  **Figure 2**.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2010/07/image_thumb20.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2010/07/image20.png)

 ***Figure 2***: *The workspace has automatically changed server and now points to the right one.*

alk.
