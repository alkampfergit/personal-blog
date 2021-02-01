---
title: "Tfs build 2010ndashcreate a personalized build"
description: ""
date: 2010-11-26T17:00:37+02:00
draft: false
tags: [TFS Build]
categories: [Team Foundation Server]
---
In several posts of the past I dealt with customization of TFS 2010 build, but I never pointed out how to create a personalized build that can be used without always resorting to edit the workflow directly. Suppose you work heavily with database projects, and you need to deploy database project to different server in most of your builds. In this scenario each time you need to deploy a DB project you [can create a new build process](http://www.codewrecks.com/blog/index.php/2010/02/25/writing-a-custom-activity-for-tfs-2010-build-workflow/), edit it, add some customization and finally save and use it for the build.

This way to proceed is quite annoying, especially if you need to use custom build actions inside the build, and finally you will end with a customized workflow for each build. In this situation there is a better way to structure your builds. First of all copy the default build workflow and rename it:

[![SNAGHTML1ba3d94](https://www.codewrecks.com/blog/wp-content/uploads/2010/11/SNAGHTML1ba3d94_thumb.png "SNAGHTML1ba3d94")](https://www.codewrecks.com/blog/wp-content/uploads/2010/11/SNAGHTML1ba3d94.png)

 ***Figure 1***: *Copy default workflow*

Now edit the workflow and add all the arguments  needed to deploy the database.

[![SNAGHTML1bbd2e1](https://www.codewrecks.com/blog/wp-content/uploads/2010/11/SNAGHTML1bbd2e1_thumb.png "SNAGHTML1bbd2e1")](https://www.codewrecks.com/blog/wp-content/uploads/2010/11/SNAGHTML1bbd2e1.png)

 ***Figure 2***: *Add arguments to the new workflow, add all the argument needed to deploy a database project*

Now thanks to Metadata I'm able to configure those arguments to give a better user experience, assigning a Category and descriptions to Arguments.

[![SNAGHTML1be69f1](https://www.codewrecks.com/blog/wp-content/uploads/2010/11/SNAGHTML1be69f1_thumb.png "SNAGHTML1be69f1")](https://www.codewrecks.com/blog/wp-content/uploads/2010/11/SNAGHTML1be69f1.png)

 ***Figure 3***: *Add Metadata to configure all the arguments*

Now I drop a DeployDatabase Activity inside the workflow, and use those four arguments to configure it.

[![SNAGHTML1c231e1](https://www.codewrecks.com/blog/wp-content/uploads/2010/11/SNAGHTML1c231e1_thumb.png "SNAGHTML1c231e1")](https://www.codewrecks.com/blog/wp-content/uploads/2010/11/SNAGHTML1c231e1.png)

 ***Figure 4***: *Configure all properties of the Custom Action with the arguments previously declared (Figure 2)*

Now I have a customized workflow, inside that workflow I've deployed a custom Activity, and finally I've declared arguments with metadata used to pass properties to the custom Activity. Now I can create a new Build, choose  DefaultWithDeployDatabase workflow and all the parameters are now exposed directly without the need to edit the workflow.

[![SNAGHTML1cc0b10](https://www.codewrecks.com/blog/wp-content/uploads/2010/11/SNAGHTML1cc0b10_thumb.png "SNAGHTML1cc0b10")](https://www.codewrecks.com/blog/wp-content/uploads/2010/11/SNAGHTML1cc0b10.png)

[![SNAGHTML1c6180b](https://www.codewrecks.com/blog/wp-content/uploads/2010/11/SNAGHTML1c6180b_thumb.png "SNAGHTML1c6180b")](https://www.codewrecks.com/blog/wp-content/uploads/2010/11/SNAGHTML1c6180b.png)

 ***Figure 5***: *Use the new workflow in a build.*

The important stuff is that you can use modified workflow for several builds, because it can be reused.

Alk.
