---
title: "New Nuget Task in VSTS Build"
description: ""
date: 2017-08-22T06:00:37+02:00
draft: false
tags: [build,nuget,VSTS]
categories: [Azure DevOps]
---
If you edit a build in VSTS where you configured Nuget Packaging and Publishing, you can notice that all the old tasks to pack and publish are marked as deprecated.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2017/08/image_thumb-18.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2017/08/image-18.png)

 ***Figure 1***: *Old nuget tasks that are now deprecated.*

 **Deprecating a package is needed when the Author decide to completely replace the entire package, changing also the id**. This is needed when the task will be completely redesigned and will work in a complete different way from the old version.

For nuget package, Microsoft decides to publish a new task that can do Restore/Pack/Publish, all in one pacakge. The new package also uses a new dedicated nuget feed connection from your VSTS account to external nuget feed.

If you use VSTS internal feeds, there is no change, but if you are using an external feed, you can verify that now you can add a dedicated type of  connection for Nuget feeds ( **Figure 1** ).

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2017/08/image_thumb-19.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2017/08/image-19.png)

 ***Figure 2***: *External service endpoints configuration, now a dedicated Nuget feed is present.*

 **The nice part of having a dedicated Nuget feed is that you can specify a dedicated authentication (1) and also you can Verify Connection (2) to check if all the data is good** ; the service knows that this is a Nuget endpoint and can verify if everything is good before triggering a build.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2017/08/image_thumb-20.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2017/08/image-20.png)

 ***Figure 3***: *Configuration of Nuget Endpoint*

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2017/08/image_thumb-21.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2017/08/image-21.png)

 ***Figure 4***: *Usage of the Nuget endpoint.*

Once you defined one or more Nuget Endpoint, you can easily choose them from a Combobox in the Nuget Task, simplifying the configuration of the build.

I strongly suggest you to try this new task and to update all of your build to take advantage of it.

Gian Maria.
