---
title: "Configuring Lab Management on a single machine"
description: ""
date: 2010-05-07T08:00:37+02:00
draft: false
tags: [Lab Management]
categories: [Lab Management]
---
When you configure TFS Lab Management in a single box, and you follow the instruction that you find on [MSDN](http://msdn.microsoft.com/en-us/library/dd380687.aspx), probably you will encounter this error when you configure the host tab.

* **The following host is unusable for Lab Management: xxxx in host group: "All Hosts". To make it usable, connect at least one of its physical network adapters to a valid network. Then, verify the host group again to ensure that the problem has been resolved.** *

This is due to the fact that you are configuring everything in a single box, and lab management complains that he need a physical network to communicate with the host group. Thankfully the Lab Management Blog as a [dedicated post](http://blogs.msdn.com/lab_management/archive/2010/02/08/configuring-network-location-for-vs-lab-management-2010-rc-one-box-setup.aspx) on how to solve the problem, just follow the instructions and run

*C:\Program Files\Microsoft Team Foundation Server 2010\Tools&gt; TFSConfig lab /Settings /NetworkLocation:"Internal Network"*

To solve the problem. Do not forget to [check the post](http://blogs.msdn.com/lab_management/archive/2010/02/08/configuring-network-location-for-vs-lab-management-2010-rc-one-box-setup.aspx) for useful suggestions for One Box configuration.

alk.
