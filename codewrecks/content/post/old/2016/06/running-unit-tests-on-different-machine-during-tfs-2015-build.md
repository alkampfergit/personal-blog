---
title: "Running Unit Tests on different machine during TFS 2015 build"
description: ""
date: 2016-06-04T08:00:37+02:00
draft: false
tags: [devops,TfsBuild]
categories: [Team Foundation Server,Testing]
---
First of all I need to thanks my friend [Jackob Ehn](http://blog.ehn.nu/) that pointed me to the right direction to create a particular build.  In this post  **I’ll share with you my journey to run tests on a different machine than the one that is running the build**.

 **For some build it is interesting to have the ability to run some Unit Test (nunit in my scenario) on a machine different from that one that is running the build.** There are a lot of legitimate reasons for doing this, for a project I’m working with, to run a set of test I need to have a huge amount of pre-requisites installed (LibreOffice, ghostscript, etc). Instead of installing those prerequisite on all agent machines, or install those one on a single build agent and using capabilities, I’d like to being able  **to run the build on any build agent, but run the test in a specific machine that had all the prerequisite installed.** > Sometimes it is necessary to run tests during build on machine different from that one where the build agent is running.

The solution is quite simple, because VSTS / TFS already had all build tasks needed to solve my need and to execute tests on different machine.

 **The very first steps is copying all the dlls that contains tests on the target machine** , this is accomplished by the Windows Machine File Copy task.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2016/06/image_thumb-3.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2016/06/image-3.png)

 ***Figure 1***: *File copy task in action*

This is a really simple task, the only suggestion is to never specify the password in clear format, because everyone that can edit the build can read the password. In this situation  **the password is stored in the RmTestAdminPassword variable, and that variable is setup as secret**.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2016/06/image_thumb-4.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2016/06/image-4.png)

 ***Figure 2***: *Store sensitive information as secret variables of the build*

Then we need to add a  **Visual Studio Test Agent Deployment task, to deploy Visual Studio Test Runner on target machine.** [![image](https://www.codewrecks.com/blog/wp-content/uploads/2016/06/image_thumb-5.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2016/06/image-5.png)

 ***Figure 3***: *Visual Studio Test Agent Deployment*

Configuration is straightforward, you need to specify a machine group or a list of target machines (point 1), then you should specify the user that will be used to run test agent (point 2), finally I’ve specified a custom location in my network for the Test Agent Installer. If you do not specify anything, the agent is downloaded from [http://go.microsoft.com/fwlink/?LinkId=536423](http://go.microsoft.com/fwlink/?LinkId=536423) but this will download approximately 130MB of data. For faster build it would be preferrable to download the agent and move the installer in a shared network folder to instruct the Task to grab the agent from that location.

 **Finally you use the Run Functional Tests task to actually execute tests in the target machine.** [![image](https://www.codewrecks.com/blog/wp-content/uploads/2016/06/image_thumb-6.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2016/06/image-6.png)

 ***Figure 4***: *Running functional test from target machine configuration*

You specify the machine(s) you want to use (point 1), then all the dll that contains tests (point 2) and you can also specify code coverage (point 3).  **Even if the task is called Run Functional Tests, it actually use Visual Studio Test runner to run tests, so you can run whatever test you like**.

> Thanks to TFS 2015 / VSTS build, we already have all tasks needed to run Unit Tests on target machines.

 **If you are running Nunit test or whatever test framework different from MsTest, this task will fail, because the target machine has no test adapter to run the test**. The failure output tells you that the agent was not capable of finding any test to run in specified location. This happens even if you added Nuget Nunit adapter to the project. The solution is simple, first of all locates all needed dll in package location of your project.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2016/06/image_thumb-7.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2016/06/image-7.png)

 ***Figure 5***: *Installing Nunit TestAdapter Nuget package, downloads all required dll to your machine*

Once you located those four dll in your HD, you should copy them to the target machine in folder:  **C:\Program Files (x86)\Microsoft Visual Studio 14.0\Common7\IDE\CommonExtensions\Microsoft\TestWindow\Extensions** , this folder was created by Visual Studio Test Agent deployment task and will contain all extension that will be automatically loaded by Visual Studio Test Agent. Once you copied the dll, those machine will be able to run nunit test without problem.

Once you copied all required dll in target folder, re-run the build, and verify that tests are indeed executed on the target machine.

[![SNAGHTML3c4ad0](https://www.codewrecks.com/blog/wp-content/uploads/2016/06/SNAGHTML3c4ad0_thumb.png "SNAGHTML3c4ad0")](https://www.codewrecks.com/blog/wp-content/uploads/2016/06/SNAGHTML3c4ad0.png)

 ***Figure 6***: *Output of running tests on remote machine*

Test output is transferred to the build machine, and attached to the build result as usual, so you do not need anything else to visualize test result in the same way as if the test were executed by agent machine.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2016/06/image_thumb-8.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2016/06/image-8.png)

 ***Figure 7***: *Output of test is included in the build output like standard Unit Tests ran by the build agent*

> Once tasks are in place, everything is carried over by the test agent, test results are downloaded and attached to the build results, as for standard unit tests executed on Build Agent machine.

The only drawback of this approach is that it needs some times (in my system about 30 seconds) before the test started execution in target machine, but apart this problem, you can execute tests on remote machine with little effort.

Gian Maria.
