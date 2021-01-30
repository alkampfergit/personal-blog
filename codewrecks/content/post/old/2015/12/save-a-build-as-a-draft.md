---
title: "Save a build as a Draft"
description: ""
date: 2015-12-01T16:00:37+02:00
draft: false
tags: [build,vNext]
categories: [Team Foundation Server]
---
There are a lots of interesting new features in TFS / VSTS Build vNext, but surely, one of the coolest one is the  **ability to edit a build and save as a draft**. Actually available only in the online version (Visual Studio Team Services)

[![Saving build as a draft](http://www.codewrecks.com/blog/wp-content/uploads/2015/12/image_thumb.png "iSaving build as a draft")](http://www.codewrecks.com/blog/wp-content/uploads/2015/12/image.png)

 ***Figure 1***: *Saving a build as a Draft*

Actually, saving build as a draft allows you to  **edit a build, try a new configuration / task / personalization, without distrupt the old build that works**. Customizing a build can be a difficult task, and the greatest risk with older build System is having an unusable build until the new personalization is done.

Another usual technique is  **temporary disable tasks to reduce the time to finish the build and verify if your new customization works**. Suppose you added a last task to manage artifacts publishing, you want to verify that everything works, and you disable running Unit Tests, so you can finish build faster and have a faster feedback. If you do this with the real build, until customization is not completed, all queued build will have unit test disabled.

> The main problem when you edit a build, is disrupting continuous integration until your work is finished.

With the ability to save as a Draft you can avoid this type of disruption.  **Once you’ve saved a build as a draft, you can queue the draft, verify the outcome, and when everything works as expected, you can publish it** , effectively updating the real build only when you’ve tested all modifications and you are sure that the new definition does what you really want.

[![Build result of Drafts build have a.DRAFT suffix to distinguish from a standard build output](http://www.codewrecks.com/blog/wp-content/uploads/2015/12/image_thumb1.png "Result of queueing a draft")](http://www.codewrecks.com/blog/wp-content/uploads/2015/12/image1.png)

 ***Figure 2***: *Build result of Drafts build have a.DRAFT suffix to distinguish from a standard build output.*

The net effect is:  **you are able to test modification in isolation, without distrupting the original working build definition**. Combine this with the ability to quickly spin an agent in your machine and you will have a really pleasant build definition update experience.

*1. Quick configure an agent into your local machine  
2. Try your personalization and save as a Draft  
3. Queue draft on your agent that is immediately able to execute the build  
4. Once everything is ok, publish the build*

Gian Maria.
