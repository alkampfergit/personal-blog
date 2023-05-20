---
title: "Finally VSTS  VSO has Basic Work Item customization"
description: ""
date: 2015-12-12T08:00:37+02:00
draft: false
tags: [VSTS]
categories: [Tfs]
---
Just a quick post to make you know that, with update of 10 December 2015,  **VSTS now support a basic form of Work Item customization**.

[Visual Studio News December 10 2015](https://www.visualstudio.com/news/2015-dec-10-vso)

You can add new fields in existing work item and you can also rearrange the layout of Work Items.  **The experience is completely web based** , no more download XML Work Item Type Definition and Manually edit XML Files (or use Power Tools in VS).

This new way to customize Process Template is based on a new functionality of Team Process Templates called: Process Inheritance. With this model  **the original process created by Microsoft remains unchanged, and you can edit a personal model that inherits from the original one.** This makes possible for MS to update the “Master” template, without interfering with your customization.

You can read more on this [old post: Visual Studio Online Process Customization Update](http://blogs.msdn.com/b/visualstudioalm/archive/2015/07/27/visual-studio-online-process-customization-update.aspx)

Another good reason to migrate to VSTS :)

Gian Maria.
