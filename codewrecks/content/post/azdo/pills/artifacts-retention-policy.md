---
title: "Pills: Azure Devops artifacts retention policy"
description: "Keep your feeds size at bay with automatic retention policy in Azure DevOps."
date: 2022-08-08T08:10:42+02:00
draft: false
categories: ["AzureDevOps"]
tags: ["Pills"]
---

When you use extensively Azure DevOps feeds, you will end with lots of small project that automatically publish packages at each build. I have projects where **each commit will publish a package thanks to GitVersion that generates a unique number for each build**. This will end in a situation where thousands of packages are generated and uploaded to Azure DevOps.

In Feed settings page you have a **retention policy** that will automatically deletes old packages but keep those ones that are recently used, to avoid removing a package that is still in use.

![Retention policy for Azure DevOps packages](../images/policy-retention.png)

***Figure 1***: *Retention policy for Azure DevOps packages*

With this simple settings you can easily keeps the size of the feed at bay. If this usually is not a problem because cost of storage is really low, sometimes I've found **Visual Studio Nuget UI become sluggish when you deal with packages that have thousands of versions when you choose to view pre-release packages**. Thanks to automatic cleanup you will avoid this problem.

If you promote all stable packages to a pre-release or release channel, you will be also sure that those packages will never be removed by automatic cleanup policy. This is really important because with automatic **publish from pipeline, you will end with lots of packages so you need to be sure that all important and stable packages are never removed from the feed**.

Gian Maria.