---
title: "Check Angular AoT with a TFS Build"
description: ""
date: 2017-09-23T12:00:37+02:00
draft: false
tags: [build,VSTS]
categories: [Azure DevOps]
---
Developing with Angular is a real fun, but usually during development you serve the application without any optimization, mainly because you want to speedup the compilation and serving of your Angular application.

 **When it is time to release the software, usually you build with –prod switch and usually you also use the –aot switch** (it seems to me that it is on by default on –prod in latest version of the ng compiler). The aot switch enable the Ahead of Time compiling, that is used to speedup your deployed application and also it find some more error than a normal compilation.

I do not want to made examples when a simple ng build compile just fine but the production build with aot fails, the important concept is, **when you fire your production build to generate install packages, it is really annoying to see your angular build fails because of some errors.** Since building with aot is really expensive I’ve decided not to trigger this build for each commit, but only for special situations. First of all, here is the whole build.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2017/09/image_thumb-5.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2017/09/image-5.png)

 ***Figure 1***: *Build to check aot compilation*

As you can see, with TFS Build it is really a breeze to create a build that simply trigger the ng compiler to verify that it correctly compiles with aot switch on. Thanks to the trigger panel of my build,  **I’ve decided to build automatically only master and release branches.** [![image](https://www.codewrecks.com/blog/wp-content/uploads/2017/09/image_thumb-6.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2017/09/image-6.png)

 ***Figure 2***: *Trigger configuration for my AOT build*

This is another great advantage of Git over a traditional source control system, I can configure a single build for every branch on my repository. In this specific situation I require that the build will be triggered for release and master branches.

 **This is usually a good approach, but I want to move a little bit further so I configure that build as optional for pull request for develop branch**. With this technique, whenever a pull request is done on the develop branch, that build is triggered, and people can fix errors before they slips to the main develop branch.

Thanks to VSTS build system, it is just a matter of minutes to setup specific build that checks specific part of your code, like angular production compilation and optimization.

Gian Maria.
