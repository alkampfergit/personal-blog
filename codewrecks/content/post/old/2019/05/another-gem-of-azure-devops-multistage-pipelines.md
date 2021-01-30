---
title: "Another gem of Azure Devops multistage pipelines"
description: ""
date: 2019-05-18T08:00:37+02:00
draft: false
tags: [build]
categories: [Azure DevOps]
---
With deployment of Sprint 151 we have an exciting news for Azure DevOps called  **multi stage pipelines.** If you read my blog you should already know that I’m a huge fan of having YAML build definition, but until now, for the release part, you still had to have the standard graphical editor. **Thanks to Multi Stage Pipelines now you can have both build and release definition directly in a single YAML file**.

> Multi stage pipelines will be the unified way to create a yaml file that contains both build and release definition for your projects.

This functionality is still in preview and you can have a [good starting point here](https://devblogs.microsoft.com/devops/whats-new-with-azure-pipelines/),  **basically we still miss some key features, but you can read in previous post about what’s next for them, and this should reassure you that this is an area where Microsoft is investing a lot**.

Let’s start to create first real pipeline to deploy an asp.net application based on IIS, first of all I’m starting with an existing YAML build, I just create another yaml file, then I can copy all the existing YAML of an existing build, but in the head of the file I’m using a slightly different syntax

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2019/05/image_thumb.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2019/05/image.png)

 ***Figure 1***: *New Multistage pipeline definition*

As you can see the pipeline starts with name stages, then a stage section starts, that basically contains a standard build, in fact I have one single job in Build Stage, a job called Build\_and\_package that takes care of building testing and finally publish artifacts.

After the pipeline is launched, here is what I have as result ( **Figure 2** ):

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2019/05/image_thumb-1.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2019/05/image-1.png)

 ***Figure 2***: *Result of a multistage pipeline*

As you can see the result is really different from a normal pipeline, first of all I have all the stages (actually my deploy job is fake and does nothing). **As you can see the pipeline is now composed by Stages, where each stage contains jobs, and each jobs is a series of tasks.** Clicking on Jobs section you can see the outcome of each jobs, this allows me to have a quick look at what really happened.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2019/05/image_thumb-2.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2019/05/image-2.png)

 ***Figure 3***: *Job results as a full list of all jobs for each stage.*

When it is time to deploy, we target environments, but unfortunately in this early preview we can only add kubernetes namespace to an environment, but we are expecting soon to be able to add Virtual Machines through deployment groups and clearly azure web apps and other azure resources.

I strongly encourage you to start familiarizing with the new syntax, so you will be able to take advantage of this new feature as soon at it will be ready.

Gian Maria
