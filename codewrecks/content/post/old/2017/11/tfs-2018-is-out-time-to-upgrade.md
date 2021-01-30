---
title: "TFS 2018 is out time to upgrade"
description: ""
date: 2017-11-22T19:00:37+02:00
draft: false
tags: [Team Foundation Server,Visual Studio ALM]
categories: [Team Foundation Server,Visual Studio ALM]
---
Some days are passed, but it is good to remind you that  **TFS 2018 is finally out.** Some people are surprised because after TFS 2015 we had TFS 2017 and we are still in 2017 and we already have version 2018, but this is the good part of the ALM tools in Microsoft,  **they are really shipping tons of new goodness each year** :).

[Release note page](https://www.visualstudio.com/en-us/news/releasenotes/tfs2018-relnotes) contains all the details about the new version, from that link you have a small 13 minute video that explain what is new in this version and as usual in the page you have a detailed list of all the news with detailed information about each of the new features.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2017/11/image_thumb-3.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2017/11/image-3.png)

I strongly suggest you to start [verifying system requirements](https://docs.microsoft.com/en-us/vsts/tfs-server/requirements) and planning for the upgrade, because, as usual **, it is a good habit to install the latest bit if possible, to avoid having to do a big bang upgrade after years of not upgrading**.

> It is always a good practice not to skip a single major version, the upgrade process will be smoother than doing a big jump (like people migrating from TFS 2008 to 2015/2017

Apart new features, the above link informs you on  **all the features that are actually removed from this version,** because they were deprecated in the old version. This can be an update blocker, but I strongly suggest you to start thinking to a remediation pattern, instead of being stuck forever in the 2017 version.

From removed features, Team Room is probably the least impacting, very few people are using it, and you can use Slack or other tools. Tfs Extension for SharePoint were also removed, this is also a feature that very few people will miss. The Lab Center in Microsoft Test Manager was also removed, but probably  **the most important missing feature is the XAML Build support**. In TFS 2018 you can only use the new build introduced with TFS 2015, no excuses guys, you really need to migrate every XAML build to the new format, as soon as possible.

Happy upgrading.

Gian Maria
