---
title: "Compiling Angular app in WSL2"
description: "Windows subsystem for Linux now has a real Linux kernel and many other goodness. Let's explore how to use it"
date: 2020-06-06T08:00:00+02:00
draft: false
tags: ["Linux", "wsl2"]
categories: ["general"]
---

Windows Subsystem for Linux was a nice toy to play, but never impressed me very much, one of the reason is its limitations. I do not work much on Linux, but usually I have Linux boxes with MongoDB, Elasticsearch and play with security related stuff and for those purposes **I have [dedicated virtual machines](http://www.codewrecks.com/post/security/play-security-in-a-secure-environment/).**

This was the reason why I did not found any real useful usage for WSL, I've tried to quick do NMAP scan, but I got errors since it did not run a real Linux full kernel and NMap wants to have full access to the NIC to do its stuff. **Now that we have WSL2 things starts to change.**

> Second version of Windows Subsystem for Linux has a real Linux kernel, ext4, and it is a real VM that runs integrated in Windows

Now that WSL2 is out I was convinced by my dear Friends Matteo Emili and Giulio Vian to give another try, so I [followed the guide](https://docs.microsoft.com/en-us/windows/wsl/install-win10) and configured WSL2 on my machine. First of all I did an NMap scan to verify that everything is now good and the answer is YES!

![Nmap scan on WSL2](../images/wsl2-nmap.png)
***Figure1***: *Nmap was able to perfectly scan a target in WSL2*.

As always my question is: Why I should use WSL2 if I can fire a standard Linux Virtual machine? The answer is not straightforward, but essentially it is really **simpler for a user not used to virtualization and Linux to setup everything with few clicks**. Probably the best advantage is that you can see and interact read/write to Windows filesystem from Linux and vice-versa. In WSL you can access Windows disks in /mnt but the cool part is that you can **access Linux disk from Windows in the special share \\WSL$**.

![Linux share in action](../images/wsl2-liunux-share-in-action.png)
***Figure2***: *Linux share in action, access Linux filesystem directly from Windows*.

> The best advantage of WSL2 is that you have full read/write access between host and WSL2 file systems with 0 friction.

Given this nice feature and the fact that WSL2 runs a real ext4 filesystem I decided to test in a big Angular project I'm working to, because everyone knows that ext4 performs better with lots of small files and I should not remind you of average size of node_modules folder. **So I run a ng build --watch on this project, both on Windows filesystem and bot in WSL2** and the difference in build time is quite important.

First build in Linux took 105 seconds to precompile everything then another 22 seconds to become operative.

![First build in WSL2](../images/wsl2-jarvis-build-fresh.png)
***Figure3***: *Build time in WSL2 of a big Angular project*.

This is the result of a fresh ng build --watch on the project, made inside WSL2, now I issued the very same command in Windows, I pay attention not to have other software running in the meanwhile to not affect the result and here is what I got.

![First build in Windows](../images/Windows-angular-build-fresh.png)
***Figure4***: *Build time in Windows of the very same project*.

I can assure that these number are repeatable, build time tends to change and it is not stable, but it always show this kind of percentage difference from Windows and Linux. As you can see **the difference in the first number is huge, about 50% less build time**, while actually starting to watch the folder uses less time. If I stop the build --watch and run it again, in the second run all libraries are now precompiled (Angular 9) so I took another timing to understand the difference when libraries are precompiled.

This gives me 174 seconds in Windows and 92 seconds in Linux, **this huge performance gain is too good to ignore**, so I decided to start developing Angular part of the project in WSL.

This is really interesting because **the result of Linux build, is perfectly accessible from Windows through the \\WSL$ share**, this gives me benefit of much quicker build time and the ability to have the result available to Windows.

> Thanks to WSL2 I can use full power of Linux machine to build my Angular project and access the result from Windows.

Now the only thing that disappointed me is that I tried to expose the result of the build through the \\WSL$ share in IIS as Virtual Folder(we actually have a Full Framework Web API solution hosted in IIS with Angular app served on the same host as subfolder) but **IIS seems not to be able to access the share due to permissions**. I do not know if this happens because my user is not an administrator of the machine, but this disappointed me a little bit.

In the meanwhile, while I'm investigating on the ability of IIS to access \\WSL$ share, **I've simply setup a SAMBA share on WSL2 and re-exposed my project folder through SAMBA and then serve that directory as Virtual folder in IIS.**

Now a usual question arise: Why spent all this time in WSL2 if you have all those Linux VM? The answer is YES, everything I did in WSL2 could be done with a Virtual Machine, but **there is another cool player in this scenario Visual Studio Code with Remote WSL addin.**. Thanks to that addin, my Visual Studio code can connect with a single command to my WSL2 instance and work With directly with project folder inside my WSL2 Linux.

![Visual studio Code connection to WSL2](../images/Visual-Studio-Code-WSL2.png)
***Figure5***: *Visual Studio Code can seamlessly connect to WSL*.

> Visual Studio Code can connect with a single command to WSL instance and work with Files as if you are working inside the WSL machine

Ok, it is true that you can use the same technique to connect to a Linux machine in SSH, but with WSL2 it is just firing your Visual Studio Code, connecting to WSL machine and you are ready to go. No VM to start, no SSH to configure, no firewall management nothing, **you have a real Linux VM running inside your system with seamlessly integration with your Windows Environment.**

![WSL2 virtual machine running](../images/wsl2-virtual-machine.png)
***Figure 6***: *WSL2 runs inside a real virtual environment as you can verify from Task Manager*

As you can see from **Figure 6** WSL2 is running in a virtual environment, so there is really no reason to install a real Linux machine to use a Linux system if you have a Windows Environment. I still use Linux VM for lots of stuff, **but it is really awesome to have a fully functional VM with few clicks and it works perfectly**.

Gian Maria.
