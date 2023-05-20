---
title: "Executing Test in a test agent during a build"
description: ""
date: 2010-06-03T06:00:37+02:00
draft: false
tags: [Team Foundation Server,TFS Build]
categories: [Tfs]
---
With Tfs Build you have a great flexibility on how to execute your unit tests. First of all you can decide to execute only tests of a certain category, or with a certain priority, but one of the most interesting feature is the ability to execute them in another machine with the helps of a test Agent. First of all you need to install a test controller and configure it in one of the machine:

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2010/06/image_thumb5.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2010/06/image5.png)

Since this is a test machine I use administrator as the account, but this is not a good security strategy for production :), the important stuff is that the controller should be not associated with a project collection. Once the test controller is installed and configured you can install test agent on some pc and configure them to point at the controller.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2010/06/image_thumb6.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2010/06/image6.png)

for this example I installed an agent in the same machine of the test controller; when everything is ok you can simply create a testsetting file to set remote test execution.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2010/06/image_thumb7.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2010/06/image7.png)

With this option enabled, tests are executed remotely in an agent  configured with the controller 10.0.0.201. If you run tests you can look at the agent machine to verify that test are actually executed on the remote agent.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2010/06/image_thumb3.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2010/06/image3.png)

Now you can simply configure the build to use this new test settings file.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2010/06/image_thumb4.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2010/06/image4.png)

The advantage of this approach is that you can execute tests in a remote machine, with an agent that has access to the desktop. You can create a dedicated machine for running unit test during the build, expecially if the test machine has some specific characteristics to be satisfied (Es. it must have Sql Server installed to run database test locally, it should have a RAMDISK to speedup test execution, etc).

Alk.
