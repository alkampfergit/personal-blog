---
title: "Working with distributed team 8211 VPN and source control"
description: ""
date: 2008-05-25T23:00:37+02:00
draft: false
tags: [Experiences]
categories: [Experiences]
---
Another great tool for distributed teams is VPN (Virtual Private Network), with a VPN all the team members can live in the same virtual local network. This is important, first of all for security. VPN estabilish a secure channel between computer using an insecure transport as the internet, with wpn all the data is ciphered, so you can transmit company sensitive data with easy.

To estabilish a vpn you should have the [Dedicated Server](http://www.codewrecks.com/blog/?p=272) I told you some days ago, and then you should decide how to create VPN. Windows have its native VPN that you can estabilish with a fews clicks, but I prefer to install Open VPN, that it’s easy to install, easy to mantain, and gives me good performance. Once you have your VPN running, you can share printer, folder, and you are working in a distributed office :D.

Next step is source control. Noone can program without it, even if you are a single programmer team, but when you work distributed, a source control system is a must! We first tried to use Visual Source Safe, because it was a product we used in small local team, and it seems to work quite well, and it has full integration with visual studio. When we try to use it on a internet VPN the speed was simply ridiculous, if more than 2 programmer ask for the latest version in a large project, sometimes it needs half an hour to work. So we moved to [subversion](http://subversion.tigris.org/), it is free, it is quick, I used for 2 years with really no problem, I had not repository corruption, the integration with the shell ([tortoise](http://tortoisesvn.tigris.org/)) is fantastic , and if you need, you can use [Ankh](http://ankhsvn.open.collab.net/) for visual studio integration too.

Now that you have a vpn and a source control system you can begin to code :)

Alk.

Tags: [Distributed team](http://technorati.com/tag/Distributed%20team)

