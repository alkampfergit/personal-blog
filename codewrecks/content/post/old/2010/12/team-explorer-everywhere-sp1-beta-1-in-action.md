---
title: "Team Explorer everywhere SP1 Beta 1 in action"
description: ""
date: 2010-12-31T08:00:37+02:00
draft: false
tags: [Team Foundation Server]
categories: [Tfs]
---
You can download [Team Explorer Everywhere SP1 Beta](http://blogs.msdn.com/b/bharry/archive/2010/11/03/team-explorer-everywhere-2010-sp1-beta-is-available-for-download.aspx) to integrate all TFS functionality in your *non Visual Studio* environment, like eclipse. One of the most interesting addition made in SP1 is the support for gated Check In in Eclipse environment.

First of all you need to setup a build with ant or maven, and you need to install [Team Foundation Server Build Extensions Power Tool](http://visualstudiogallery.msdn.microsoft.com/en-us/2d7c8577-54b8-47ce-82a5-8649f579dcb6) on the build server in order to be able to run a build based on Ant. Carefully read all requisite in the download page (Java SDK, some environment variables, etc) and now you are able to create a build from eclipse.

First of all you need to create a buildfile with ant for your java project, I'm not going to explain you how to do this, but if you want to experiment, you can read [this guide](http://ant.apache.org/manual/tutorial-HelloWorldWithAnt.html) that explain how to create a *helloWorld* build with ant. Once you have a valid ant build file (you can simply copy that one in the tutorial) you can simply go to eclipse, go into TFS perspective and you should view the *builds* node.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2010/12/image_thumb5.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2010/12/image5.png)

 ***Figure 1***: *Builds node in Eclipse.*

You can simply right-click and create a new build definition, just follow the wizard and choose gated check-in when asked for.

As simple note, since we can have multiple agents on multiple build machines, and since java JDK and ANT should be installed and correctly configured on the build agent machine to successfully execute the build, it is better to use Agent Tags. Thanks to Agent tag we can configure full ANT environment only on some agents, not all of them.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2011/01/image_thumb.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2011/01/image.png)

 **Figure 2** *: How to setup a Ant tag to an agent to indicate that this Agent is capable of issuing Ant Builds.*

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2011/01/image_thumb1.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2011/01/image1.png)

 **Figure 3** : *How to ask to build system to execute this build only on an agent that has the Ant tag.*

Now that we instruct the build controller to run this build only on an Agent machine with the Ant tag associated, it is time to understand what happens when a gated check-in is configured on the project.

A gated Check-in is a special build that actually compile latest source adding a shelveset and if the build succeeded, commits the changes in the shelveset on behalf of the user. This is used to prevent people to do check-in that will break the build, in fact whenever a user want to do a check-in, such a windows appears.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2011/01/image_thumb2.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2011/01/image2.png)

 **Figure 4** :*the Gated Check In windows when you try to check in some code*

this means that your changes will be stored in a specific Shelveset, then the build machine will try to compile latest code with your shelveset applied, and only if the build succeeds the check-in will succeed, if the build will fail, the check-in will be rejected, so you'll need to get the shelveset code back again and fix whatever error is preventing the build from succeed.

Suppose your code does not compile, after a little bit you got this message:

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2011/01/image_thumb3.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2011/01/image3.png)

 ***Figure 5***: *The gated check-in rejected your code changes, because they does not build correctly.*

Now you need to unshelve, fix your errors and try to check-in again the code. When everything went good, you will receive a notification that your check-in was accepted.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2011/01/image_thumb4.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2011/01/image4.png)

 ***Figure 7***: *Check-in was accepted, because the build went ok.*

It is amazing that such a specific functionality is available even with eclipse :), team explorer everywhere really rocks.

Alk.
