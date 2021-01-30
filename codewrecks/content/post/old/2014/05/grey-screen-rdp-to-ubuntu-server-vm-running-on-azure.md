---
title: "Grey screen RDP to Ubuntu server VM running on Azure"
description: ""
date: 2014-05-28T20:00:37+02:00
draft: false
tags: [Ubuntu]
categories: [Linux]
---
There are a [lot of articles](http://blogs.technet.com/b/uktechnet/archive/2013/11/12/running-a-remote-desktop-on-a-windows-azure-linux-vm.aspx) that explains how to setup a Ubuntu machine on Azure and being able to use xrdp to access it with a standard Remote Desktop session. If you try now and  **use Ubuntu 14 to create your virtual machine you will discover that you are able to RDP to the machine, but after inserting credential you will be prompted with a grey Screen**.

This is due to a change in Ubuntu 14, you can read details in [this blog post](http://askubuntu.com/questions/449785/ubuntu-14-04-xrdp-grey). If you want to save time you can simply choose an older Ubuntu distribution for your Azure Machine, and in few minutes you will be able to RDP to Ubuntu from Windows machines.

I’ve personally tried with Ubuntu 12.04 LTS, that is the one originally used by the post I’ve followed, and everything runs fine.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2014/05/image_thumb1.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2014/05/image1.png)

To have a better experience, I suggest you to use 16 bit when connecting to the machine, and not use big resolution or the RDP could be a little bit slow.

Gian Maria.
