---
title: "Troubleshoot logout from TFS Service when using multiple live Id"
description: ""
date: 2012-05-28T17:00:37+02:00
draft: false
tags: [Tfs service]
categories: [Tfs]
---
If you are using * **multiple live id to connect to the same instance of** *[* **TFS Preview** *](http://www.tfspreview.com/)* **(I’m, using a couple of different ID to demo authentication feature), you can find difficulties to logout from inside Visual Studio** *. In  **Figure 1** you can visualize the standard Connect to Team Project page, and in the bottom left corner you find information about the user currently logged to TFS.

[![SNAGHTML2ef1ce](https://www.codewrecks.com/blog/wp-content/uploads/2012/05/SNAGHTML2ef1ce_thumb.png "SNAGHTML2ef1ce")](https://www.codewrecks.com/blog/wp-content/uploads/2012/05/SNAGHTML2ef1ce.png)

 ***Figure 1***: *Standard form to connect to a TFS team project, after the installation of the hotfix to connect to TFS Preview*

Now if you press “Sign Out” the standard login form of TFS Preview appears and it should prompt you for a new login, but sometimes it happens that the form automatically logins you again so you are not able to logout. This happens sometimes when You check the “log me automatically” checkbox, but now you are unable to change the user you are using to login to TFS Preview.

A simple workaround is  **open a Web Browser window (in menu View-&gt;other windows-&gt;Web Browser"), navigate to your TFS Preview web site** xxxx.TfsPreview.com and you should be already logged with the same user you see in the “Connect to Team Project” window.  **Now you can simply logout from the site** [![image](https://www.codewrecks.com/blog/wp-content/uploads/2012/05/image_thumb.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2012/05/image1.png)

 ***Figure 2***: *Signout the current user from TFS Service web side from a Web Browser inside Visual Studio.*

Now you are logged out and even if you are redirected to a page that tells you “Sign-out isn’t complete” you can just close all instances of Visual Studio, then, if you open again the “Connect to Team Project” dialog, you should now be prompted for login and you are finally able to change the TFS Preview Logged User

Gian Maria.
