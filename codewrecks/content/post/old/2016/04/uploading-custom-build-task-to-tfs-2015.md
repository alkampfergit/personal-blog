---
title: "Uploading custom Build Task to TFS 2015"
description: ""
date: 2016-04-27T19:00:37+02:00
draft: false
tags: [build]
categories: [Team Foundation Server]
---
In a previous article I wrote on [how to write a custom Task For Visual Studio Team Services](http://www.codewrecks.com/blog/index.php/2016/03/17/writing-a-custom-task-for-build-vnext/), but a usual question is:  **can I use the same technique to write a task to TFS 2015 on-premise?** The answer is yes, and it is really simple, thanks to this fantastic article by Jesse,  **that** [**explain how to use Fiddler to being able to authenticate to on-premise TFS without the hassle of enabling basic authentication**](http://blog.jessehouwing.nl/2016/01/publish-build-tasks-to-tfs-2015-without.html). Thanks to that article and Fiddler, you can simply login from tfx-cli to your TFS 2015 without any problem.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2016/04/image_thumb-17.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2016/04/image-17.png)

 ***Figure 1***: *Login against your local TFS Service*

Once I’m logged in,  **I can simply use the very same command used for VSTS to upload the directory where I defined the Build Task on my local TFS on-premise Server**.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2016/04/image_thumb-18.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2016/04/image-18.png)

 ***Figure 2***: *Task was uploaded to the server*

As you can see the task was uploaded to the server, exactly in the very same way I uploaded to my VSTS account. The task is now available to be used in my TFS.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2016/04/image_thumb-19.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2016/04/image-19.png)

 ***Figure 3***: *Custom task in action in a TFS 2015 on-premise build*

Thanks to the extensibility with PowerShell I did not need to care about versions of VSTS or TFS, because the script does not have reference on any dll or package and  **the same task can be used both in VSTS or in TFS 2015 without changing a single line**.

Thanks to the new Buidl System, extending a build for both VSTS and TFS is now a simple and easy task.

Gian Maria.
