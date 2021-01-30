---
title: "Create a Team Project from Web UI in TFS 2015 Update 2"
description: ""
date: 2016-04-03T07:00:37+02:00
draft: false
tags: [Team Foundation Server]
categories: [Team Foundation Server]
---
Creation of a new Team Project is a feature that traditionally was available only from Visual Studio in TFS on-premises. You do not need to have a full Visual Studio installation, you can only install the Team Explorer component,  **but in 2015, unfortunately, the stand alone installer for Team Explorer is Gone**.

It turns out that, after upgrade to 2015  **you should install Visual Studio Express or Visual Studio Community to create a Team Project**.

Another problem is that you need to use the right version of Visual Studio if you want to be sure that you are able to correctly create Team Project. If you try to create a Team Project in TFS 2015 with an early version of Visual Studio, the operation could probably fail.

Thanks to TFS 2015 Update 2, finally we are able to create a Team Project directly from the Web Interface, without the need to have Visual Studio installed. This is a really small feature, but I think that lots of people will be glad that it is now available.

> Thanks to TFS 2015 Update 2, finally we are able to create a Team Project directly from the Web Interface

The experience is still not complete, as an example the Web procedure is not able to create Sharepoint Site (if you connected Sharepoint with TFS) nor is able to create Reporting Services based resource. Even with this limitations, this functionality is really interesting. You can access it directly from the Team Project Collection Administration page

[![New Team Project menu after installing Update 2, this picture shows how Update 2 brings in the ability to create a Team Project directly from Web site](http://www.codewrecks.com/blog/wp-content/uploads/2016/04/image_thumb.png "New Team Project menu after installing Update 2")](http://www.codewrecks.com/blog/wp-content/uploads/2016/04/image.png)

 ***Figure 1***: *New Team Project menu after installing Update 2*

If you choose to create a new Team Project you get a dialog really similar to the one you get in VSTS.

[![This image shows the dialog in web interface to create a new Team Project. In the top section there is the warning about Sharpoint and Reporting Services](http://www.codewrecks.com/blog/wp-content/uploads/2016/04/image_thumb-1.png "Dialog to create the new Team Project")](http://www.codewrecks.com/blog/wp-content/uploads/2016/04/image-1.png)

 ***Figure 2***: *Dialog to create the new Team Project*

You can fill all the details you need then press “Create Project” button and you can simply wait for you server to create everything about the Team Project. As for VSTS  **you can close the Window with the progress bar, because all operations are done in bacgkround.** After a little while you should be able to access the new Team Project.

Gian Maria.
