---
title: "Where is my DNS name for Azure VM with new Resource manager"
description: ""
date: 2015-10-11T07:00:37+02:00
draft: false
tags: [Azure,linux]
categories: [Azure]
---
Azure is changing management mode for resources, as you can read from [this article](https://azure.microsoft.com/en-us/documentation/articles/resource-manager-deployment-model/) and this is the reason why, in the new portal, you can see two different entry for some of the resources, ex: Virtual Machines.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2015/10/image_thumb8.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2015/10/image8.png)

 ***Figure 1***: *Classic and new resource management in action*

Since the new model has more control over resources,  **I’ve create a linux machine with the new model to do some testing**. After the machine was created I opened the blade for the machine (machine create with the new model are visible only on the new portal) and I noticed that I have no DNS name setting.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2015/10/image_thumb9.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2015/10/image9.png)

 ***Figure 2***: *Summary of my new virtual machine, computer name is not a valid DNS address*

Compare **Figure 2** with  **Figure 3** , that represents the summary of a VM created with the old resource management. As you can see the computer name is a valid address in domain cloudapp.net

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2015/10/image_thumb10.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2015/10/image10.png)

 ***Figure 3***: *Summary of VM created with old resource management, it has a valid DNS name.*

Since these are test VM that are off most of the time, the IP is chaning at each reboot, and I really want a stable friendly name to store my connection in Putty/MremoteNG.

From the home page of the portal, you should see the resource manager group where the machine was created into. If you open it, you can see all the resources that belongs to that group. **In the list you should see your virtual machine as well as the IP Address resource (point 2 in Figure 4) that can be configured to have a DNS name label**. The name is optional, so it is not automatically setup for you during machine creation, but you can specify it later.

[![SNAGHTML280a6d](https://www.codewrecks.com/blog/wp-content/uploads/2015/10/SNAGHTML280a6d_thumb.png "SNAGHTML280a6d")](https://www.codewrecks.com/blog/wp-content/uploads/2015/10/SNAGHTML280a6d.png)

 ***Figure 4***: *Managing ip addresses of network attached to the Virtual Machine*

Now I set the name of my machine to docker.westeurope.cloudapp.azure.com to have a friendly DNS for my connection.

Enjoy.
