---
title: "Azure DevOps YAML pipeline authorization problem"
description: ""
date: 2020-03-10T18:00:37+02:00
draft: false
tags: [Continuos Integration]
categories: [Azure DevOps]
---
It could happen, sometimes, that when you create a pipeline in Azure Devops at first run you got the following error.

> ##[error]Pipeline does not have permissions to use the referenced pool(s) Default. For authorization details, refer to [https://aka.ms/yamlauthz](https://aka.ms/yamlauthz).

There are more than one kind of this error, the most common one is the build using some external resource that requires authorization, but  **in this specific error message, pipeline has no permission to run on default pool**.

If you look at documentation, you can verify that you are expected to be presented with a nice button that allows you to authorize the pipeline with current pool, but sadly enough, sometime you have no button.

 **The reason is probably the inability of the system to determine the pool used by the build during authorization phase,** this happens as an example when the poll is passed as variable to the pipeline. Look at the following definition

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2020/03/image_thumb-8.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2020/03/image-8.png)

 ***Figure 1***: *Pool specified as variable in the definition.*

As you can see in  **Figure 1** pool name is specified through a standard variable, this allows the user to choose the pool with manual queue, while leaving standard continuous integration to target a pool chosen in the definition.

 **This kind of flexibility is necessary, as an example, to avoid priority problems.** We usually have a dedicated pool with fast machines and left one pipeline license free so we can schedule a build in pool fast to have it being executed immediately.

 **How can you solve the problem? The simplest solution is going to the administration page of the project, select the pool you want to use for the build and finally grant permission to every pipeline.** [![image](https://www.codewrecks.com/blog/wp-content/uploads/2020/03/image_thumb-9.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2020/03/image-9.png)

 ***Figure 2***: *Giving access to all pipelines to a pool solve authorization problems*

If you prefer being able to give permission to single pipelines, the only available approach is editing the build, pushing yaml definition with a specific pool (not using a variable) and wait for the build to fail. If the pool is static you should have a nice button to authorize the build. Once authorized, you can edit the definition again with variable pool and the game is done.  **Remember to do the game for each pool that the build should use.** Gian MAria.
