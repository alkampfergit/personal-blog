---
title: "Package manager in VSTS"
description: ""
date: 2016-02-12T14:00:37+02:00
draft: false
tags: [build]
categories: [Team Foundation Server]
---
One of the cool feature of Visual Studio Team Services is extendibility, you can also find lots of addin in official [Marketplace](https://marketplace.visualstudio.com/). One of the coolest addin you can find there is an official addin by Microsoft and allows you to **host a private Nuget Packages inside your VSTS account**. You can find the Addin here: [https://marketplace.visualstudio.com/items?itemName=ms.feed](https://marketplace.visualstudio.com/items?itemName=ms.feed "https://marketplace.visualstudio.com/items?itemName=ms.feed") it is free and can be installed with a couple of simple clicks.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2016/02/image_thumb.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2016/02/image.png)

 ***Figure 1***: *Package manager add a new PACKAGE menu to your VSTS Account*

As you can see the Package manager is still considered to be in Preview (asterisk after the menu and a nice toolbar that link to the [documentation](https://www.visualstudio.com/get-started/package/what-is-packaging)), but you can use it because all the basic funcionalities are present.

One of the nice aspect of package management is security:  **you can publish private packages, and you can decide who can access that specific package**. You can start pressing the “New Feed” button in the feed page to create a new feed.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2016/02/image_thumb1.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2016/02/image1.png)

 ***Figure 2***: *Create a new feed.*

After the feed is created, you can simply right-click it and choose Edit, to manage security with great granularity. As you can see in Figure 3  **you can specify who Own the feed, who can publish packages to the feed and finally who can read packages from that feed**. With this level of granularity, you can easily protect your packages from unwanted use.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2016/02/image_thumb2.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2016/02/image2.png)

 ***Figure 3***: *Package management security page.*

Once the feed is created, you can press the “Connect To feed” link to gather all the information needed to consume and publish packages. You can find instruction for VS2015, VS2013 or other tools / nuget versions.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2016/02/image_thumb3.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2016/02/image3.png)

 ***Figure 4***: *Instruction on how to connect to the feed for Visual Studio 2015.*

Once the feed is created the easiest way to populate it is using a TFS Build, the whole process is explained on the post [Publishing a Nuget package to Nuget/Myget with VSO Build vNext](http://www.codewrecks.com/blog/index.php/2015/09/26/publishing-a-nuget-package-to-nugetmyget-with-vso-build-vnext/).

The main difference is that a private feed can use standard VSTS authentication, you just configure the feed as *Internal NuGet Feed*  and put the address of the feed in Nuget Publisher Task Configuration. You can see from  **Figure 3** that Project Collection Build Service is included in the Contributor list, this allows a build service to publish package to that feed during a build.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2016/02/image_thumb4.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2016/02/image4.png)

 ***Figure 5***: *Nuget Publisher task can publish Internal NuGet feed without the need for authentication.*

Once the build is finished, you can simply check if the package was correctly published to the feed.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2016/02/image_thumb5.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2016/02/image5.png)

 ***Figure 6***: *Check your published package in feed management.*

You can now consume the package from whatever client you like: Visual Studio, Command Line, etc.

Gian Maria.
