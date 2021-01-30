---
title: "TF255070 User account xxxaccount not found"
description: ""
date: 2009-10-25T14:00:37+02:00
draft: false
tags: [Tfs]
categories: [Team Foundation Server]
---
In tfs 2010 beta2, when you configure the build agent, you start the wizard choosing the team foundation server that contains the project collection you want to build. If you choose tfs with ip address, you will end with an error like

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2009/10/image-thumb17.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2009/10/image17.png)

This error is probably caused to the fact that windows does not support user name with ip address, in this situation the user 10.0.0.242\tfsBuildAgent really does not exists on the server. You need to choose TFS with machine name.

Alk.

Tags: [Team Foundation Server](http://technorati.com/tag/Team%20Foundation%20Server)
