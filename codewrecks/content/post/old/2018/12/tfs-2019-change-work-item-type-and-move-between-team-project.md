---
title: "TFS 2019 Change Work Item Type and Move Between Team Project"
description: ""
date: 2018-12-16T17:00:37+02:00
draft: false
tags: [AzureDevOps]
categories: [Azure DevOps]
---
When the first version of Team Foundation Server on Azure was presented, it has less feature than on-premise version, but actually Azure Dev Ops has changed the situation.  **The reality is that new features are first introduced into Azure Dev Ops, then on Azure Dev Ops Server (the on-premise version).** A couple of features were really missing on the on-premise version, the ability to change Work Item Type and the ability to move Work Items between projects. These two features were available from long time in the online version, but  **they were not present in the on-premise version until Azure DevOps server 2019, actually in RC1**.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2018/12/image_thumb-4.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2018/12/image-4.png)

 ***Figure 1***: *Change Type and Move to Team Project in Azure DevOps.*

But if you installed Azure DevOps Server (TFS 2019) you could be disappointed because those two functions seems to be still missing from the product.

The real fact is that  **these two functions are actually present in the product, but are not available if Reporting Services is enabled.** The reason is: changing Work Item type or moving between project will mess up the data in Warehouse database, so, if you want these two features, you need to disable reporting features.  **Everything is described in the** [**Product Notes**](https://docs.microsoft.com/en-us/tfs/release-notes/azuredevops2019) **, but I noticed that most of the people missed this information.** >  **To have Change Type and Move Work Item between Team Project you needs to disable Reporting Services feature from the product.** Reporting services is one of the feature that was often installed but never used by most people, so, if you are not using it, I suggest you to disable it from the administration console, because being able to change Work Item Type or to move Work Item between projects is a really more useful feature.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2018/12/image_thumb-5.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2018/12/image-5.png)

 ***Figure 2***: *How to disable reporting in Administration console.*

 **To disable reporting services you just open administration console, select Reporting node (1), then stop the job (2) and finally Disable Reporting features (3).** You will be prompted to enter name of the server to confirm that you really want to disable Reporting, then you are done.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2018/12/image_thumb-6.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2018/12/image-6.png)

 ***Figure 3***: *Warehouse and Reporting were disabled from instance.*

Actually if you want to create custom reporting, I suggest you to start have a look to Power BI, that recently added a connector even for Azure DevOps server instance.

 **Once reporting is disabled, just refresh the Web UI and Move To Team Project and Change Type options should be available on all Team Projects of every Collection.** If you are not sure if anyone is actually using reporting feature, ask to the members of the team for usage of base or custom reporting or if there is some in-house built tool or third party tool that is reading data from the Warehouse Database.

If reporting services are actually used, Microsoft is encouraging you to try the Analytics marketplace extension ([https://marketplace.visualstudio.com/items?itemName=ms.vss-analytics](https://marketplace.visualstudio.com/items?itemName=ms.vss-analytics "https://marketplace.visualstudio.com/items?itemName=ms.vss-analytics")) or you can have a look at Power-BI.

Gian Maria
