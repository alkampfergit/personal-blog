---
title: "Use Kali linux in Windows Subsystem for Linux "
description: "Now that WSL2 has a real full Linux Kernel using Kali Linux in WSL2 is a nice option to have."
date: 2020-06-26T10:00:37+02:00
draft: false
tags: ["security", "kali"]
categories: ["security"]
---

## Kali Linux on Windows

Thanks to the new Windows Subsystem for Linux version 2, shortly called WSL2, we have now **a real Linux kernel running in a real VM as the core of WSL**. This allows finally to use Kali Linux in WSL environment; if you tried in WSL you probably encountered some errors with network tools like NMap. With WSL2 everything seems to run just fine giving you a *quick way to have a Kali Linux running in your Windows system* while having full integration between file systems.

Configuring Kali in WSL2 is really simple, you just install the distribution from the Windows Store, fire up WSL2 and finally do not forget to install tools you need, **because version installed in WSL2 is a minimal Kali installation** and it does not have all the tool you find in a full install.

> When you install Kali in WSL2 please note that you starts with a minimal installation so you need to install packages.

The first thing to do is running a full upgrade of everything

{{< highlight bash "linenos=table" >}}
sudo apt update
sudo apt full-upgrade
{{< / highlight >}}

After a full update you are ready to install tools and you can use [Kali Linux Metapackages](https://tools.kali.org/kali-metapackages) to quickly install what you need. A metapackage basically  allows you to choose a subset of tool with a single command without the need to install tools one by one. As an example you can start **installing Top 10 tools with metapackage kali-tools-top10**

![Kali top 10 tools metapackage](../images/kali-top-10-tools.png)
***Figure 1***: *Kali top 10 tools metapackage is a good starting point.*

A complete list of all metapackages can be found [in Kali Website](https://tools.kali.org/kali-metapackages). As an example to install top 10 tools you can simply run

{{< highlight bash "linenos=table" >}}
sudo apt install kali-tools-top10
{{< / highlight >}}

After the installation all tools should be available and ready to run.

![SqlMap is installed](../images/sqlmap.png)
***Figure 2***: *Sqlmap is ready to be used.*

>With few click you have a full Kali Linux up and running with all the tool you need.

## Connect with xrdp

Once Kali is up and running, you probably need a GUI to use some programs like Wireshark, **thanks to xrdp you can use Remote Desktop to access GUI of Kali instance without any problem**. You just need to install a few packages.

{{< highlight bash "linenos=table" >}}
sudo apt-get install xfce4
sudo service install xrdp
{{< / highlight >}}

Xfce is a really light Desktop Environment it uses small disk space and has a really quick install, xrdp is the service you need to allow remote connection from another machine. **You can configure for autostart or start manually when you need with**:

{{< highlight bash "linenos=table" >}}
sudo service xrdp start
{{< / highlight >}}

The beauty of xrdp is that you are not enabled to resolution restriction you have usually on your Linux Hyper-V virtualized environment, so you can run at full screen with absolutely no problem. **As an example here is a full screen session running Wireshark**

![Full Screen Wireshark](../images/full-screen-wireshark.png)
***Figure 3***: *Full Screen Wireshark*

The overall experience is really good, if you have a good internet connection you have a ***Kali Linux running in minutes** with absolutely no problem. Now the usual question: **which are the benefit of using WSL2 instead of using a real Virtual Machine?** I can list at least two:

1. WSL2 is **highly integrated in your windows environment** you can access Kali file system Read/Write from share \\WSL$ while Kali can access Windows file with /mnt/c. Transferring data between the two is really simple **as is simple to transfer files from the two system from command line**
1. **Every port of WSL2 is automatically exposed to the host machine through loopback**, so if you open a port in your WSL2 you can access from Windows using localhost, as if the port is opened from a Windows running program

This second functionality can be seen in **Figure 4** where I have opened a port with netcat in Kali (1) and connected from Windows machine with [powercat](https://github.com/besimorhino/powercat) pointing directly to localhost (2).

![WSL2 port redirection](../images/net-cat-wsl2.png)
***Figure 4***: *Port in Kali are available to Windows as localhost*

If you are a Kali or regular Linux user but your primary box is a Windows machine, WSL2 can surprise you.

Gian Maria.
