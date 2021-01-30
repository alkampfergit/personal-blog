---
title: "Multi monitor remote desktop on a Windows 7 virtual machine"
description: ""
date: 2011-09-27T16:00:37+02:00
draft: false
tags: [dev11,Virtual Machine]
categories: [Visual Studio]
---
To test dev 11 preview I’ve setup several virtual machines, just to be sure not to ruin my main installation box, since dev 11 is a *developer preview*and is not a good idea installing pre-beta release on production machine (even if dev 11 preview is really stable).

One of the annoying stuff in running inside a virtual machine is losing the ability to use all of your monitors… or not? If the virtualized and host operating system are Windows7 or Windows Server 2008, you can connect to the virtual machine using Remote Desktop (remember to enable it on windows7 because is not enabled by default), because it has full support for multiple monitors.

[![SNAGHTMLac4b5](https://www.codewrecks.com/blog/wp-content/uploads/2011/09/SNAGHTMLac4b5_thumb.png "SNAGHTMLac4b5")](https://www.codewrecks.com/blog/wp-content/uploads/2011/09/SNAGHTMLac4b5.png)

You can just select “use all my monitors for the remote session” and you are done, also go to Experience tab and specify that you have a LAN connection so everything is enabled in the virtualized machine. Thanks to this simple trick you can now connect to the VM in full screen on all of your monitors. The experience is really great, because thanks to my SSD disk, the virtual machine is fast as the host one, and I have a super fast dev 11 experience ![Smile](https://www.codewrecks.com/blog/wp-content/uploads/2011/09/wlEmoticon-smile.png)

Gian Maria.
