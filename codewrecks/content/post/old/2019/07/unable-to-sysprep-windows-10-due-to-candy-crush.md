---
title: "Unable to Sysprep Windows 10 due to Candy Crush hellip"
description: ""
date: 2019-07-12T15:00:37+02:00
draft: false
tags: [General]
categories: [General]
---
I was trying to sysprep a Windows 10 virtual machine hosted in Hyper-V but I got error messages like

> Package CandyCrush.. was installed for a user, but not provisioned …

It turns out that Win 10 standard installer installs some application from the store that conflicts with sysprep. Now I need to uninstall one by one and to speedup the process I suggest you to use Get-AppxPackage powershell commandlet.

As an example to uninstall every application called Candy you can issue

Get-AppxPackage –Allusers \*Candy\* | Remove-AppxPackage

After you uninstalled all unwanted application you should be able to sysprep your Widnows 10 machine.

Gian Maria.
