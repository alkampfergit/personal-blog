---
title: "How to subscribe to event in Visual Studio Online"
description: ""
date: 2014-05-01T06:00:37+02:00
draft: false
tags: [VSO]
categories: [Team Foundation Server]
---
I’ve dealt with BisSubscribe.exe in the past when I described how to do [automatic deploy of TFS Build when the quality changes](http://www.codewrecks.com/blog/index.php/2010/08/10/moving-to-a-deploy-system-based-on-tfs-build/). Those article explain how you can  **build a WebService that listens for notification from TFS and react accordingly. If you are curious if this technique works also for Visual Studio Online, the answer is obviously YES** !.

You can reuse the very same code for the previous example, because VSO uses the very same mechanism as TFS on-premise, so you can easily use the same service regardless you want to be notified from on-premise installation (using BisSubscribe.exe) or VSO. You should have your service installed with a public accessible endpoints, because VSO should be able to call it from Azure. For a simple demo I’ve installed the service on an Azure Virtual Machine but you can use also a Azure Web Site or on-premise IIS that is accessible from azure (have a public DNS).

To being notified when a Work Item changes, you should  **create a simple alert for Work Item changes, but instead of choosing HTML or Plain Text (used to send alert mail) you should choose SOAP**. Once you change Format to SOAP you should be able to insert the address of destination service that will receive the notification

[![SNAGHTMLf286e](https://www.codewrecks.com/blog/wp-content/uploads/2014/05/SNAGHTMLf286e_thumb.png "SNAGHTMLf286e")](https://www.codewrecks.com/blog/wp-content/uploads/2014/05/SNAGHTMLf286e.png)

 ***Figure 1***: *Sample notification alert that will send alert information to a custom WCF Service*

This is everything you need to setup for notification to work. Clearly you should verify that your service is available.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2014/05/image_thumb.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2014/05/image.png)

 ***Figure 2***: *Your service hosted on a public endpoint on azure virtual machine*

Now you can simply change a work item in your VSO account, and after a bunch of seconds your service will be notified of the change.

Gian Maria.
