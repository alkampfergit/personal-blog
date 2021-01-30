---
title: "Configuring Lab Management problem with network location"
description: ""
date: 2009-12-23T16:00:37+02:00
draft: false
tags: [Lab Management]
categories: [Team Foundation Server]
---
You can check the original post [here](http://blogs.msdn.com/lab_management/archive/2009/06/08/networking-basics-for-lab-management-part-i.aspx), but I want to explain again how you can solve problem with network location during setup of Lab Management (because it happened to me both time I configured labmanagement, in desktop machine and in laptop machine), the problem manifests itself with this symptom

[![Capture](https://www.codewrecks.com/blog/wp-content/uploads/2009/12/Capture_thumb.png "Capture")](https://www.codewrecks.com/blog/wp-content/uploads/2009/12/Capture.png)

You configure your machine with SCVMM, you test it and everything went ok, but the combo with network location is empty. I manually setup nablasoft.com as network location, but Iâ€™ll end with configuration warnings telling me

> *The network location for the following host group could not be verified: [host group:All Hosts, host:*[*ltlab.nablasoft.com*](http://ltlab.nablasoft.com)*] TF259210: Team Foundation Server was unable to find the following network location:*[*nablasoft.com*](http://nablasoft.com)*, on a Hyper-V host*[*ltlab.nablasoft.com*](http://ltlab.nablasoft.com)*. Wait several minutes, and then pause or shutdown and start the environment try the operation again. If the problem persists, confirm the Hyper-V host is available on the network and has appropriate permissions configured for Team Foundation Server.*

The solution to this problem can be found following the instruction on the [original post](http://blogs.msdn.com/lab_management/archive/2009/06/08/networking-basics-for-lab-management-part-i.aspx), and it deals with configuration of the virtual networking. To solve this you can simply go to scvmm and verify the property of the host

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2009/12/image_thumb17.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2009/12/image17.png)

You need to be sure that you have a network location, in my situation it was blank, so I simply decide to override it. Here is the final configuration

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2009/12/image_thumb18.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2009/12/image18.png)

Now I had another problem, I already deployed the virtual machine with TFS 2010 beta, so I simply stopped it and verify its properties. I again verified that no network location is present so I use my nablasoft.com

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2009/12/image_thumb19.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2009/12/image19.png)

Now I start the machine again, go to tfs configuration and everything is ok. During setup of Lab Management, [you can also refer to This post](http://blogs.msdn.com/lab_management/pages/troubleshooting.aspx#e1_3), that contains some of the most common cause of errors during setup of lab management, along with the corresponding solution.

Alk.

Tags: [Lab Management](http://technorati.com/tag/Lab%20Management)
