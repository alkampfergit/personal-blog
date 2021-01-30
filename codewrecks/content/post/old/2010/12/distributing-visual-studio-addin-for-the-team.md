---
title: "Distributing Visual Studio addin for the team"
description: ""
date: 2010-12-04T09:00:37+02:00
draft: false
tags: [Power Tools,Tfs]
categories: [Team Foundation Server]
---
One of the most requested feature for TFS is the ability to distribute automatically Visual Studio adding to team member. This needs is especially important for addin like Custom Check-in policies, because if developers do not install check-in policies they would not be run during a Check-in. Every time you show check-in policies to a customer, it immediately ask you how to distribute them to all developers pc automatically.

I found that some people are not aware that such a feature is already there, but is included in TFS power tools, so it is not available out of the box with a plain installation of Visual Studio and TFS. After installing power tools you can simply right click in the Team Members node and choose Personal Settings

[![SNAGHTML6e50cf](https://www.codewrecks.com/blog/wp-content/uploads/2010/12/SNAGHTML6e50cf_thumb.png "SNAGHTML6e50cf")](https://www.codewrecks.com/blog/wp-content/uploads/2010/12/SNAGHTML6e50cf.png)

From there you can see all the options for the collaboration features and one interesting option is called â€œInstall downloaded custom componentsâ€¦. but how it works?

[![SNAGHTML6f800a](https://www.codewrecks.com/blog/wp-content/uploads/2010/12/SNAGHTML6f800a_thumb.png "SNAGHTML6f800a")](https://www.codewrecks.com/blog/wp-content/uploads/2010/12/SNAGHTML6f800a.png)

This extension verifies in the source control the presence of a path called $projectname/TeamProjectConfig/CheckinPolicies and inside that folder looks for 1.0 2.0 or 3.0 folders for VS2005 VS2008 and VS2010 addins respectively. Every dll found on that directory is automatically downloaded to the right location and made available to client computers. This is an example picture taken from the help of Power tools that shows how to include the dll of the custom checkin policies of Power tools with the right name to be available for every team member (this is needed to made upgrade to the policies without reinstalling powertools to each client machine as example)

[![SNAGHTML720677](https://www.codewrecks.com/blog/wp-content/uploads/2010/12/SNAGHTML720677_thumb.png "SNAGHTML720677")](https://www.codewrecks.com/blog/wp-content/uploads/2010/12/SNAGHTML720677.png)

You can include also dll containing Custom Control for Work Item editing, they should be included in a folder called $projectname/TeamProjectConfig/CustomControls.

Alk.
