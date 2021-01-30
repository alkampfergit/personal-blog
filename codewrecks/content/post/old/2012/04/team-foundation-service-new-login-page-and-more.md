---
title: "Team foundation service new login page and more"
description: ""
date: 2012-04-30T11:00:37+02:00
draft: false
tags: [Team Foundation Server]
categories: [Team Foundation Server]
---
If you are using the TfsPreview (Tfs on azure), you can notice that the login page is drastically changed.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2012/04/image_thumb4.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2012/04/image5.png)

Even if this seems only a simple and stupid change, it shows one of the advantage of using TfsService over having it on-premise: the automatic update process made periodically by Microsoft. The change in the login page is only a fancy change of an update that was deployed last week on TFS Service, this actually means two distinct advantage:

1. Upgrade to new TFS version is automatic and painless (update of on-premise is now really simple, but still requires some work)
2. TFS Service will have a more frequent upgrade, you can have bugfix and new feature without the need to wait for Service Pack or for next major version

For Small teams, avoiding any risk and time needed to update On-Premise TFS can be a good advantage over an on-premise installation.

Gian Maria
