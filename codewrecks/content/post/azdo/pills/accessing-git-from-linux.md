---
title: "Pills: Accessing your Git Repositories in Azure DevOps in Linux"
description: "Azure DevOps is a complete solution for your project and it is not absolutely bound to Windows development. Learn how simple is to use git from linux."
date: 2024-11-18T08:10:42+02:00
draft: false
categories: ["AzureDevOps"]
tags: ["Pills"]
---

When you need to access your Git Repositories hosted on Azure DevOps in Linux, you have basically two distinct options. 

The first one is the classic **ssh protocol, that is well know to everyone working with linux systems**. 

![Choosing SSH as protocol to clone from Azure DevOps](../images/ssh-clone.png)

***Figure 1***: *Choosing SSH as protocol to clone from Azure DevOps*

This is the preferred way to access **from linux system** but sadly, Azure DevOps still not support Hardware Key based SSh keys, so you are **limited to use standard RSA keys** as you can see in **Figure 2**. Actually this is quite a limitation for those used to Yubikeys or Google Titan keys.

![You can only use SSH keys based on RSA](../images/only-rsa-keys.png)

***Figure 2***: *You can only use SSH keys based on RSA*

If you do not want to use SSH and want to stick to the old good HTTPS protocol, **you can use Git Credential Manager that allows you to authenticate against GitHub and Azure DevOps directly on a browser with OAUTH2**. All you need to do is grab the correct release for your linux distribution from the [Release page](https://github.com/git-ecosystem/git-credential-manager/releases/tag/v2.6.0). In my situation I have Ubuntu based system so I choose a standard deb package.

Then you can install simply with two lines, a classic dpkg followed by a configuration for credential manager.

{{< highlight bash "linenos=table" >}}
sudo dpkg -i <path-to-package>
git-credential-manager configure
{{< / highlight >}}

This is usually everything you need to do, then try a **fetch against a repository in Azure DevOps or GitHub in HTTPS and a browser will open to have you login to the service**. This is probably the easiest way to use Git against Azure DevOps and GitHub, but remember **this is not to be used on a shared computer**. 

Actually if you are using GitHub and not Azure DevOps, I strongly suggests you to buy and hardware key and use it to create an **ssh keys stored on your hardware key**. Not only you will have more security, but performing an ssh operation is just type a pin and touch the key.

Gian Maria.