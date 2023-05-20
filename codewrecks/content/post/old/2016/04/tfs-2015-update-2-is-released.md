---
title: "TFS 2015 Update 2 is released"
description: ""
date: 2016-04-02T09:00:37+02:00
draft: false
tags: [Tfs]
categories: [Tfs]
---
You can find all the details directly in [Visual Studio Site](https://www.visualstudio.com/news/tfs2015-update2-vs), but I want to emphasize that  **TFS and VS Updates are much more than Service Packs** , because they also intrdoduce a lot of new features. Here is a list of my personal favorites features of TFS Update 2

 **[Introduction of new Release Management System](https://www.visualstudio.com/news/tfs2015-update2-vs#newrmtfs)** New release management system is completely Web and does not require separate client to download, but this is not the only advantage.  **This update introduces the ability to integrate with VMWare, and have a new extension to connect to System Center Virtual Machine Manager**.

 **[Delete of work item from the UI](https://www.visualstudio.com/news/tfs2015-update2-vs#delwork)** This solves probably the most common question I got during TFS Courses. Basically every attendee asks “ **how can I delete Work Item?”.** The usual answer is, you need to resort to Command Line utility, because deleting a Work Item actually deletes its history from database and its a dangerous operation to do.

This is not always true, there are lots of legitimate reasons to delete a Work Item and  **now it is possible to delete Work Items directly from the Web Interface**. Deletion actually move Work Items to a Recycle Bin where you could still restore deleted Work Items or delete permanently.

 **[Extension from marketplace](https://www.visualstudio.com/news/tfs2015-update2-vs#suppext)** This is another really cool feature, Marketplace was available until now, only for VSTS accounts, but now you can add extensions even to your TFS on premise instance.

 **Gated Check-in for new build system** This was another great stopper for customer to adopt the new build system, until Update 2 the new build system has no support for Gated Check-in. With Update 2 you can create a Gated Check-in TFVC vNext build

 **[New Link from Git Code and Work Items](https://www.visualstudio.com/news/tfs2015-update2-vs#imprlink)** Now you can link a work item not only to a Commit in Git but also to an entire branch. This is really interesting if you work with GitFlow and are used to feature branches.  **With this approach you can link each PBI or User Story directly to Git Feature branch that is implementing it.** This is especially useful for Scrum Team, because you can create a pull-request for all Completed User Stories of the Sprint, and do a review. Then,  **during Sprint Review, you can complete pull requests only for those User Stories that are considered completed by the Product Owner.** All the User Stories that are still not considered completed will flow to the Next Sprint, postponing the Merge.

I strongly encourage you to have a look at the full list of the new feature, and, as always, I strongly suggest you to always upgrade your TFS to the latest version, to have all the latest bugfix and to avoid Big Bang upgrade that spans multiple versione (ex 2008 to 2013, or 2010 to 2015).

Gian Maria.
