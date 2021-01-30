---
title: "Change Work Item Type in a fresh installation of Azure DevOps server"
description: ""
date: 2019-01-26T10:00:37+02:00
draft: false
tags: [Azure Devops,Tfs]
categories: [Azure DevOps]
---
If you want to use Azure DevOps I strongly suggest you to use cloud version [https://dev.azure.com](https://dev.azure.com), but  **if you really need to have it on premise, you can install Team Foundation Server, now renamed to Azure DevOps Server**.

One of the most waited feature for the on-premise version is the ability to change work item Type and to move work item between project, a feature present in Azure DevOps Server, but that needs a complete disable of Reporting Services to work, as I discussed [in an old Post](http://www.codewrecks.com/blog/index.php/2018/12/16/tfs-2019-change-work-item-type-and-move-between-team-project/).

In that very post I had a comment telling me that after a fresh installation of Azure DevOps Server, even if he did not configured reporting services, the option to move a Work Item Between Team Project is missing, as well as the option to change Work Item Type. The problem is, until you do not  **explicitly disable reporting on the TFS instance those two options are not available.** This is probably due to avoiding using these feature, then subsequently enable Reporting ending with incorrect data in the warehouse.

First of all we need to clarify some radical change in Azure DevOps 2019 respect former version TFS 2018.

> Azure DevOps Server has a couple of different type of Project Collection, one is the classic one with an XML process, the new one is the one based on process inheritance.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2019/01/image_thumb-13.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2019/01/image-13.png)

 ***Figure 1***: *Different type of Project Collection in Azure Devops*

If you check Figure 1, you can verify that an  inheritance based project collection does not use with Sql Server Anlysis services and reporting; thus you can always change Team Project or type because reporting is not used in these type of collection. As you can see in Figure 2, if I have a project collection based on Inheritance model, I can change work item type even if Reporting is configured.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2019/01/image_thumb-14.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2019/01/image-14.png)

 ***Figure 2***: *Project collection based on inheritance model are not affected by reporting services configuration.*

 **If you instead create a new collection using the old XML process model, even if you have not configured reporting services, the ability to Change Type or Move Between team project is not present.** This happens because, even if you had not configured reporting,  **you must explicitly disable that feature** , to prevent it to be reactivated in the future and have some erratic report.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2019/01/image_thumb-15.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2019/01/image-15.png)

 ***Figure 3***: *Even if you did not configure reporting for Azure DevOps server, the option to change Team Project and Change type are not available*

> To enable Move Between Team Project and Change Work Item Type you really need to explicitly disable reporting, as shown in Figure 3 and Figure 4

If you disable reporting the system is warning you that the reporting options could not be enabled anymore.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2019/01/image_thumb-16.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2019/01/image-16.png)

 ***Figure 4***: *A confirmation dialog warn that disabling Reporting is an option that cannot be undone*

As soon reporting is disabled, you can change Type and Move to other Team Project.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2019/01/image_thumb-17.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2019/01/image-17.png)

 ***Figure 5***: *When reporting is explicitly disabled, you immediately have the two options enabled.*

Happy Azure Devops.

Gian Maria.
