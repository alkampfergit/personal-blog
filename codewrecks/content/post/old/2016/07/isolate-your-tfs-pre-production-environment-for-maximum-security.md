---
title: "Isolate your TFS Pre-Production environment for maximum security"
description: ""
date: 2016-07-23T08:00:37+02:00
draft: false
tags: [Tfs]
categories: [Tfs]
---
In previous post I’ve explained how to create a [clone of your TFS Production environment](http://www.codewrecks.com/blog/index.php/2016/07/16/create-a-pre-production-test-environment-for-your-tfs/) thanks to the new TFS “15” wizard. With this post I want to share you a simple solution I have in my Bags of Tricks to  **avoid your TFS Cloned environment to interfere with production environment**.

## The problem

In my environment I have all machines in network 10.0.0.0/24, my TFS has address 10.0.0.116 and Primary Domain Controller is 10.0.0.42. Then I have automated build and Release Management Definitions that deploy against various machines, : 10.0.0.180, 10.0.0.181, 10.0.0.182, etc.

Even if I used the wizard, or Command Line instructions to change TFS Servers id, there is always the risk that, **if a build starts from cloned environment, something wrong will be deployed to machines used by production environment (10.0.0.180, etc)**.

Usually the trick of changing hosts files in PreProduction TFS machines is good if you always use machine names in your build definition, but  **if I have a build that directly deploy to 10.0.0.180 there is nothing to do**. This exposes me at risk of production environment corruption and  **limits my freedom to freely use cloned TFS environment.** > What I want is complete freedom to work with cloned TFS Environment  **without ANY risk of accessing production machines from any machine of Cloned Enviroments (Build controllers, test agents, etc).** ## Virtualization to the rescue

Instead of placing pre-production environment in my 10.0.0.0/24 network, I use Hyper-V virtual networking capabilities to create an internal network.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2016/07/image_thumb-21.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2016/07/image-21.png)

 ***Figure 1***: *Virtual networks configured in Hyper-V hosts*

In Figure 1 I depicted what I have clicking the Virtual Switch Manager setting (1), and I have a virtual switch called “Internal Network” (2) that is configured as internal network (3). This means that **this network can be used by all VM to communicate between them and with the host, but there is no possibility to communicate to the real Production Network**. The Physical network card of Hyper-V host is bound to a standard “External Network”, it is called “ReteCablata” (4) and it is the network that can access machines in Production Network.

With this configuration I decided to install all machines that will be used for TFS Pre Production (server, build, etc) using only the “Internal Network”. The machine I’ll use as Pre Production TFS has the address 10.1.0.2, while the Hyper-V host will have the 10.1.0.254 address.  **This allows for my Hyper-V hosts to communicate with the Virtual Machine through the Internal Network virtual network interface**.

Now if I try to login to the machine with domain credentials I’ve got a bad error as result.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2016/07/image_thumb-22.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2016/07/image-22.png)

 ***Figure 2***: *I’m unable to login with domain users, because domain controller is unavailable.*

Accessing with local user is good, and the reason why I cannot login as domain user is because the machine is not able to reach the domain controller, since it lives in another virtual network.

Thanks to this solution I’ve created an isolated subnetwork where I can create my TFS Pre-production / Test environment without the risk of corrupting the Production Environment

> Thanks to Virtual Networking it is easy to create a virtual network completely isolated from your production environment where you can safely test cloned environment

## 

## Iptables to route only what-you-want

At this point I have an isolated environment, but since it cannot access my domain controller, I have two problems:

*1) PreProduction / Test Tfs cannot access the domain, and no domain users can access TFS  
2) To access the PreProduction / Test TFS you can only use the Hyper-V host.*

Clearly this made this approach almost impraticable, but the solution to this limitation is really really quick. Just install a Linux machine in the Hyper-V host to act as a router, in my example I have a standard Ubuntu Cloud server without UI. The important aspect is that  **you need to assign both Virtual Networks to the machine, so it can connect with both your isolated environment “Internal Network” and production environment “Rete Cablata”.** [![image](https://www.codewrecks.com/blog/wp-content/uploads/2016/07/image_thumb-23.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2016/07/image-23.png)

 ***Figure 3***: *Create a Linux VM and be sure to assign both network interfaces.*

In my box the physical network (ReteCablata) is eth0 while the internal network is eth1,  **both interface have static ip, and this is the configuration**.

{{< highlight bash "linenos=table,linenostart=1" >}}


gianmaria@linuxtest1:~$ cat /etc/network/interfaces
# This file describes the network interfaces available on your system
# and how to activate them. For more information, see interfaces(5).

# The loopback network interface
auto lo
iface lo inet loopback

# The primary network interface
auto eth0
iface eth0 inet static
     address 10.0.0.182
     netmask 255.255.255.0
     gateway 10.0.0.254
     dns-nameservers 10.0.0.42

auto eth1
   # iface eth1 inet dhcp
   iface eth1 inet static
   address 10.1.0.1
   netmask 255.255.255.0
   network 10.1.0.0

{{< / highlight >}}

The configuration is simple, this machine has 10.0.0.182 ip in my production network (eth0), and it the 10.1.0.1 ip in the internal virtual network (eth1).  **Now I configured all Windows machines in the internal virtual network to use this machine as gateway.** [![image](https://www.codewrecks.com/blog/wp-content/uploads/2016/07/image_thumb-24.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2016/07/image-24.png)

 ***Figure 4***: *Configuration for Pre-Production TFS Machine*

 **The important aspect is that it is using the ip in eth1 of linux machine as gateway (10.1.0.1), and it is using 10.0.0.42 as DNS (this is the address of my primary domain controller).** Now I can  **configure the linux box to become a router between the two networks** , you should enable forwarding as first step with the instruction

{{< highlight bash "linenos=table,linenostart=1" >}}


echo 1 &gt; /proc/sys/net/ipv4/ip_forward

{{< / highlight >}}

But this works only until you reboot the linux machine, if you want the configuration to survive a reboot you can edit /etc/sysctl.conf and change the line that says net.ipv4.ip\_forward = 0 to net.ipv4.ip\_forward = 1. When forwarding is enabled, you can configure iptables to route. Here is the configuration:

Disclaimer: I’m not absolutely a linux expert, this is a simple configuration I’ve done after studying a little how iptables works and thanks to articles around the web.

{{< highlight bash "linenos=table,linenostart=1" >}}


sudo iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE
sudo iptables -A FORWARD -i eth0 -o eth1 -m state  --state RELATED,ESTABLISHED -j ACCEPT
sudo iptables -A FORWARD -i eth1 -o eth0 -j ACCEPT
sudo iptables -I FORWARD -d 10.0.0.0/24 -j DROP
sudo iptables -I FORWARD -d 10.0.0.42 -j ACCEPT

{{< / highlight >}}

 **The first three instructions are standard rules to configure iptables to act as a router for ALL Traffic between eth0 and eth1 and vice-versa**. With only the first three rules all the machines in 10.1.0.0/24 network that uses 10.1.0.1 (the linux box) as gateway can access internet as well as ALL machine in network 10.0.0.0/24 (Production Network). This is not enough for me, because with this configuration machine in Cloned TFS Environment has FULL access to production machines.

 **The fourth rule tells to iptables to DROP all traffic from any direction to subnet 10.0.0.0/24.** This rule will completely isolates the two network, no machine can access the 10.1.0.0/24 from 10.0.0.0/24 and vice versa. Then  **the fifth and last rules tells iptables to ACCEPT all traffic from and to the address 10.0.0.42, my domain controller**.

> Thanks to iptables and a Linux box, it is really easy to create a router that selectively filter access from the two networks. This gives you the freedom to decide what machine of production environment can be accessed by cloned environment.

With this configuration  **I have created an isolated network that is capable of contacting ONLY my domain controller 10.0.0.42 but otherwise is COMPLETELY isolated from my production network.** This allows PreProduction / Test TFS machine to join the domain and validate users, but you can safely launch build or whatever you want in any machine of the Cloned environment because all traffic to production machine, except the domain controller, is completely dropped.

## How can I access PreProduction environment from client machine

Previous configuration solves only one of my two problems, PreProduction TFS can now access only selected machine of the domain (Domain Controller usually is enough) but  **how can you let Developers or Manager to access PreProduction environment to test cloned instance** ? Suppose a developer is using the 10.0.0.1 machine in production network, and he want to access PreProduction TFS at 10.1.0.2 address, how can you have it access without forcing him to connect to Hyper-V host and then use the Hyper-V console?

 **First of all you need to tell iptables to allow traffic between that specific ip and the isolated virtual network in eth1**.

{{< highlight bash "linenos=table,linenostart=1" >}}


sudo iptables -I FORWARD -d 10.0.0.1 -j ACCEPT

{{< / highlight >}}

This rules allow traffic with client ip so packets can flow from 10.0.0.1 to every machine in 10.1.0.0/24 network. This is necessary because we tell iptables to DROP every traffic to 10.0.0.0/24 except 10.0.0.42, so you need this rule to allow traffic to client Developer machine. All other machine in production network are still isolated.

Now the developer in 10.1.0.0 still can’t reach the 10.1.0.0 machine because it is in another subnet. To allow this  **he simply need to add a route rule in his machine**. Supposing that the 10.0.0.1 machine is a standard Windows machine, here is the command line the developer need to access Cloned Environment Machines.

{{< highlight bash "linenos=table,linenostart=1" >}}


route ADD 10.1.0.0 MASK 255.255.255.0 10.0.0.182

{{< / highlight >}}

Thanks to this roule the developer is telling to the system that  **all traffic to 10.1.0.0/24 subnet should be routed to 10.0.0.182** ,  **the address of the Ubuntu Linux machine in production environment**. Now when developer try to RDP the 10.1.0.2 machine (Cloned TFS Server) all traffic is routed by the linux machine.

## Final Consideration

> Thanks to this configuration all machines in the 10.1.0.0/24 network, can contact and be contacted only by selected production machines, avoiding unwanted corruption of your production environment.

This gives you complete contorol on the IP addresses that can access your Cloned environment, reducing the risk of Production Environment corruption to almost zero. You can allow access to selected machine, and also you can control which client machine in your production network can access Cloned Environment.

 **Remember that, after a reboot, all rules in iptables will be cleared and you need to setup them again**. You can configure Linux box to reload all rules upon reboot, but for this kind of environment, I prefer to have the ability to reboot Linux machine to completely reset iptables. Re-applying rules is a matter of couple of seconds.

Gian Maria.
