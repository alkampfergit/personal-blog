---
title: "Moving between different VCS to Team Foundation Server"
description: ""
date: 2014-02-04T08:00:37+02:00
draft: false
tags: [Git]
categories: [Team Foundation Server]
---
In an old post I’ve already demonstrated how you can  **move a project from a standard TFS Version Control System to a Git repository hosted on TF Service (or wherever else)**. This is especially useful if you are working with TFS but you really need features of a Distributed Version Control System. The original post is here: m[ove source from a TFVCS based Team Project to a TF Service Git Based Team Project](http://www.codewrecks.com/blog/index.php/2013/01/31/move-a-tfservice-source-control-to-tf-service-git-based-team-project/).

Now that you have support for Git even on on-premise installation of TFS 2013, you can use the very same procedure to move source control from a team project based on TFVC to another one based on Git. But there is more: thanks to support of [git-tf](http://www.microsoft.com/en-us/download/details.aspx?id=30474), a java based bridge between Git and TFVC you can support even more scenarios. You can use Git-Svn to convert from a Subversion Repository and move code to a Team Project based on Git or TFVC. With a little setup you can also handle external companies that works with Subversion and you can import their work in your TFS  **maintaining even the connection between Subversion commit and Work Items.** I’ve described this process in a post called [Git as a bridge between Subversion and TFS](http://www.codewrecks.com/blog/index.php/2014/01/01/git-as-a-bridge-between-subversion-and-tfs/). You can use Hg-git to convert from Mercurial to Git or TFVC, and in general you can move code to your TFS from any VCS that supports conversion to Git.

The primary drawbacks of this approach are:

 **Time compression** : if you move to a TFVC based Team Project you are not able to maintain the original timestamp of commit / check-in, and the timestamp will reflect the moment you checking from git to TFVC with git-tf.

 **User Mapping** : checkin to the system done with git-tf are done with the credential of the person that is doing the check-in.

Since Git is a real good tool, I strongly suggest to move code to a Git based Team Project, so you can maintain full history. Then if you really need to work with TFVC and you cannot use Git, you can move only the tip to a TFCV based team project, and the history will be maintained with full fidelity in the Git Repository.

Gian Maria.
