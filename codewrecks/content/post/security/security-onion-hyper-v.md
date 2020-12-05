---
title: "Security onion in Hyper-V"
description: "Some tips if you want to use Security Onion in an Hyper-v virtual machine"
date: 2020-12-05T11:14:37+02:00
draft: false
tags: ["security", "nsm"]
categories: ["security"]
---

If you want to setup a real lab to test Network Security Monitor solution, like [Security Onion](https://securityonionsolutions.com/) probably you will start with some **virtual machine where to install everything**. While we can agree that VmWare is probably the best solution (I have a test ESXi node) Hyper-V can be a viable solution, but you need to be aware of some glitches.

> Most of the information I've found in internet are outdated and probably not valid for Windows Server 2019, as you can see in **Figure 2**. Hope this post can save time to others that have my same problem.

I've depicted the basic steps in these two YouTube video that summarize my journey:

### First part, configuring mirroring

{{< youtube j0WSvYq8T2Q >}}

### Second part, troubleshooting

{{< youtube DPo8m2TwXak >}}

The main problem arise if you are creating a **real lab, where you configure a physical Switch or you use a TAP adapter to redirect traffic on a mirror port**. Virtual machine connected to that port needs to be able to use promiscuous mode to grab everything that pass in that specific port, easy? No!.

If you are using bare metal, there are no problem at all, but when you use a virtual machine **it is connected only to virtual NIC, not physical ones, so you need to deal with the concept of Virtual Switch**. Now I'm far from being called an expert in Networking, and this can explain why I missed an important part of the configuration. These two video are a reminder on how you can accomplish the configuration.

> If you want to skip the video, I'll explain here my journey.

You can start from this [nice article](https://cloudbase.it/hyper-v-promiscuous-mode/) of my friend Alessandro. But you can find other articles on the subject, like [this one from tenable](https://docs.tenable.com/nnm/Content/HyperVPromiscuousMode.htm) that offers you half of the solution. If you check [this nice article](https://cybersecurity.att.com/documentation/usm-anywhere/deployment-guide/hyperv/getting-traffic-from-physical-network-hyper-v.htm) it gives you **almost** what you need, but it is wrong in this point (more on it later)

![VLAN configuration](../images/vlan-wrong.png)
***Figure 1***: *VLAN Configuration*

All the articles I've found have a section dedicated to people that **are using VLAN, in Figure 1 you can read "IF YOUR ENVIRONMENT USES A VLAN"** and I've completely skipped this part since I'm not using VLAN.

Now I configured everything in my test server, did the first video and it seems that everything is ok, Security Onion showed data and I though that it was ok. Then **I started doing some real analysis with that machine and nothing was OK**. Basically the machine was seeing only half the traffic of my network.

The first setup took me minutes (three lines of PowerShell), these part took me 4 hour to figure out the solution. I've found also a post by [one poor guy that has my same problem](https://social.technet.microsoft.com/Forums/azure/en-US/29038036-d6e9-4b2d-ba40-4b03ab0a86a1/hyperv-vswitch-monitor-mode-set-to-source-gives-only-unidirectional-traffic-on-destination-vm?forum=winserverhyperv) and it was still unresolved.

One things bugged me a lot, and is the last post of the thread.

![Everything worked in Windows 2016 not in 2019](../images/difference-hyper-v-2019.png)
***Figure 2***: *Everything worked in Windows 2016 not in 2019*

> All the information I've found are quite old and are probably obsolete.

What sent me on the complete wrong direction is an information **found on many blog posts, that in order for my configuration to work correctly, NDIS extension is what I need to check**. Indeed my NDIS configuration does not work correctly, so I went for 4 hours in a Rabbit Hole trying to resolve the problem.

![NDIS ERRORS](../images/NDIS-Errors.png)
***Figure 3:*** *Ndis Errors*

> I exited the rabbit hole when I completely disabled the Microsoft NDIS Capture, and **still the machine was receiving half the traffic**.

The real problem in all the articles I've found on the internet is that they consider optional setting the card in Trunking mode unless you are using VLAN. **That part is mandatory.**

This confirmed me that NDIS is not the culprit. Then I've started thinking on this configuration, after all there is my physical switch that is mirroring a port, into another switch that, in turn, should redirect all the traffic onto a virtual network. **So I started thinking that, after all, probably I needed to setup virtual network in trunking mode to work**.

Going in that direction I've found [this article](https://serverfault.com/questions/887066/one-way-traffic-with-port-mirror-hp-2610-to-hyper-v) and it was the only place **I found that confirm my suspicions, I needs to use the very same PowerShell command used for VLAN traffic even if I'm not using VLAN** because:

![VLAN default in Hyper-V](../images/VLAN.png)
***Figure 4:*** *VLAN default in Hyper-V*

I didn't look for confirmation but if Hyper-V defines untagged VLAN with VLAN ID 0, surely setting the virtual network in trunking mode is needed. PowerShell instruction in that post are somewhat wrong, here is the correct way **to set a Virtual Nework in trunking mode for an Hyper-V virtual machine**

{{< highlight powershell "linenos=table" >}}
$a = Get-VMNetworkAdapter -vmname testmirror
$a #Look at all network adapter

#Rename the cards so you can distinguish between them
rename-VMNetworkAdapter -VMNetworkAdapter $a[0] -newname "LAN"
rename-VMNetworkAdapter -VMNetworkAdapter $a[1] -newname "LAN_Mirror"

#Finally enable trunking on mirror port
Set-VMNetworkAdapterVlan -VMName testmirror -VMNetworkAdapterName LAN_Mirror -Trunk -AllowedVlanIdList 1-100 -NativeVlanId 0
{{< / highlight >}}

The above snippet simply grab all Virtual Network cards from a virtual machine called testmirror, then it rename both of them because in the last part **you need to set trunking mode only for the Virtual Machine connected to the SPAN port of the Switch**. This is annoying, Hyper-V gives the same name to all virtual network cards and you can rename only with PowerShell. 

> Pay attention to the configuration, because if you miss -VMNEtworkAdapterName you will set every Virtual Network of the Virtual Machine in trunking mode 

Before doing this do a backup of the machine, while I was experimenting I did something wrong in PowerShell and I got a Corrupted machine. I don't know why, but before **fiddling with configuration do a backup, it is always a good practice**.

Now everything was ok and my test machine is receiving all the traffic. I've did the very same configuration on at least three VM with two different physical hosts (Windows Server 2019 and Windows 10) **and this solves the problem in both situation** so I'm confident that this is the right way to proceed.

Hope this can help someone.

Gian Maria.