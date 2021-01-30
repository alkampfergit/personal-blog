---
title: "View results of deleted builds in VSTS"
description: ""
date: 2016-02-06T18:00:37+02:00
draft: false
tags: [build]
categories: [Team Foundation Server]
---
One of the nice new feature of the new build system (vNext) introduced in VSTS is the  **ability to view result summary for deleted builds**.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2016/02/image_thumb6.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2016/02/image6.png)

 ***Figure 1***: *View Deleted builds from VSTS*

Clearly not all data is maintained,  **you cannot retrieve artifacts or logs** , so you cannot troubleshoot a failed build, but at least you are able to view build outcome, who triggered it and some global data such as test result summary.

 **One of the most important information you can retrieve is the Source Version**. Suppose you release the output of a build to some test or even worse, production server. Then the build was accidentaly deleted, ach…. If you did a good job to write commit number or CheckinId number in AssemblyInformationalVersion you can safely recreate the build, but if you only rely on build number to retrieve data and the build is gone you are not sure on what version of the code produced that artifacts.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2016/02/image_thumb7.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2016/02/image7.png)

 ***Figure 2***: *Thanks to build detail we can retrieve Source Version even for deleted builds.*

As you can see in  **Figure 2** , you can easily retrieve source version from deleted build.

Gian Maria.
