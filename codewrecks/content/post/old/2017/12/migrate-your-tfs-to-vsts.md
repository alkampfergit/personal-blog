---
title: "Migrate your TFS to VSTS"
description: ""
date: 2017-12-16T09:00:37+02:00
draft: false
tags: [VSTS]
categories: [Tfs]
---
I’ve discussed a lot with many customers over the benefit of VSTS over TFS, especially for small companies, where there is no budget for a dedicated TFS administrator. The usual risk is not updating TFS, loosing the update train and then have a problem doing upgrades like TFS 2008 to TFS 2017.

For those realities, adopting  **VSTS is a huge benefit, no administration costs, no hardware costs, automatic upgrade, accessible from everywhere** , same licensing (license for VSTS are also valid for TFS) and much more.  Also one of the original limitation, the inability to customize process, is now gone and, for certain aspect, VSTS is superior to the on-premise version (in VSTS you can do less customization but everything is done with Web Interface without needs to edit XML process file)

> If you are a small company, VSTS is the perfect tool, it contains everything for DevOps, zero maintenance cost, extensible and free for the first 5 users.

 **To perform the migration Microsoft released a dedicated tool to do a complete migration** , you can find details here [https://www.visualstudio.com/team-services/migrate-tfs-vsts/](https://www.visualstudio.com/team-services/migrate-tfs-vsts/ "https://www.visualstudio.com/team-services/migrate-tfs-vsts/") the process is well documented, with a dedicated step by step guide.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2017/12/image_thumb-5.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2017/12/image-5.png)

 ***Figure 1***: *Step by step migration guide download.*

Please read the guide carefully and verify the required version for TFS to being able to migrate. As you see from Figure 1 you can migrate from TFS 2017 update2, TFS 2017 Update 3 and TFS 2018 RTW.  **Please notice that you cannot use a migrator tool on a TFS version different from the version declared by the tool.** The tool will be updated to reflect and support the new version of TFS, and it will support only the most recent versions. If you have an old TFS instance, the suggestion is to migrate as soon as possible, then plan for the migration.

If you need support, check one of the official DevOps partner at this address [http://devopsms.com/SearchVSTSPartner](http://devopsms.com/SearchVSTSPartner "http://devopsms.com/SearchVSTSPartner"), they can support your company for a smooth and successful migration, especially if you are a large organization and have a big TFS instance.

Gian Maria
