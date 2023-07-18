---
title: "Pills: Azure Devops auto agents update"
description: "One of my favorite features of Azure DevOps pipeline is the on-premise auto update agents."
date: 2023-07-18T08:10:42+02:00
draft: false
categories: ["AzureDevOps"]
tags: ["Pills"]
---


The ability to update Azure DevOps pipelines is a compelling feature, especially if you manage numerous on-premise agents. This feature eliminates maintenance issues by **allowing all agents to be upgraded with just a single click**.

![One click update button](../images/image1.png)
***Figure 1***: *One click update button*

I have an agent that runs only when needed, and it's slightly outdated. By simply clicking a button, I can prompt the server to update all the agents, and I'm sure that **after seconds I'm running latest agent version**.

![Agent is starting update](../images/image2.png)
***Figure 2***: *Agent is starting update*

The server sends an update command to all agents. If an agent is not updated to the latest version, it immediately starts updating itself. If it is running a pipeline **it will finish the current job before updating itself**.

After waiting briefly, the agent downloads the new version, updates itself, and restarts with the new version. Within seconds, the agent is up to date and operational. Depending on network speed, some agents might update before others, **but the beauty of it is that with just one click, everything happens automatically**.

![Agents updates one by one until everything is up to dat](../images/image3.png)
***Figure 23***: *Agents updates one by one until everything is up to date*

As evident in the previous image, one of the agents has already updated to the latest version, while another is still downloading it. After a short time, even the first agent has updated itself. Now, all agents in the pipeline are running the latest version. **This is crucial for large organizations with numerous on-premise agents**. If an agent is not up to date, it can end up running an extremely outdated version of the agent software, leading to build failures or erratic behavior.

Of course, you could use Microsoft's hosted agents you do not need to manage, but **for complex projects, it's standard practice to have on-premise agents**. This is particularly true when there are many prerequisites, or **when the agent needs to run on high-performance machines with NVMe disks and robust CPUs**. The auto-update feature is one of my favorite aspects of Azure DevOps Pipeline because it significantly reduces maintenance time.


Gian Maria.