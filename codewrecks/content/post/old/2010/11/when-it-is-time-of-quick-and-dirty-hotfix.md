﻿---
title: "When it is time of quick and dirty hotfix"
description: ""
date: 2010-11-04T14:00:37+02:00
draft: false
tags: [Experiences]
categories: [Experiences]
---
Iâ€™ve a software composed by many pieces, one of them was deployed 9 month ago and works well, today we find a little bug and need to change a string in it.

The obvious solution is, take the release branch, change the string, compile and deploy again, but there is even a dirtier approach, Iâ€™ve simply disassembled the file with ildasm, changed the string and finally assemble it again (and clearly I changed the string even in the branch).

This saved me the need to redeploy the entire application (uploading stuff via ftp, etc etc), and I was able to do the hotfix directly in production server with a simple remote desktop.

This is probably the dirtiest patch Iâ€™ve made in years ![Smile](http://www.codewrecks.com/blog/wp-content/uploads/2010/11/wlEmoticon-smile.png)

alk.
