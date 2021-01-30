---
title: "Rename Team Project in VSO"
description: ""
date: 2015-04-25T05:00:37+02:00
draft: false
tags: [VSO]
categories: [Team Foundation Server]
---
With yesterday update, one of the most requested feature for TFS/VSO was finally active,  **you can now rename a Team Project.** It can be done directly from collection administration page, in the same place where you can delete a Team Project

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2015/04/image_thumb6.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2015/04/image6.png)

Once selected you should only provide a new name.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2015/04/image_thumb7.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2015/04/image7.png)

Now you will be warned with a long warning message that tells you exactly what kind of intervention you need to do after the rename.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2015/04/image_thumb8.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2015/04/image8.png)

Clicking the link provided in the warning box will bring you to a page full of detailed step on how to perform all the above operations. ([http://vsalmdocs.azurewebsites.net/Library/vs/alm/admin/project-rename](http://vsalmdocs.azurewebsites.net/Library/vs/alm/admin/project-rename "http://vsalmdocs.azurewebsites.net/Library/vs/alm/admin/project-rename") )

The first operation you need to do is recreate all local workspaces unless you will have Visual Studio 2012 or Visual Studio 2013 Update5, that can manage this situation automatically. So it is just a matter of time before this step will be automatic. Until Now, if you try to access Local workspaces of renamed project with older version you will be greeted with a detailed error message.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2015/04/image_thumb9.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2015/04/image9.png)

Another annoying stuff is that **you need to edit all the build based on TFVC** , and update path of solution/project to build, because build are still not updated by the rename project. I think that this will be fixed in some next upgrade.

One of the nicest stuff is that you will have **automatic redirect of old urls**. As an example I’ve renamed TP Experiments, but I’m still able to use the old url in the Browser.

*https://gianmariaricci.visualstudio.com/DefaultCollection/ **Experiments** /\_versionControl#path=%24%2FExperiments%2Ftrunk%2FElasticsearch%2FMusicDb&\_a=contents*

Clearly **the redirect will work until you create a new TP with the name of the old renamed project**.

Gian Maria.
