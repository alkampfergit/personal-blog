---
title: "Work Item Only View in TFS 11"
description: ""
date: 2012-04-18T16:00:37+02:00
draft: false
tags: [Tfs]
categories: [Tfs]
---
## What is WIOV in TFS 2010

TFS 2010 contains a special Group called the [**Work Item Only View Users**](http://msdn.microsoft.com/en-us/library/cc668124.aspx), used to identify *special users users that can only submit bugs and modify bugs submitted by them*. The reason behind this special group is to allow your customer to directly add bug into your TFS without giving them full access to the system, but the main reason to use WIOV is that  **such users do not need a CAL to access TFS**. This is really important because you can give free access to all user that needs only to submit bugs without worrying about the cost.

## WIOV in TFS11

If you open the administration console of a TFS11 beta installation and try to add a user to WIOV group, you will be surprised because  **there is not such a group anymore in TFS** , this is because user management is slightly changed in TFS11. *To enable the equivalent of WIOV in TFS11, you need to open the Web Control Panel*, located at the address [**http://machinename:8080/tfs/\_admin/\_licenses**](http://machinename:8080/tfs/_admin/_licenses)** **where machinename is the name of the machine where you installed TFS. In this tab you can see three special web access permission group and the first one, called** *Limited* **is the equivalent of WIOV, as you can see in Figure 1.

[![18-04-2012 19-12-20](https://www.codewrecks.com/blog/wp-content/uploads/2012/04/18-04-2012-19-12-20_thumb.png "18-04-2012 19-12-20")](https://www.codewrecks.com/blog/wp-content/uploads/2012/04/18-04-2012-19-12-20.png)** Figure 1: ***The Limited group in TFS11 is the equivalent of WIOV in TFS2010*

Now that the user Guardian was added to this special group, it has limited access to the entire server and if you want him to report bug for a specific project you can simply add him in the project Team of that specific project. In my example I have a TestProject team project, and I simply add the user Guardian into the TestProject Team.

[![18-04-2012 19-20-29](https://www.codewrecks.com/blog/wp-content/uploads/2012/04/18-04-2012-19-20-29_thumb.png "18-04-2012 19-20-29")](https://www.codewrecks.com/blog/wp-content/uploads/2012/04/18-04-2012-19-20-29.png)

 ***Figure 2***: *The user Guardian has now access to the TestProject team project.*

## What can a user with limited access do? 

When a Limited users logs to the system, it can only submit a new bug, or he can manage own previously submitted bugs as you can see in  **figure 3**.

[![18-04-2012 19-24-10](https://www.codewrecks.com/blog/wp-content/uploads/2012/04/18-04-2012-19-24-10_thumb.png "18-04-2012 19-24-10")](https://www.codewrecks.com/blog/wp-content/uploads/2012/04/18-04-2012-19-24-10.png)

 ***Figure 3***: *This is the TFS11 web access opened by a Limited user*

As you can verify the only operation you can do from the web access is  **submitting a new bug to the system and modify bugs that he previously created**. You have also a query editor, where the user can edit the query used to retrieve his work item, this can be used to create specific query to browse his own Bug, and even if the user remove the “created by me “ filter, the query returns only his own bugs.

Gian Maria.
