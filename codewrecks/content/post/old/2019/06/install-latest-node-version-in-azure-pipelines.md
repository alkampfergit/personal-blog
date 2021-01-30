---
title: "Install latest node version in Azure Pipelines"
description: ""
date: 2019-06-12T16:00:37+02:00
draft: false
tags: [build]
categories: [Azure DevOps]
---
I have a build in Azure DevOps that suddenly starts failing on some agents during the build of an angular application. Looking at the log I found that error

> You are running version v8.9.4 of Node.js, which is not supported by Angular CLI 8.0+.

Ok, the error is really clear,  **some developer upgraded Angular version on the project and node version installed in some of the build servers is old.** Now the obvious situation is logging in ALL build servers, upgrade node js installation and the build should run on every agent. This is not a perfect solution, especially because because someone can  **add another build server with an outdated Node Js version and I’m stuck again.** > Having some strong pre-requisite on build agent, like a specific version of NodeJs is annoying and needs to be addressed as soon as possible.

In this scenario you have two distinct way to solve the problem. The first solution is adding a custom capabilities to all the agents that have Node 10.9 at least, or even better, **mark all agents capable to build Angular 8 with a *Angular8*capability**. Now you can mark all builds for projects with Angular 8 to demand *Angular8* capability, and lets Azure DevOps choose the right agent for you.

> Matching Agent Capabilities with Build Demands is a standard way to have your build definition match the correct agent that have all prerequisites preinstalled

 **But even better is using a Task (still in preview) that is able to install and configure required node version on the agent automatically.** [![image](http://www.codewrecks.com/blog/wp-content/uploads/2019/06/image_thumb-5.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2019/06/image-5.png)

 ***Figure 1***: *Use Node.js ecosystem Task configured*

Thanks to this task, you do not need to worry about choosing the right agent, because the task will install required NodeJs version for you automatically. This solution is perfect,  **because it lessen pre-requisites of build agent, it is the build that will automatically install all prerequisites if missing**.

> When you start having lots of builds and build agents, it is better not to have too many prerequisites for a build agent, because it will complicate deploy of new agents and can create intermittent failure.

If you can you should be able to preinstall all required prerequisites for the build with build definition, avoiding to require prerequisites on agents.

Happy Azure Devops Pipeline
