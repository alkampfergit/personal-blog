---
title: "Kali Linux in Hyper-V system"
description: "With little effort you can have a pleasant experience using Desktop Linux in Hyper-V environment."
date: 2020-12-30T10:00:37+02:00
draft: false
tags: ["security"]
categories: ["security"]
---

## Kali Linux on Windows

Most of the time a [Kali Linux instance running in WSL](https://www.codewrecks.com/post/security/kali-linux-in-wsl2/) is more than enough to have some fun in a Windows box. Using WSL is really simple but **I have a couple of annoying problems that make my experience uncomfortable.**

1. UI experience is sluggish, and annoying
1. I have very little control over networking.

Point 2 is the major pain point in my situation, I usually buy some inexpensive [Intel i350 T2 cards](https://www.codewrecks.com/post/security/kali-linux-in-wsl2/) on Ebay, to allow me to have **at least three Network Card on my workstation**. If you wonder why I like three NICs here is my typical usage pattern.

- Intel card on the motherboard is the one used by the Host operating system
- One of the i350 interface is used with Hyper-V virtual switch to connect to office network
- The other i350 interface is used with Hyper-V virtual switch to connect to an isolated network.

Both the i350 interfaces are not shared with the operating system, the second one **is physically connected to a port of my Microtik router that has a complete different network and is completely isolated from my office network**. That is the network where I have VM to play with security, like connecting to Hack The Box or TryHackMe VPN and so on.

> I always preferred VmWare virtualization system for Desktop Linux VMs, due to superior GUI performance.

I used in the past VmWare ESXi because it has a better support with management console, while in Hyper-V you are usually stuck with **FullHD maximum resolution, sluggish mouse, and unable to resize**. But here I was missing a nice piece of the puzzle, you can enable the enhanced connection in Hyper-V console, you just need to clone this repository [https://github.com/Microsoft/linux-vm-tools.git](https://github.com/Microsoft/linux-vm-tools.git), go to linux-vm-tools/ubuntu/18.4 and run install.sh script. 

In latest Kali Linux version this is not enough, because a systemctl status xrdp.service usually shows that the service failed to start. Thanks to This article [https://medium.com/@labappengineering/ubuntu-20-04-on-hyper-v-8888fe3ced64](https://medium.com/@labappengineering/ubuntu-20-04-on-hyper-v-8888fe3ced64) I've found the solution. **Basically you need to tweak /etc/xrdp/xrdp.ini to fix fsock configuration**.

![Xrdp ini configuration file](../images/xrdp-configuration.png)

***Figure 1***: *Xrdp ini configuration file*

Now do not forget to try to start xrdp service, verify if it is running correctly and enable to have it autostart with the VM. 

{{< highlight bash "linenos=table" >}}
sudo systemctl start xrdp.service
sudo systemctl enable xrdp.service
{{< / highlight >}}

![Xrdp service up and running](../images/xrdp-service-up-and-running.png)

***Figure 2***: *Xrdp service up and running*

At this point it should work, but in my situation I needed **to manually tell hyper-v to use enhanced session for that specific virtual machine**.

{{< highlight powershell "linenos=table" >}}
Set-VM -VMName <your_vm_name> -EnhancedSessionTransportType HvSocket 
{{< / highlight >}}

Now I suggest you to shutdown VM, close Hyper-V console, then restart the machine, this time **when you open the console you should be prompted with a box that ask you the resolution you want to use**.

![Enhanced connection is now active on the vm](../images/enhanced-connection-active.png)

***Figure 3***: *Enhanced connection is now active on the vm*

As you can see from **Figure 3** the icon of the Enhanced connection seems to be disabled, but **if it is asking you display configuration, the console is trying to connect with xrdp**. If you close that Window you can connect with the usual console, you should see a standard login but you can switch back to enhanced connection with the standard icon.

![Standard console connection for the VM](../images/standard-connection-kali.png)

***Figure 4***: *Standard console connection for the VM*

In **Figure 4** you can see that the enhanced connection button is now active, you can press to switch to enhanced connection mode.

> When you enable enhanced connection you have the ability to decide which connection type you want to use.

It is imperative to know **that even if you are using xrdp server, connection is not done through network interface**, this allow you to have the VM in a complete different network of your host, but at the same time being able to use without problem. As a proof **you can turn down network connection entirely, but you still can control your machine through xrdp**.

![No interface is connected but I still able to access the machine through xrdp](../images/xrdp-connected-with-interface-down.png)

***Figure 5***: *No interface is connected but I still able to access the machine through xrdp*

> The ability to connect to the machine with standard console or enhanced one is important if you encounter problem with software running in an xrdp session.

But the question is: after all this work, do I really have more than a standard WSL2 machine that **I could have started in mere minutes?**. Remember that to have this setup you need to create an Hyper-V vm, going through OS installation, configure XRDP, etc. Well, first of all I can connect with full resolution.

![Full resolution kali](../images/kali-in-full-release.png)

***Figure 6***: *Full resolution kali*

> Nowadays 2K or 4K monitors are the norm, being limited to FullHD makes Desktop experience a pity. It is imperative to use full monitor resolution for your VMs.

But I can also **use copy and paste text from host system and the virtual machine** and the overall experience is improved: mouse movement is smoother, resolution is ok, colors are ok, etc. Thanks to enhanced connection I can use a Hyper-V based Linux machine that **resides on a complete different network from the host, is isolated to office machines but has a nice and smooth desktop experience through virtualization software console**.

Gian Maria.
