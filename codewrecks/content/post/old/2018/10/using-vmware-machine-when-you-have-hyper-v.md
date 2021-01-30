---
title: "Using vmWare machine when you have Hyper-V"
description: ""
date: 2018-10-03T17:00:37+02:00
draft: false
tags: [Security,Virtual Machine]
categories: [General]
---
There are lots of VM containing Demo, Labs etc around the internet and surely Hyper-V is not the primary target as virtualization system. This because it is present on desktop OS only from Windows 8, it is not free (present in windows professional) and bound to windows. If you have to create a VM to share in internet, 99% of the time you want to target vmWare or Virtual Box and a linux guest system (no license needed). Since Virtual Box can run vmWare machine with little problem, vmWare is de-facto the standard in this area.

> Virtual Machines with demo, labs etc that you find in the internet are 99% targeted to vmWare platform.

In the past I’ve struggled a lot with  **conversion tools that can convert vmWare disk formats to Hyper-V format** , but sometimes this does not work because virtualized  **hardware is really different from the two systems**.

If you really want to be productive, the only solution I’ve found is installing an ESXi server on an old machine, an approach that gives me lots of satisfaction. First of all  **you can use the** [**Standalone conversion tool**](https://www.vmware.com/support/developer/ovf/) **of vmware to convert a vmWare VM to OVF standard format in few minutes, then upload the image to your ESXi** server and you are ready to go.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2018/10/image_thumb.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2018/10/image.png)

 ***Figure 1***: *A simple command line instruction convert VM into OVF format*

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2018/10/image_thumb-1.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2018/10/image-1.png)

 ***Figure 2***: *From the esxi interface you can choose to create a new VM from OVF file*

Once you choose the ofv file and the disk file you just need to specify some basic characteristics for the VM and then you can simply let the browser do the rest, your machine will be created into your ESXi node.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2018/10/image_thumb-2.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2018/10/image-2.png)

 ***Figure 3***: *Your VM will be created directly from your browser.*

The second advantage of esxi is that it is a real mature and powerful virtualization system available for Freee.  **The only drawback is that it needs a serious Network Card, it will not work with a crappy card integrated into a consumer Motherboard**. For my ESXi test instance I’ve used my old i7-2600K with a standard P8P67 Asus motherboard (overclocked) and then I’ve spent a few bucks (50€ approx) to buy a used network card 4xGigabit. This gives me four independent NICs, with a decent network chip, each one running at 1Gbit. Used card are really cheap, especially because there are no driver for latest operating system so they are thrown away on eBay for few bucks.  **When you are using a Virtual Machine to test something that involves networks, you will thanks ESXi and decent multiple NIC card** because you can create real network topology, like having 3 machines each one using a different NIC and potentially connected to different router / switch to test a real production scenario.

> ESXi NIC virtualization is FAR more powerful than Virtual Box or even vmWare Workstation when installed with a real powerful NIC. Combined with multiple NIC card you have the ability to simulate real network topologies.

If you are using Linux machine, vmWare environment has another great advantage over Hyper-V, it supports all resolutions, you are not limited to Full-Hd with manual editing of grub configuration, you can change your resolution from Linux control panel or directly enable live resizing with the Remote Console available in ESXi.

If you really want to create a test lab, especially if you want to do security testing, having one or more ESXi hosts is something that pays a lot in the long distance.

Gian Maria
