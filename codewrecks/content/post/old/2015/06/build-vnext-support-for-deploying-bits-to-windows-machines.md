---
title: "Build vNext support for deploying bits to Windows machines"
description: ""
date: 2015-06-20T13:00:37+02:00
draft: false
tags: [devops]
categories: [Team Foundation Server,Testing]
---
One of the most interesting trend of DevOps movement is continuous deployment using build machines. Once you get your continuous build up and running, the next step is  **customizing the build to deploy on one or more test environments**. If you do not need to deploy in production, there is no need of a controlled release pipeline (Ex: Release Management) and using a simple build is the most productive choiche. In this scenario  **one of the biggest pain is moving bits from the build machine to target machines.** Once build output is moved to a machine, installing bits is usually only a matter of using some PowerShell script.

> <font>In Build, Deploy, Test scenario, quite often copying build output to target machine is the most difficult part</font>

Thanks to Build vNext solving this problem is super easy. If you go to your visualstudio.com account, and choose the TEST hub, you can notice a submenu called machines.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2015/06/image_thumb13.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2015/06/image13.png)

 ***Figure 1***: *Machines functionality in Visualstudio.com*

This new menu is related to a new feature, still in preview, used to define groups of machine that can be use for deploy and testing workflows. In  **Figure 1** you notice a group called Cyberpunk1. Creating a group is super-easy,  **you just need to give it a name, specify administrative credentials and the list of the machines that will compose the group**. You can also use different credentials for each machine, but using machine in Active Directory domain is usually the simplest scenario.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2015/06/image_thumb14.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2015/06/image14.png)

 ***Figure 1***: *Editing of machine groups*

Actually this feature still does not support Azure Virtual Machines, but you can easily target machine in your on-premise infrastructure. You just need to be sure that

- *All machines are reachable from the machine where the build agent is running*
- *Check your DNS to verify that the names resolution is ok*
- *All target machines should have Powershell remoting enabled*
- *All target machines should have sharing of file system enabled*
- *Firewall port are opened.*

I’ve tested with an environment where both machines are running Windows Server 2012 R2, with latest update and file sharing enabled. Once you defined a machine group, you can use it to automatically copy files from build agent to all machines with a simple task of build vNext.

[![SNAGHTML3b78ea](https://www.codewrecks.com/blog/wp-content/uploads/2015/06/SNAGHTML3b78ea_thumb.png "SNAGHTML3b78ea")](https://www.codewrecks.com/blog/wp-content/uploads/2015/06/SNAGHTML3b78ea.png)

 ***Figure 3***: *Windows machine File Copy task*

Thanks to this simple task you can simply copy files from build machine to destination machine, without the need to install any agent or other components.  **All you need to do is choose the machine group, target folder and source folder.** If you get error running the build, a nice new feature of build vNext is the ability to download full log as zip, where all the logs are separated by tasks

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2015/06/image_thumb15.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2015/06/image15.png)

 ***Figure 4***: *All build logs are separated for each step, to simplify troubleshooting*

Opening the file 4\_Copy … you can read logs related to the copy build step, to understand why the step is failing. Here is what I find in one of my build that failed.

{{< highlight bash "linenos=table,linenostart=1" >}}


Failed to connect to the path \\vsotest.cyberpunk.local with the user administrator@cyberpunk.local for copying.System error 53 has occurred. 
 2015-06-10T08:35:02.5591803Z The network path was not found.

{{< / highlight >}}

In this specific situation the RoboCopy tool is complaining that the network path was not found, because I forgot to enable file sharing on the target machine. Once I enabled file sharing an running again the build everything was green, and I can verify that all files were correctly copied on target machines.

> <font>As a general rule, whenever a build fails, download all log and inspect the specific log for the task that failed.</font>

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2015/06/image_thumb16.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2015/06/image16.png)

 ***Figure 5***: *Sample application was correctly copied to target machines.*

In my first sample, I’ve used TailspinToys sample application, I’ve configured MsBuild to use StagingDirectory as output folder with parameter OutDir: /p:OutDir=$(build.stagingDirectory) and thanks to Windows Machine File Copy task all build output is automatically copied on target machines.

Once you got your build output copied on target machine, you need only to create a script to install the new bits, and maybe some integration test to verify that the application is in healthy state.

Gian Maria
