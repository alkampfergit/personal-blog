---
title: "Tfs2015 Build agent error Access denied xxxxxyyyyy needs Listen permissions for pool zzzzz to perform the action"
description: ""
date: 2015-05-09T08:00:37+02:00
draft: false
tags: [build,Tfs]
categories: [Tfs]
---
Tfs 2015 introduces a completely new and redesigned build system and one of the most important change is  **new lightweight agent system**. Instead of installing TFS and then configure Build,  **to create a new agent you only need to download a zip file, uncompress and launch a PowerShell script.** Another great advantage is the ability to run the agent as a service, or running it interactively in a simple console application.

If you configure a new agent you can check that everything is ok in TFS Control panel, in the new *Agent pools* tab. The new agent should be listed and it is Red if not active, Green if up and running.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2015/05/image_thumb.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2015/05/image.png)

 ***Figure 1***: *Management of Pool and Agent in TFS Configuration*

If the agent is red even if you launched the agent, you should check logs in the \_diag folder.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2015/05/image_thumb1.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2015/05/image1.png)

 ***Figure 2***: *Logs are placed in \_diag folder*

You should be able to understand and fix errors looking at the log. If you run the agent interactively, it could be that your user has no right permission to listen to the pool.

> 17:28:46.531831 Microsoft.TeamFoundation.DistributedTask.WebApi.AccessDeniedException: Access denied. CYBERPUNK\Administrator needs Listen permissions for pool Fast to perform the action. For more information, contact the Team Foundation Server administrator.

In this situation the user Administrator is in the TFS Administrator Group and it should have any permission, but new Build System is slightly different.  **The user that runs the agent, must be part of the Agent Pool Service Account** , or it will not be able to run the agent

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2015/05/image_thumb2.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2015/05/image2.png)

 ***Figure 3***: *Permissions for Agent Pools*

Simply adding the user to the AgentPoolService account should fix authorization problem

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2015/05/image_thumb3.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2015/05/image3.png)

 ***Figure 4***: *Agent is up and running.*

Gian Maria
