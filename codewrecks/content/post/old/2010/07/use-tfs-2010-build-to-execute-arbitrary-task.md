---
title: "Use TFS 2010 build to execute arbitrary task"
description: ""
date: 2010-07-07T07:00:37+02:00
draft: false
tags: [TFS Build]
categories: [Team Foundation Server]
---
When you deal with continuous integration, building source is just one part of the problem, you need to run test, calculate metrics, deploy on test server and so on. To orchestrate the execution of integration scripts you need an infrastructure that is capable of scheduling, logging, distribution of agent and a central point of manteniance, TFS2010 build system has all this characteristics and many other that makes is suitable to run integration script, not only build one.

Tfs2010 build system essentially runs a window workflow 4.0 script to do some standard operation like, build, run test, gated checkin, and bla bla bla, but nothing prevents you to use it to execute operation different from building sources. To make a very trivial example, just go to the source folder of a team project, locate the folder *BuildProcessTemplate*and create a copy of DefaultTemplate.xaml, now check in and start modifying it removing arguments, variable etc.

[![Untitled](http://www.codewrecks.com/blog/wp-content/uploads/2010/07/Untitled_thumb1.png "Untitled")](http://www.codewrecks.com/blog/wp-content/uploads/2010/07/Untitled1.png)

 **Figure1:** *A simple build to log something*.

In Figure1 I show a very trivial build, I removed completely everything, I create a sequence with very few actions, just to demonstrate that you can create a build that actually does not build anything, but it just execute an arbitrary workflow.

[![Untitled2](http://www.codewrecks.com/blog/wp-content/uploads/2010/07/Untitled2_thumb.png "Untitled2")](http://www.codewrecks.com/blog/wp-content/uploads/2010/07/Untitled2.png)

 **Figure2:** *A detailed view of the build steps.*

In Figure2 I give you a more detailed description of the trivial build, the first two activities are needed to recover build details and to update the build number, because build number is used in the logging system of TFS and if you do not update it, you will end with build called 1, 2, 3, etc. For this example Iâ€™ve decided to give the build a number composed by the name of the build, followed by the sequential id. Finally I insert a couple of WriteBuildMessage activities, just to log something on the build. Since Iâ€™m planning to build a skeleton to create a custom workflow that deploy a specific build, in Figure1 you can see that there is a parameter called BuildToUse, when you create a new build, and choose this new workflow, you are presented with this only parameter in the â€œprocessâ€ tab, as visible in Figure3.

[![Untitled3](http://www.codewrecks.com/blog/wp-content/uploads/2010/07/Untitled3_thumb.png "Untitled3")](http://www.codewrecks.com/blog/wp-content/uploads/2010/07/Untitled3.png)

 **Figure3:** *Choose your new workflow from a build definition*

In Figure4 you can see the result of a build after the execution completes, as you can see, it simply logged something to the deploy log.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2010/07/image_thumb10.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2010/07/image10.png)

 **Figure4:** *The result of the build*

This example is really trivial, but it shows you that you can use tfs2010 build to execute an arbitrary workflow, but thanks to tfs infrastructure you have all the benefit of a standard build: distributed agent, centralized log inside tfs, etc etc.

The next step is to modify this trivial workflow to execute something useful, like the deploy of a specific build on a test server.

alk.
