---
title: "Where is my Azure VM using Azure CLI"
description: ""
date: 2015-10-14T18:00:37+02:00
draft: false
tags: [Azure]
categories: [Azure]
---
Azure command line interface, known as [**Azure CLI**](https://azure.microsoft.com/en-us/documentation/articles/xplat-cli/) **is a set of open source, cross platform commands to manage your Azure resources**. The most interesting aspect of these tools is that they are Cross Platform and you can use them even on Linux boxex.

After you imported your certificate key to manage your azure account you can issue a simple command

{{< highlight bash "linenos=table,linenostart=1" >}}


azure vm list

{{< / highlight >}}

To simply list all of your VM of your account.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2015/10/image_thumb14.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2015/10/image14.png)

 ***Figure 1***: *Output of azure vm list command*

 **If you wonder why not of all your VMs are listed, the reason is, Azure CLI default to command mode asm, so you are not able to manage resources created with the new Resource Manager**. To learn more I suggest you to read this couple of articles.

[Use Azure CLI with Azure Resource Manager](https://azure.microsoft.com/en-us/documentation/articles/xplat-cli-azure-resource-manager/)  
[Use Azure CLI with Azure Service Management](https://azure.microsoft.com/en-us/documentation/articles/virtual-machines-command-line-tools/)

If you want to use new Resource Manager you should switch with the command:

{{< highlight bash "linenos=table,linenostart=1" >}}


azure config mode arm

{{< / highlight >}}

But now if you issue the vm list command, probably you will get an error telling you that you miss authentication. Unfortunately you cannot use certificate to manage your account (as you can do  with Azure PowerShell or Azure CLI in config mode asm).  **To authenticate with Azure Resource Manager mode you should use the command** {{< highlight bash "linenos=table,linenostart=1" >}}


azure login

{{< / highlight >}}

But you need to use an account created in your Azure Directory, and not your primary Microsoft Account (at least mine does not work). [This article](https://azure.microsoft.com/en-us/documentation/articles/xplat-cli-connect/) will guide you on creating an user that can be used to manage your account. Basically you should go in old portal, get to the Active Directory Page and create a new account. Then from the global setting pane you should add that user to the Subscription Administrator group.  **Please use a really strong password, because that user can do everything with your account**.

When you login correctly into Azure from CLI, you can use the same command to list VMs, but now you will see all VMs that are created with the new Resource Manager.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2015/10/image_thumb15.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2015/10/image15.png)

 ***Figure 2***: *In arm mode you are able to list VM created with the new Resource Manager.*

This happens also in standard Azure Portal GUI, because you have two distinct node for Virtual Machine, depending if they are created with Azure Service Management or Azure Resource Manager.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2015/10/image_thumb16.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2015/10/image16.png)

 ***Figure 3***: *Even in the portal you should choose which category of VM you want to manage*

Gian Maria
