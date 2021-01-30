---
title: "Remove git-tf tracked branch after a move from standard TF Service project to Git enabled project"
description: ""
date: 2013-02-01T21:00:37+02:00
draft: false
tags: [Git,TF Service]
categories: [Team Foundation Server]
---
In a previous post called “[Move a TFService source contorl to TF Service Git based Team Project](http://www.codewrecks.com/blog/index.php/2013/01/31/move-a-tfservice-source-control-to-tf-service-git-based-team-project/)” I explained how to simple move sources from a standard TF Service project to another one based on Git. Now after a push if I issue a log I got this.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2013/02/image_thumb.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2013/02/image.png)

 ***Figure 1***: *Origin\_tfs/tfs branch in my log?*

It seems that there is a remote branch called origin\_tfs/tfs but it does not get listed in the list of remote branches from the Web Ui, this because that branch was related to git-tf operations.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2013/02/image_thumb1.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2013/02/image1.png)

 ***Figure 2***: *Remotes/origin\_tfs/tfs branch showed by a branch –a command*

Since that branch is not needed I want to remove it, so I first issue a simple  **git branch -r** to understand the list of remote-tracking branches. Now I can simply decide to delete the remote-tracking branch because I do not need it anymore

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2013/02/image_thumb2.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2013/02/image2.png)

 ***Figure 3***: *Deleting the remote tracking branch.*

Gian Maria.
