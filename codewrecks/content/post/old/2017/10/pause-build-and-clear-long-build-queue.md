---
title: "Pause build and clear long build queue"
description: ""
date: 2017-10-12T16:00:37+02:00
draft: false
tags: [build,VSTS]
categories: [Azure DevOps,Visual Studio ALM]
---
In VSTS / TFS Build system, you can change the status of the build, between three states: Enabled, Paused and Disabled.  **The Paused state is really special, because all the build trigger are still active and builds are queued, but all these queued build does not starts**.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2017/10/image_thumb.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2017/10/image.png)

 ***Figure 1***: *Paused build*

Paused state should be used with great care, because if you forget a build in this state, you can end up with lots of queued build, as you can see in  ***Figure 2***: [![image](http://www.codewrecks.com/blog/wp-content/uploads/2017/10/image_thumb-1.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2017/10/image-1.png)

 ***Figure 2***: *Really high number of build queued, because the build definition is paused.*

What happened in Figure 2 is that some user probably set the build to paused, believing that no build will be queued, after some week he want to re-enabled, but we have 172 build in queue.

 **Now if you are in a situation like this, you probably need to remove all queued builds before re-enable the build definition.** If you set the build to active you have the risk to completely saturate your build queue. To solve this problem, just go to the queued tab of the build page.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2017/10/image_thumb-2.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2017/10/image-2.png)

 ***Figure 3***: *Tab queued for the build page*

From this page you can filter and show only queued build for the definition that was paused, you can then select all queued builds, and then delete all scheduling at once. Thanks to the filtering abilities present in the queued tab, you can quickly identify queued build and do massive operation on them.

Now that we deleted all the 172 queued build, we re-enabled the build without the risk of saturating build queue.

Gian Maria.
