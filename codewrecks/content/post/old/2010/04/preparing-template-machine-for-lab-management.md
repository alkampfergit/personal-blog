---
title: "Preparing template machine for Lab Management"
description: ""
date: 2010-04-12T10:00:37+02:00
draft: false
tags: [Lab Management,Team Foundation Server]
categories: [Lab Management]
---
Quite often, customers ask for web application to be fully compatible with IE6 IE7 and IE8, so you need to always have some virtual machine with all version of IE running somewhere. In such a scenario, having right template machine in Lab Management can be a good option, so I decided to try it out and create some template machine to use in this scenario.

First of all I created a simple virtual machine in hyper-v, install WindowsXP SP3, and did all the update, except Internet explorer, so my system is fully updated with latest patch but with IE6.

Now I need to install test agent and everything is needed for the machine to participate in a LabManagement Environment. To automate this task you can check the [VM Prep Tool](http://code.msdn.microsoft.com/vslabmgmt), a tool that automates this step to avoid losing time executing manually all the process. Once you downloaded the tool you need only to uncompress a couple of ISO file and the vmprep tool in a network share ([you can find all instruction here](mhtml:http://code.msdn.microsoft.com/Project/Download/FileDownload.aspx?ProjectName=vslabmgmt&amp;DownloadId=9075)). Once everything is ready, in my windows xp machine I open the network share, enter the credential and finally open a prompt and type the command

> [\\labrc\HyperVM\_RCLibrary\VMPrepTool.exe](file://\\labrc\HyperVM_RCLibrary\VMPrepTool.exe) SelfService

the tool ask me for password (I was logged as local administrator) and then it proceeded with the installation. After some reboot I got this

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2010/04/image_thumb4.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2010/04/image4.png)

Now I join the machine to the domain, then configure the test agent to run under the identity of labuser domain user, [I change domain policy as described here](http://www.codewrecks.com/blog/index.php/2010/03/18/scvmm-could-not-reset-local-administrator-password-during-template-creation/) and now the machine with IE6 is ready. Now my machine is ready to be converted into a template, but since I need also a IE7 and a IE8 machine with windows XP, I simply go to the SCVMM and clone this machine a couple of times, then boot the other two machine and change machine name, install IE7 E8 etc etc.

Now I go to SCVMM, in the â€œVMs and Templateâ€ and choose to create a new template from an existing virtual machine.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2010/04/image_thumb5.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2010/04/image5.png)

then I choose my windows xp machine that I have already configured, I choose â€œWinXPIE6â€ as template name and proceed to configure the hardware and finally I reach the â€œGuest operating Systemâ€ tab where I configure the domain the virtual machine should join.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2010/04/image_thumb6.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2010/04/image6.png)

The process take a little bit to complete, and when It finish I have my machine ready to be used in a Lab Environment.

alk.

Tags: [Lab Management](http://technorati.com/tag/Lab%20Management)
