---
title: "Use Kali linux in Windows Subsystem for Linux "
description: "Now that WSL2 has a real full Linux Kernel using Kali Linux in WSL2 is a nice option to have."
date: 2020-06-21T10:00:37+02:00
draft: false
tags: ["security", "kali"]
categories: ["security"]
---

Thanks to the new Windows Subsystem for Linux version 2, shortly called WSL2, we now have a real Linux kernel running in a real VM as the core of WSL. This allows finally to use Kali Linux in WSL environment. In the old version tools like NMap had some trouble to run due to not having a full Linux Kernel under the hood.

Configuring Kali in WSL2 is really simple, you just install the distribution from the Windows Store, then you fire up WSL2 and finally you need to install tools, because the version you install in WSL2 is a minimal Kali installation and it does not have all the tool you are used to in a full install.

> When you install Kali in WSL2 please note that you starts with a minimal installation so you need to install packages.

The first thing to do is running a full upgrade of everything 

{{< highlight bash "linenos=table" >}}
sudo apt update
sudo apt full-upgrade
{{< / highlight >}}

After a full update you are ready to install tools and here you can use [Kali Linux Metapackages](https://tools.kali.org/kali-metapackages) that allows you to choose a subset of tool without the need to install tools one by one. As an example you can start installing Top 10 tools used.

![Kali top 10 tools metapackage](../images/kali-top-10-tools.png)
***Figure1***: *Kali top 10 tools metapackage is a good starting point.*

To install top 10 tools you can simply run 

{{< highlight bash "linenos=table" >}}
sudo apt install kali-tools-top10
{{< / highlight >}}

Metapackages are a really useful way to quickly setup your Kali Linux with the tool you need. After the installation all tools should be available and ready to run.

![SqlMap is installed](../images/sqlmap.png)
***Figure1***: *Sqlmap is ready to be used.*