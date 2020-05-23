---
title: "Play security in a secure environment"
description: "When you experiment with security, it is useful to have a safe environment isolated from your production machines."
date: 2020-05-23T10:00:37+02:00
draft: false
tags: ["security"]
categories: ["security"]
---

**Security is one of my long passions**, I’ve spent lots of time on C++ and Assembly (both x86 and other architectures) and in that environment I've started exploring buffer overflow and other vulnerabilities. Over the course of years security remained only a passion and not my primary skill, but I spent constantly a little amount of time on it through the years.

When it is time to study offensive security, it is quite common to **download and install test vulnerable Virtual Machines to test some offensive strategies** and I’m quite surprised that most of the online tutorial simply tells you to use Virtual Box (sometimes VmWare workstation), in a very basic way and completely avoid exploring more advanced scenarios.

While most of these machines are pretty secure (I’m trusting VulnHub machines as an example), **when you do security testing, it is quite risky to use your production environment as front Gun. It could be risky also to use a Virtual Machine if it is on the very same Network of your primary machines.** Sometimes people not accustomed with virtualization think that a VM is confined inside the host, never is far from reality if you simply share your network card. Your VM will be another machine in the very same network of your host.

> Using a Virtual Machine sharing the Host NIC is probably not the most secure option.

Using client virtualization can expose you to some less frequent risk due to VM interfere with the host (spectre, meltdown, …) but this is a really less common problem. **My golden rule is, whenever VM downloaded from the internet, or every VM made by me where I'm going to install vulnerable products or some malware for analysis should be isolated by my primary network**.

For this specific reason I've setup an old server (bough on www.itsco.de) and an old workstation as dedicated virtualization environments. I've two distinct environments because one is running Hyper-V the other is running VmWare ESXi. Clearly **both of them having multiple NIC interfaces**, Hyper-V server has 2 NICs while VmWare has 4 Gigabits NICs. 

> Having multiple NICs on your virtualization system is the key to have more security while playing around with vulnerable software.

Actually I need to be super honest, if I'm [playing with something that I deemed to be dangerous](https://www.amazon.it/Practical-Malware-Analysis-Hands-Dissecting-ebook/dp/B007ED2XDS/ref=sr_1_fkmr0_1?__mk_it_IT=%C3%85M%C3%85%C5%BD%C3%95%C3%91&dchild=1&keywords=analyze+malware&qid=1590227303&sr=8-1-fkmr0) I prefer using an old laptop, running linux, connected to the internet through a completely different guest network from my office :). 

Both of those virtualization system are connected to my primary network in two different way, one NIC is connected directly to the managed switch, other NICS are connected to a router then to managed switch. **My Microtik router allows me to isolate that network from my real office and home networks**, the subnet where potentially dangerous machines live is not even routed on my primary network, it can reach only my ISP router to go on the internet if needed.

The net result is that all machines that lives in that isolated network can communicate between them with no problem, **they can communicate with the internet (updating my kali, communicating with test front gun server, etc)**, but no traffic is allowed to my main network. **Security is going other way around, no machine in my main network can access those machine in isolated network**. 

The only risk is for a VM to use some vulnerability of the CPU to compromise ESXi server (again spectre, meltdown), and from that server trying to compromise other machines. While this is a not so common situation, I’ve configured the router to drop TCP connections that originates from ESXi server to other machines in my work network.

Since I’m not a super network expert, **this is probably not bulletproof, but it is really better than firing a vulnerable Virtual Machine in production hardware with vmware or VirtualBox**. Also I do not really handle really dangerous material, but as an example, I use a Kali Machine on that network to play with Hack The Box.

Now only a question remains, if the Isolated Network is Isolated from my production machines, how can I really use those machines? **After all I want to be able not only to run vulnerable machine, but I want also to use a Kali machine on that network segment to exploit that machine)**. Thanks to ESXi I can connect to the cluster from any other computer because ESXi administration site is accessible on my office network, from cluster admin I can start/stop vm and I can use standard Web Interface to interact with the machine, I can even use remote console. That kind of connection is handled by ESXi server and it is like accessing the machine with virtual keyboard and mouse.

![Accessing VM in isolated network from vmWare Remote conosle](../images/kali-isolated-machine.png)

Figure 1: Accessing VM in isolated network from vmWare Remote conosle

Thanks to the remote console I can fully interact with machines, it supports live resizing and it is really responsive.

![Isolated machines are deployed in a 10.254.0.0/24 network, isolated from other networks.](../images/kali-isolated-network-address.png)

Figure 2: Isolated machines are deployed in a 10.254.0.0/24 network, isolated from other networks.

Issuing a Nmap against my domain controller returns no answer, that network segment is completely unreachable from that machine.

![Machines in isolated network cannot contact other machines in the network](../images/cannot-ping-domain-controller-from-isolated-network.png)

Figure 3: Machines in isolated network cannot contact other machines in the network.

Microtik router allows me to play with firewall rules and routing to temporary allow some network traffic to flow from some other network machine to the isolated network. As an example **I have some dedicated IPs from the work network that can contact some of the machines in isolated networks if I temporary enable some rules in the router**, actually I almost never used it, but it was an experiment to understand if that is possible.

![With a specific network rule I can open access from work network to Isolated network for specific IP/port/protocol](../images/contact-isolated-machine.png)

Figure 4: With a specific network rule I can open access from work network to Isolated network for specific IP/port/protocol

This setup allows me to have a safer environment to experiment with everything that I deemed to be insecure. **While this setup can be time consuming to create, it is really useful because it allows you to experiment with more real scenarios**, especially because you really have different physical network, separated by physical routers, physical NIC, real firewall etc.

I strongly suggest everyone that really wants to experiment with security to have a similar setup. All I needed was recycle some old hardware, buy some used Intel NIC, a Microtik router and a couple of managed switch and **a good amount of time :)**. ESXi software is free (you have limitation such as you are not able to backup your vm) for Hyper-V I have MSDN license for test, if you do not have license, but **in my opinion ESXi is your primary choice, especially because it is far way better than Hyper-V with virtualized UI running Linux machines**.

Gian Maria.