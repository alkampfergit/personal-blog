---
title: "Build vNext distributing load to different agents"
description: ""
date: 2015-06-06T09:00:37+02:00
draft: false
tags: [build,devops]
categories: [Tfs]
---
One of the major benefit of the new build infrastructure of TFS and Visual Studio Online is the  **easy deployment of build agents**. The downside of this approach is that your infrastructure become full of agents, and you should have some way to  **determine which agent(s) to use for a specific build.** The problem is:

> avoid running builds in machines that are “not appropriate” for that build.

## Running on a specific agent

If you are customizing a build, or if you are interested in running the build on a specific agent in a specific machine (ex: local agent), the solution is super easy, Just edit build definition and in General tab add a * **demand** *named Agent.Name with the value of the name of the specified Agent.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2015/06/image_thumb.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2015/06/image.png)

 ***Figure 1***: *Adding a demand for a specific agent*

If the agent is not available, you are warned when you try to queue the build.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2015/06/image_thumb1.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2015/06/image1.png)

 ***Figure 2***: *Warning on build queuing when there are agents problem*

In this situation  **the system is warning me that there are agents compatible to the build, but they are offline**. You can queue the build and it will be executed when the Agent will be online again, or you can press cancel and understand why the agent is not online.

> <font>If you want to run a build on a specific agent, just add <em>Agent.Name</em> demand on the build.</font>

## Specifying demands

The previous example is interesting because it is using Build Demands against properties of the agent. If you navigate on build agent admin page,  **for each agent you are able to see all associated properties**.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2015/06/image_thumb2.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2015/06/image2.png)

 ***Figure 3***: *Agent capabilities*

On top there are User Capabilities that are editable. They are used to give custom capabilities to your agents. In bottom part there are  **System Capabilities, automatically determined by the agent itself and thus cannot be changed**. If you examine all these capabilities you can see interesting capabilities such as VisualStudio that tells you if the agent is installed on a machine where Visual Studio is installed, other capabilities are also used to verify exact version of Visual Studio.

This is really important, because if you examine demands for a build you can verify that some of them are  **already placed in the build definition and they could not be removed**.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2015/06/image_thumb3.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2015/06/image3.png)

 ***Figure 4***: *some of the demands are read-only, you can add your demand*

If you wonder why the build has some predefined, readonly demands, the answer is:  **they are taken from the build definition**.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2015/06/image_thumb4.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2015/06/image4.png)

 ***Figure 5***: *Build definition*

If you look at the build definition, it contains a Visual Studio Build task, and it is this block that automatically adds the visualstudio demands on the build. This explain why that demand cannot be removed, it is required from a Build Step. You can  **try to remove Visual Studio Test task, and you can verify that the vstest demands is also gone**.

> <font>Each Build Task automatically adds demands to be sure to run in compatible agents.</font>

In my example I have some agents deployed on my office; they are used to run tests on some machines, and I use them to run build definitions composed only by build and test tasks, but  **no publish build artifacts.** The reason is: I have really low upload bandwidth on my office, but I have fast machine on really fast SSD and tons of RAM so they are able to quickly build and test my projects.

Then I have some build used to Publish Artifacts, and I want to be sure that those build are not executed on agents in my office or they will saturate my upload Bandwidth. To avoid this problem I simply add * **uploader** *demands on these builds, and manually add this capability to agents deployed on machine that have no problem with Upload Bandwidth, Ex on agents deployed on Azure Virtual Machines.

> <font>You can use custom Demands to be sure that a build runs on agents with specific capabilities.</font>

## Using Agent pools to separate build *environments*

The final solution to subdivide works to your agent is using agent pools. A pool is similar to the old concept of controller, each build is associated to a default pool, and it can be scheduled only on agents bounded to that pool.  **Using different pools can be useful if you have really different building environments, and you want to have a strong separation between them**.

A possible example is, if you have agents deployed on fast machines with fast SSD or RAMDisk to speedup build and testing, you can create a dedicated pool with a name such as *FastPool.*Once the pool is created  **you can schedule high priority build on that pool to be sure that the build will be completed in the least amount of time**. You can further subdivide agents in that pool using capabilities, such as: *SSD, RAMDISK, etc.*

You can also create a pool called “Priority” to execute build with high priority and being sure that some slow build does not slow down high priority build and so on. If you have two different offices located very far away you can have a different pool for each office, to be sure that some builds are executed in local network for that office and so on.

> With Agent Pools you can have a strong separation between your build Environment.

To conclude this post, you should use Agent Pools if you want to achieve strong separation and you are creating distinct *Build Environment*that shares some common strong characteristic (phisical location, machine speed, priority, etc). Inside a poll you can further subdivide work among agents using custom demands.

As final notice, as of today, with the latest update of VSO, the new build engine is not anymore in preview, the tab has no Asterisk anymore and the keyword PREVIEW is gone away :), so vNext in VSO reached GA.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2015/06/image_thumb5.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2015/06/image5.png)

Gian Maria.
