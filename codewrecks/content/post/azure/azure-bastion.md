---
title: "Access your azure VM with Azure Bastion"
description: Accessing your Azure VM with a standard RDP exposed on public address is not a good idea, let's see how to use Azure Bastion to overcome this problem
date: 2020-07-11T10:45:18+02:00
draft: false
tags: ["Azure", "security"]
categories: ["Azure"]
---

There are lots of reasons to use a classic VM in Azure, even if PAAS is the preferred way to approach the cloud, IAAS is still strong especially because not every product is ready to run on cloud providers.

If you have the need to create a standard VM, both Linux or Windows, you probably want an access with SSH or RDP to configure and manage it and **using a public address is probably the quickest, but less secure way, to do it.**

> There are services that constantly scan the entire network for specific open ports (like RDP and SSH) and this lead to brute force or vulnerability based attacks.  

While **having a SUPER strong password for your machine is a must, I really do not want my VM to have RDP port on a public ip**. Using firewall to open temporarily port on your current ip is a good protection, but it is error prone. Most of the time in fact you are using VMs to host some internal services that have no need to be exposed to the public, therefore I do not want my VM to have a public access.

Now the question is:  if the machine does not have a public IP, how can I have access to configure / maintain it? An obvious solution is to setup a VPN but likely enough now Azure has a new service called: [Azure Bastion](https://azure.microsoft.com/en-us/services/azure-bastion/#features).

I decided to give it a try and I found it super easy to configure, first of all I created a VM without a public IP, then I've taken the default virtual network created in my resource group where the VM lives, and added another address space 10.100.0.0/24 as you can see in **Figure 1**.

![Vnet configuration](../images/bastion-configuring-vnet.png)
***Figure 1***: *Vnet configuration*

Once I have this other address space I used it to create a special subnet named AzureBastionSubnet **Figure 2**.

![Create a subnet for bastion](../images/bastion-subnet.png)
***Figure 2***: *Create a subnet for bastion*

Now in the connect VM configuration section you can configure Bastion instead of SSH or RDP. **Just type username and password and you are connected to the VM with a nice client that runs perfectly inside your browser**. Your connection is routed through your subscription connection, no RDP port exposed to a public ip, nevertheless  you can manage your machine with zero effort.

It works nicely not only with RDP but also with SSH

![SSH connection with bastion](../images/bastion-ssh-connection.png)
***Figure 3***: *SSH connection with bastion*

> Thanks to bastion I can easily manage my Azure VMs without zero extra effort, but without the need of a public IP.

As you can see from **Figure 3** my linux machine has no public IP address, but I can easily connect with a nice SSH terminal running in the browser. As you can read in [Official Documentation](https://azure.microsoft.com/en-us/services/azure-bastion/#features) the connection is routed through the browser in standard 443 port, limiting port scanning and accidental service exposure.

Gian Maria.