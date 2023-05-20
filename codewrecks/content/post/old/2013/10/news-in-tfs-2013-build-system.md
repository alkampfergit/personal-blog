---
title: "News in TFS 2013 Build System"
description: ""
date: 2013-10-21T06:00:37+02:00
draft: false
tags: [TFS Build]
categories: [Tfs]
---
[Team Foundation Server 2013 is finally RTM](http://blogs.msdn.com/b/bharry/archive/2013/10/17/visual-studio-2013-rtm-available.aspx) and it is time to explore some of its new functionalities and see what is changed between previous version. In the Build Area there are a lots of improvements especially because we now have Git Support and TFS presents a unified build experience between standard TFVC and Git.

 **Build workflow was redesigned and it got simplified** , giving to the user an easier build authoring experience. In the extension area we now have the ability to specify [scripts to be run before and after the build and before and after test are run](http://msdn.microsoft.com/en-us/library/dd647547.aspx#scripts). This give a really good extension experience, because  **it does not require you to do a workflow customization if you need to simply run some custom code during the build**. This capability is especially useful when paired with Powershell.

Another really interesting modification is the location of the Build Workflows.  **All workflows are now contained into the server and not in Source Control**. No more Build Process Template folder and confusion between different versions you have when you create Team Project after template are upgraded. When you need to customize the build, you can download a copy of the workflow and [check-in in your source control](http://msdn.microsoft.com/en-us/library/dd647551.aspx).

You can now drop the build output directly into TFS avoiding the use of a network share if you prefer.

I suggest you to go to MSDN and grab the bits to experiment your own on this new capabilities.

Gian Maria.
