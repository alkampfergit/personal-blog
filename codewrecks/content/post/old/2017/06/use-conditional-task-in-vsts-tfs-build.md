---
title: "Use conditional task in VSTS  TFS Build"
description: ""
date: 2017-06-17T09:00:37+02:00
draft: false
tags: [build]
categories: [Tfs]
---
When you start using Continuous Integration extensively,  **some builds become complex and sometimes a simple sequence of task is not what you want.** Previous build system, based on XAML and Workflow Foundation allows you to specify really complex path of execution, but the side effect is that builds become really complex, they are painful to edit and also, you need to use Visual Studio to edit. Final drawback is that writing and maintaining custom build activities was not so easy, because you need to keep the compiled version in line with build engine version.

> XAML build engine allows for complex workflow, but it was far more complex to manage.

 **The new build system is really far superior to old XAML build, but having a simple sequence of tasks can be too simplistic for complex scenario.** The solution is really really simple, just use conditional execution.

[![In the control options section of the task configuration you can specify that the task should be run only if a custom condition is met.](https://www.codewrecks.com/blog/wp-content/uploads/2017/06/image_thumb-5.png "Conditional execution condition in action")](https://www.codewrecks.com/blog/wp-content/uploads/2017/06/image-5.png)

 ***Figure 1***: *Conditional execution condition in action*

In the Control Option section of any task configuration, you have various options to decide when the task should run.

[![List of options that are described in the text of the post.](https://www.codewrecks.com/blog/wp-content/uploads/2017/06/image_thumb-6.png "Options available to decide when the task is run")](https://www.codewrecks.com/blog/wp-content/uploads/2017/06/image-6.png)

 ***Figure 2***: *Options available to decide when the task is run*

First four options are straightforward to understand, you can decide to run the task only if all previous task succeeded, or when a previous task failed, but also you can decide to run the task even if the build was cancelled.

 **The last option, Custom condition is where the real power shows up, with that option you can specify a custom condition, like the one that is shown in Figure 1.** The whole syntax is shown in [this MSDN Page](https://www.visualstudio.com/en-us/docs/build/concepts/process/conditions) and it is quite powerful. In  **Figure 1** I’ve used a simple expression that runs the task only if a variable called SkipTests is not equal to true (ne operator means Not Equal). Thanks to this, I can decide to set this variable to true at queue time, but I can also change a variable from previous task.

Even if custom condition does not gives you the full power of a workflow, you can still decide that some task runs only on certain conditions and it is simple to simulate flowchart if condition or more complex flow. As an example you can decide to run some tasks if not all tests are green and other tasks if some of the tests are failing.

Have a look at the [documentation MSDN Page](https://www.visualstudio.com/en-us/docs/build/concepts/process/conditions) to verify all the conditions that you can use.

Gian Maria
