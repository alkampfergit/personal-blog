---
title: "Retrieve image in Work Item Description with TFS API"
description: ""
date: 2019-07-10T20:00:37+02:00
draft: false
tags: [API]
categories: [Azure DevOps]
---
When you try to export content of Work Item from Azure DevOps (online or server) you need to deal with  **external images that are referenced in HTML fields of Work Item.** [I’ve dealt in the past](http://www.codewrecks.com/blog/index.php/2018/12/31/azure-devops-api-embed-images-into-html/) on this subject, showing how you can retrieve images with Store and Attachment Work Item Property.

Sadly enough, I’ve encountered situation with on-premise version of TFS where I found this type of image src inside HTML fields.

[https://nameoftfsserver/NameOfCollection/WorkItemTracking/v1.0/AttachFileHandler.ashx?FileNameGuid=AB6fc2e0-c449-4090-ab98-fac6c87fc219&amp;FileName=temp1554203067610.png](https://nameoftfsserver/NameOfCollection/WorkItemTracking/v1.0/AttachFileHandler.ashx?FileNameGuid=AB6fc2e0-c449-4090-ab98-fac6c87fc219&amp;amp;FileName=temp1554203067610.png)

As you can see  **the image is stored inside TFS as attachment, because it is served by AttachFileHandler, but you do not find any information of this image in Work Item Attachments property.** > Tfs  / Azure DevOps has different technique to attach images to Work Item Description and image file is not always a real Attachment of the Work Item

This format has no FileId to retrieve the image with the Store interface, nor is present in the Attachments collection of current Work Item, so  **we need to download it with a standard WebClient, instead of relying to some specific API call. The** problem is authentication, because if you simply try to use a WebClient to download the previous url you will got a 401.

The solution is to **populate the Credentials property of WebClient with the current credentials used to connect to the TFS** , in my situation I’ve this value into an helper class called ConnectionManager.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2019/07/image_thumb-17.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2019/07/image-17.png)

 ***Figure 1***: *How to correctly retrieve image attached to a work item.*

The code is really simple, just get the credential from Connection manager, generate a temp file name and use WebClient to download image content.

> TfsTeamProjectCollection class, once connected to TFS / Azure Devops instance, contains an instance of used credentials in Credentials property. This can be used to do standard request with WebClient to the server.

The GetCredentials() method of ConnectionManager is really simple because, after connection is stabilished,  **the instance of TfsTeamProjectCollection class has a Credentials property that contains credentials used to connect to the server**.

Armed with correct credentials, we can use WebClient standard class to download images from the server.

Gian Maria
