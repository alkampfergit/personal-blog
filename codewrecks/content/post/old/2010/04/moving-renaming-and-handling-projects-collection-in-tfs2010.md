---
title: "Moving renaming and handling projects collection in tfs2010"
description: ""
date: 2010-04-23T17:00:37+02:00
draft: false
tags: [Team Foundation Server]
categories: [Tfs]
---
I've installed a little test tfs with full MOSS 2007 integration in a virtual machine, now I want to move and rename a project collection from another test tfs (RC) to this new one (RTM), and recreate the project portal on MOSS for one of the team project.

This operation can seem complex, but it is instead really simple. First of all log to the source TFS (it was an RC), uninstall everything related to TFS RC, then install TFS RTM and choose upgrade. *Everything is automatic :)*. Then I simply detatched the DefaultCollection, backup the database of the collection, restore it to the destination server, and reattach Project Collection with a new name, like *RcUpgradedDefaultCollection*.

During the attach process I got these warnings.

*[2010-04-23 15:48:08Z][Warning] TF205019: An error occurred when attempting to automatically configure the following resource:*[*http://win-xxxxxx*](http://win-xxxxxx)*. The error is: TF255417: You specified a SharePoint Web application that has not been configured to grant access to Team Foundation Server. In order to add this Web application, you must either have Farm Administrator permissions, or a farm administrator must have granted access to this deployment of Team..blablabla*

This happens because the destination server has different Sharepoint configuration, now you need to configure the new loaded project collection to use the right Sharepoint Portal:

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2010/04/image_thumb21.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2010/04/image21.png)

Now that the project collection point to the right SP, I goes to visual studio, and verify the portal settings

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2010/04/image_thumb22.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2010/04/image22.png)

Clearly it points to the old server, so I disable the team project portal for this Team Project and follow the instruction [of this blog post](http://blogs.msdn.com/greggboer/archive/2010/02/24/creating-sharepoint-portals-reports-and-upgrading-reports-for-an-existing-team-project.aspx) to recreate the project portal for my Team Project and to recreate the reports. Now I force the execution of the warehouse from the web service [http://localhost:8080/tfs/TeamFoundation/Administration/v3.0/WarehouseControlService.asmx?op=ProcessWarehouse](http://localhost:8080/tfs/TeamFoundation/Administration/v3.0/WarehouseControlService.asmx?op=ProcessWarehouse "http://localhost:8080/tfs/TeamFoundation/Administration/v3.0/WarehouseControlService.asmx?op=ProcessWarehouse") and wait a little bit for the cube to build, then I opened the MOSS portal and I can verify that now the project correctly uses Excel Reports.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2010/04/image_thumb23.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2010/04/image23.png)

In this simple test project there are not so much data, but the important stuff is that with few operations you can move and rename a project collection to another server and being able to recreate the portal on MOSS taking advantage of features like Excel Reports even if the Team Project was born in an environment without MOSS.

alk.
