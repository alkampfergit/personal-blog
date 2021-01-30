---
title: "NullReferenceException in windows when Git fetch or pull"
description: ""
date: 2018-10-12T10:00:37+02:00
draft: false
tags: [Git]
categories: [Git]
---
After updating Git to newer 2.19.1. for windows, it could happen that you are not able to use anymore credential manager. The sympthom is, whenever you git fetch or pull, you got a NullReferenceException and or error  *unable to read askpass response from ‘C:/Program Files/Git/mingw64/libexec/git-core/git-gui—askpass’*

> Git credential manager for Windows in version 2.19.1 could have some problem and generates a NullReference Exception

Clearing Windows Credential Manager does not solves the problem, you still have the same error even if you clone again the repo in another folder. To fix this you can simply download and install the newest version of the Git Credential Manager for windows. You can find everything at [this address.](https://github.com/Microsoft/Git-Credential-Manager-for-Windows/releases)

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2018/10/image_thumb-16.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2018/10/image-16.png)

 ***Figure 1***: *Download page for release of Git Credential Manager for Windows*

Just install the newest version and the problem should be solved.

Gian Maria
