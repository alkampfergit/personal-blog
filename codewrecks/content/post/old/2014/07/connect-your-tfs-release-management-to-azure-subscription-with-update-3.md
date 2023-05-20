---
title: "Connect your TFS Release Management to Azure subscription with Update 3"
description: ""
date: 2014-07-31T04:00:37+02:00
draft: false
tags: ["ContinuousDeployment"]
categories: [Tfs]
---
In the Update 3, now in RC, you have the ability to configure your Release Management to directly access your Azure Subscription to have a list of all of your environment. The operation is really simple, you need to  **go to Administration tab and then choose to Manage Azure**.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2014/07/image_thumb22.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2014/07/image22.png)

 ***Figure 1***: *Adding your subscription to Release Management*

Adding a new Subscription is just a matter to enter some information taken from a valid publish certificate. If you have not available a valid certificate, the easiest way to obtain a new one is going to this url [https://windows.azure.com/download/publishprofile.aspx](https://windows.azure.com/download/publishprofile.aspx "https://windows.azure.com/download/publishprofile.aspx"). Once authenticated a new management certificate will be downloaded. Please do not abuse this functionality, or you will end with a lot of certificates.

 **Once you have downloaded a valid certificate, it contains everything you need to connect your azure subscription to Release Management.** You need to copy your subscription Id and your management certificate.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2014/07/image_thumb23.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2014/07/image23.png)

 ***Figure 2***: *Copy data from your management certificate*

If you installed the CTP preview of Update3 you can notice that now you have another field to fill, called *Storage Account Name*. You need to copy a name of one valid account storage from your azure management account.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2014/07/image_thumb24.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2014/07/image24.png)

 ***Figure 3***: *Copy all the info from your certificate and account to Release Management.*

Now you need to wait some minutes, because the sync is done by a service that runs in the background that periodically check for availability of environments.  **If no machine shows up after few minutes, please check the Event Viewer of the machine where Release Management Server is running and try to restart the service called Release Management Monitor**.

Once the service is able to synchronize with your account you should see all of your Azure VMs now available as servers inside release management.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2014/07/image_thumb25.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2014/07/image25.png)

 ***Figure 4***: *All of your Azure Virtual Machines are now available in the Servers list.*

If you [installed the Deployer Agent to some of the VM](http://www.codewrecks.com/blog/index.php/2014/06/11/install-and-configure-a-tfs-release-manager-deployer-agent-in-azure-vm/) those machines are listed with a Deployer Status of Ready, all of the other machines have a Deployer Status of Offline, because no Deployer Agent is present on those machines. Machines that have no Deployer Agent deployed can be used as target of deployment using powershell DSC.

Actually Release Management load information for every VM in your account, even Linux machines. This is not weird because if you missed it, actually PowerShell DSC is being ported to Linux as you can read from this article: [Announcing Windows PowerShell Desired State Configuration for Linux](http://blogs.msdn.com/b/powershell/archive/2014/05/19/announcing-windows-powershell-desired-state-configuration-for-linux.aspx).

Gian Maria.
