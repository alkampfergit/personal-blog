---
title: "Choose agent at build queue time"
description: ""
date: 2017-09-07T06:00:37+02:00
draft: false
tags: [build,VSTS]
categories: [Azure DevOps]
---
This is a simple feature that is not known very well and deserve a blog post. Sometimes you  **want to queue a build to a specific agent in a queue and this can be simply done using agent.name as a demand**.

Demands are simple key/value pairs that allows the build engine to choose compatible agents and each agent automatically have a couple of capability to store computer name and agent name (they can be different)

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2017/09/image_thumb.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2017/09/image.png)

 ***Figure 1***: *Capability of agentes, computer name and agent name are automatically present*

This allows you to use one of them if you want to run a build on a specific machine, just queue the build and use the demands tab to add agent.name or agent.computername demands.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2017/09/image_thumb-1.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2017/09/image-1.png)

 ***Figure 2***: *Choosing specific agent at queue time with agent.name capability*

 **If you specify a name that is not valid you will get a warning,** if the queue contains that specific agent the build will be queued and will be executed only by that agent.

This technique is useful especially if you add a new agent and want to trigger some specific build on it to verify if it has all the prerequisite ok.

Gian Maria.
