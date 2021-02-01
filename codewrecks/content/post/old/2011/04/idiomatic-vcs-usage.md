---
title: "Idiomatic VCS usage"
description: ""
date: 2011-04-18T14:00:37+02:00
draft: false
tags: [Tfs,VCS]
categories: [Team Foundation Server]
---
When it is time to compare two [VCS](http://en.wikipedia.org/wiki/Revision_control) there are a lot of features to be taken into account, and in my opinion one of the most important is â€œthe team is already used to some VCS?â€. One of the most difficult part of learning a new VCS, is avoiding to use it in the same way you use a different product, because each VCS could potentially have a different way to do the same thing.

![](http://t3.gstatic.com/images?q=tbn:ANd9GcRHoinmgqdfm7X8FYIi1aiC79z62au75CxBo2mxRY7qnDUioSj-Yg)

Take as example moving from SVN to TFS, both of them are quite similar on the surface, but they are really different under the hood. One of the most significant difference is that TFS stores in the server the status of the â€œlocal copyâ€ of users, while in Subversion there is no equivalent concept. This lead to subtle differences and a general better offline experience for Subversion user. In SVN you can simply edit a file, then issue an update and the svn client will determines witch file were changed to populate the list of â€œpending changesâ€, TFS on the contrary marked files as read-only, and when you need to modify a file it issue an explicit Check-Out to the server to inform the server that the file is being edited by user XXX.

![](http://t3.gstatic.com/images?q=tbn:ANd9GcR2YGUOHQ8UnwsLsToRL78uLkB4kMDPyk5ndlXFuIsAUu5Pacme-g)

This is needed because SVN was originally created to support open source communities, where working with offline server is the standard thus offline experience should be good. TFS was born to serve large amount of users in corporate environment, and explicit check-out help people to understand who is working on a specific file.

If you are curious on how SVN can understand witch file are modified without the need to communicate to the server, you should know that SVN stores information in hidden.svn folder in the clients. This has a cost, a complex project I'm working to has the trunk that occupies 5.44 GB with 53.710 files, deleting all.svn folders I got a 5.02 GB of space and 33.663 files. For very large project, this could impact performances and if you do not have fast disks, working with such big solution could be slow.

Ok! But what this has to do with everyday usage of my VCS except for performance? Suppose you delete the a file (Transaction.cs9 § from your local copy directly from Windows Explorer, after this operation just issue a SVN  **update** command, what will be the result?

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2011/04/image_thumb7.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2011/04/image7.png)

 ***Figure 1***: *Subversion update restored deleted files.*

As you can see from Figure 1 issuing an update command will restore the file, all subversion users are used to this behavior, they will expect an update operation to restore files deleted outside svn and I call this â€œ[idiomatic](http://dictionary.reference.com/browse/idiomatic) vcs usageâ€. When you move to TFS, if you delete a file and then issue a Get Latest what will be the result? Clearly no file gets restored, because TFS stores the status of local Workspaces on the server, and since you deleted the local version of a file from windows explorer, tfs server still thinks that the file is in the local copy and there is no need to get it again. To get the file again you need to issue a â€œGet Specific Versionâ€.

Is this behavior wrong or erratic? In my opinion no, it is just a different way of handling the local copy that in turn lead to a different and subtle behavior, but clearly if you are moving from one VCS to another, you find these differences annoying. If you want or you need to change your VCS, pay attention to these kind of differences, and explicitly train your developers to all differences between the old VCS and the new one, creating a table that contains â€œhow we do this with old VCSâ€ and â€œhow we do this on the new VCSâ€, this will prevent your team hating the new VCS ;)

Another good suggestion is avoiding to delete/move files in your local copy outside the realm of your VCS, because it usually creates problems and surprising behavior.

Alk.
