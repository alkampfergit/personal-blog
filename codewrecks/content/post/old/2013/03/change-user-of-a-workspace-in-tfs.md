---
title: "Change user of a workspace in TFS"
description: ""
date: 2013-03-23T11:00:37+02:00
draft: false
tags: [Tfs]
categories: [Team Foundation Server]
---
Suppose you have a workspace made with a certain user and you want to move it to a different user. One of the reason could be, you started working with an account then your account changes for various reason, so you  **need to migrate all workspaces from your old user to another user**. This can be [accomplished by command line tool tf.exe](http://msdn.microsoft.com/en-us/library/54dkh0y3%28v=vs.100%29.aspx)

tf workspaces /updateUserName:OldUserName /s:sserverurl

this should be done with your new account, and will assign all workspaces from old account to current account. If you want to change only one workspace you can go with a developer command prompt to worspace folder, digit tf worksspace to open the UI to edit workspace settings, press advanced and then change the username from there.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2013/03/image_thumb35.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2013/03/image35.png)

 ***Figure 1***: *Change workspace owner.*

Simple and quick :)

Alk.
