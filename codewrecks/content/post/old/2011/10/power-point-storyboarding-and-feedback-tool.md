---
title: "Power point storyboarding and Feedback Tool"
description: ""
date: 2011-10-14T15:00:37+02:00
draft: false
tags: [Tfs]
categories: [Tfs]
---
In TFS 11 there are some cool new tools to easy the communication with customers, since the main reason for building software is to satisfy customers and users, at least in agile world, these kind of tools are really valuable in the process. A key point is being able to communicate easily with Stakeholders and have rapid feedback during each sprint to avoid the risk of “implementing the wrong stuff”.

With Visual Studio 11 a cool adding was added to PowerPoint, it permits to create StoryBoarding, a sort of UI sketch to have early feedback from the Users and Stakehoders and to easy the Requirement gathering part of the project. To use it, just install Power Point in a machine with Dev11 installed, then goes to the Visual Studio menu and click on “powerpoint storyboarding”.

The usual question is, we already have Sketchflow, why should we use Powerpoint? In my opinion there are several reasons

- PowerPoint is simple and it is well known by a lot of people
- A lot of people already have it installed on their pc.
- Its purpose is to create storyboard, while sketchflow is more complex and is useful to create interface mockup

Creating a simple sketch for an UI is really simple, just drag and drop some images from the toolbar to some slides, and you are done.

![External Image](http://blogs.ugidotnet.org/images/blogs_ugidotnet_org/rgm/Windows-Live-Writer/Power-point-storyboarding_EB0F/image_4.png)

 ***Figure 1***: *An example of prototype of WP7 UI*

This is an example of a simple sketch for a WP7 interface. Actually we have a little library of basic control , but I’m expecting a good series of images and templates for the final version and you can easily create one of your own. The cool part is that:  **it is PowerPoint** , so you can use all its functionalities you already know.

![External Image](http://blogs.ugidotnet.org/images/blogs_ugidotnet_org/rgm/Windows-Live-Writer/Power-point-storyboarding_EB0F/image_6.png)

 ***Figure 2***: *prototype of a Ribbon  based desktop interface.*

After you create the StoryBoard, you can simply save it on Sharepoint and pressing the “Storyboard Links” to attach to a related requirement in TFS as you can see in  **Figure 3**.

![External Image](http://blogs.ugidotnet.org/images/blogs_ugidotnet_org/rgm/Windows-Live-Writer/Power-point-storyboarding_EB0F/image_10.png)

 ***Figure 3***: *The storyboard can be attached to User Stories to it becomes part of the requirements*

The other new addition is the  **Feedback Manager Tool** that you can find in the Visual Studio 11 menu. It is based on the MTM UI and it is really useful for interactive development. It has an UI similar to Microsoft Test Manager, but it is used mainly to create a feedback item that can be attached to a TFS Work Item.

After you created your storyboards with PowerPoint, you start to implement User Stories in the backlog and at the end of each sprint, you should deliver the new feature to a test server where the stakeholders can verify what has been implemented. It is time for the stakeholders to give us feedback, so they can fire the feedback tool (that you should install on a test machine) and start playing with your software.

The best part of Feedback Manager, is that it is deeply connected with TFS, you can simply open the tool, start using the software, and gather feedback, attaching files, capturing screenshot, even recording audio and video if you want.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2011/10/image_thumb1.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2011/10/image1.png)

 ***Figure 4***: *Feedback Manager in action, just use the software and insert comment in the tool.*

When the feedback is ok, you can simply press the Submit button, give a title to the feedback, add additional comment and the game is done.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2011/10/image_thumb2.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2011/10/image2.png)

 ***Figure 5***: *A feedback is just a Work Item of type Feedback and can be managed like all other Work Items of the project*

Now the feedback is recorded in TFS, you can just assign to someone, link to a backlog item, etc etc. This is a great tool to gather easy and detailed feedback on your software with great easy.

Gian Maria.
