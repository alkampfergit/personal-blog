---
title: "Maintenance for build agent in TFS Build"
description: ""
date: 2017-05-06T07:00:37+02:00
draft: false
tags: [build]
categories: [Tfs]
---
Each TFS Build agent uses a local directory to download source, do build, prepare artifacts and if you have really high number of builds, you could run out of space in agent disks.

To minimize this problem VSTS contains a Settings tab in pool configuration that allows scheduling of Agent Maintenance job as you can see in  **Figure 1**.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2017/05/image_thumb.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2017/05/image.png)

 ***Figure 1***: *Enabling agent schedule mainteinance*

When an agent perform maintenance basically it deletes all working directory that were not used for more than a certain number of days (default 30). This will allow disk cleanup and you will not waste space for old builds or builds that were migrated to other pools.

This setting is especially useful for all  **pools that are running on SSD or NVMe disk, where usually you can schedule build manually** when you really need that a build should be executed really fast. Having pools with High End hardware allows you to manually schedule high priority build on fast build machine, but this usually means that agents directory space is used by build that probably will not be scheduled for a long time. In that scenario you can configure a much smaller number of days before deleting a directory, like 2 or 3.

Gian Maria Ricci.
