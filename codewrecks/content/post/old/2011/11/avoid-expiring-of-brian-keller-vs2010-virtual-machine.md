---
title: "Avoid expiring of Brian Keller VS2010 virtual machine"
description: ""
date: 2011-11-01T10:00:37+02:00
draft: false
tags: [Tfs,Virtual Machine]
categories: [Tfs]
---
Brian Keller always does a great work releasing a [Demo Machine with all the goodness of VS2010 and TFS2010](http://blogs.msdn.com/b/briankel/archive/2010/06/25/now-available-visual-studio-2010-rtm-virtual-machine-with-sample-data-and-hands-on-labs.aspx), really useful for making demo and courses. The only drawback is that this machine expires after 6 months, and if you did some customization on it, or prepared some customized hands-on-lab, you usually need to do everything again with the new machine. (Brian release a new machine updated with the latest tool some days before the expiration of the old machine).

If you have MSDN and all the keys of the various software you can simply insert all of your product codes to avoid expiration of the machine. Apart from inserting a valid windows 2008 key and office key, that is quite simple you need to upgrade SQL Server from the demo version to the full version. To do this, simply mount a valid Sql Server Iso downloaded from your MSDN, go to the " **Maintenance** ” section, then choose an  **Edition Upgrade** and you are done.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2011/11/image_thumb.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2011/11/image.png)

When the machine expires your Visual Studio will ask you for a license, but since your Visual Studio Iso from MSDN are pre-pidded (they have serial number included in the iso), the common question is “where I find the Visual Studio product number in MSDN?”. The answer is [in this post](http://blogs.microsoft.co.il/blogs/shair/archive/2010/04/14/visual-studio-tfs-2010-is-pre-pidded-installation-how-to-separate-product-key-from-setup.aspx), just mount the iso in a virtual Dvd-drive, go to the setup folder, look for the setup.sdb file, open it with a text editor and search product key section. The same trick works to extract the Serial number of TFS from MSDN iso.

When you upgraded: operating system, Office, Sql Server (upgraded), TFS and Visual Studio you should be able to continue to use the virtual machine even after the expiring time.

IMPORTANT: Please be aware that you cannot use this machine in production for any reason, inserting your MSDN codes should only be used to continue to use the machine for internal testing, evaluation and demo purpose only.

Gian Maria.
