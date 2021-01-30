---
title: "Adding more than one build agent in VSTS"
description: ""
date: 2016-03-30T16:00:37+02:00
draft: false
tags: [build,vNext,VSTS]
categories: [Team Foundation Server]
---
Pricing for Build Agents in Visual Studio Team Services states that the  **first agent is free, subsequent on-premise agent will cost 15$/month**. If you, like me, have a demo account, or you want to use  **more than one agent not simultaneously** , you can register more than one agents, and then, from the administration panel, you can disable all agents except one.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2016/03/image_thumb-1.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2016/03/image-1.png)

 ***Figure 1***: *Leave only one agent enabled at a time to be license compliant*

If you need a third agent, as an example installed on a linux machine to demo linux build, you should disable the only enabled agent, then install and configure the agent on linux.

Gian Maria.
