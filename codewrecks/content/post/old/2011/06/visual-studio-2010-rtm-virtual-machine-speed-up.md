---
title: "Visual Studio 2010 RTM Virtual Machine Speed up"
description: ""
date: 2011-06-28T07:00:37+02:00
draft: false
tags: [Tfs]
categories: [Team Foundation Server]
---
I usually use the [Brian Kellerâ€™s RTM Virtual Machine](http://blogs.msdn.com/b/briankel/archive/2011/05/12/may-2011-refresh-of-visual-studio-2010-rtm-virtual-machine-with-sample-data-and-hands-on-labs.aspx) to do TFS demo in talk or to customers. It comes on two flavors, a Virtual PC version and an Hyper-V version. If you use the Virtual PC version, is is originally configured to use 2 GB of ram and if you give it the maximum amount (3.6 GB) you can notice that the gain in speed is not so big.

I verified that the free space on Virtual Disk is quite low, (1.5 GB), so I added another vhd to the machine (it is a matter of seconds):

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2011/06/image_thumb12.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2011/06/image12.png)

 ***Figure 1***: *Secondary disk added to the Demo Virtual Machine*

Now I boot the machine, initialize and format the new HD, then move the paging file on this new disk. As a result I have now 5 GB free on primary disk and the VM seems to me to be more responsive. Since I usually demo TFS on a laptop with an SSD and an external E-Sata disk, I usually keep this new disk on my SSD (it is quite small, because it contains only paging file) while the main VHD file resides on my external disk. Since the demo machine has TFS, SQL Server, Sharepoint service, Office etc etc, having the paging file on different and fast HD usually gives me better performance.

alk.

Tags: [TFS](http://technorati.com/tag/TFS)
