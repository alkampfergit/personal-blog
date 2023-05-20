---
title: "Download code of a specific changeset in TFVC"
description: ""
date: 2014-08-20T05:00:37+02:00
draft: false
tags: [Tfs]
categories: [Tfs]
---
Some time ago a friend asked me the easiest way to  **get code from a specific folder and a specific version in TFVC**. The goal is avoiding using Get Specific Version because he do not want to overwrite the Workspace folder he is using, he want also to avoid creating another workspace only to do a one-shot get of a folder.

It turns out that  **the easiest way to accomplish this task is from Web Interface** ,  **because it has the capability of browsing and downloading code as zip**. You can simply navigate to the CODE hub in web interface, choose the folder you want to download and use the context menu of desired folder to download everything as a single zip file.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2014/08/image_thumb10.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2014/08/image9.png)

 ***Figure 1***: *Browse and download code from the Web Interface.*

But wait, this will download the latest version of the code, not a specific version. The cool part of the web interface is that  **if you just append #version=xxx where xxx is the changeset-id you want to download, you can browse the code of that specific changeset, and you can also download as Zip that specific version**. If you just look at the url, you can easily spot out that downloading the code as zip is just a matter of calling the right url

[https://gianmariaricci.visualstudio.com/DefaultCollection/Experiments/\_api/\_versioncontrol/itemContentZipped?repositoryId=&path=%24%2FExperiments%2Ftrunk&version=96&\_\_v=5](https://gianmariaricci.visualstudio.com/DefaultCollection/Experiments/_api/_versioncontrol/itemContentZipped?repositoryId=&amp;path=%24%2FExperiments%2Ftrunk&amp;version=96&amp;__v=5 "https://gianmariaricci.visualstudio.com/DefaultCollection/Experiments/_api/_versioncontrol/itemContentZipped?repositoryId=&amp;path=%24%2FExperiments%2Ftrunk&amp;version=96&amp;__v=5")

You can simply change the version parameter and you are able to download every version of your code as zip with a simple call and without resorting to API or external tool. Just copy and paste url inside your browser and you are done. If you have not previously authenticated with your TFS or VSO you will be prompted for credentials, then the file is downloaded.

I’ve showed you examples with Visual Studio Online, but you can use the very same technique against your on-premise TFS.

Gian Maria.
