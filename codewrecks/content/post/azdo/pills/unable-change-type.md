---
title: "Pill: Unable to change Work Item type in Azure DevOps"
description: "If you encounter Work Item Type(s) cannot be moved because it is disabled..."
date: 2024-11-13T08:10:42+02:00
draft: false
categories: ["AzureDevOps"]
tags: ["Work Item Tracking"]
---

Today I got a strange error in Azure DevOps, I create a new Product Backlog Item, while I was writing it I realized that it would be better to create a Bug Type. My natural reaction was, save and then use the Change Type command, but I got this error.

![Error Changing a Work Item Type](../images/error-change-type.png)

***Figure 1***: *Error Changing a Work Item Type*

> Work item type(s) cannot be moved because it is disabled, hidden or not supported.

I must admit that I was a little bit puzzled, I've changed type several time in the past and I do not know why I could not change a PBI to a Bug. It turns out that I still was in the **page for the new work item**. This somewhat seems to confuse the system.

I was not able to have a constant reproduction, but when it happens, I just click on the Work Item Number and I open the detail page of the Work Item. With this simple trick everything works just fine.

Gian Maria.
