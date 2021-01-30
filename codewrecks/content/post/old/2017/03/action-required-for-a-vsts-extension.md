---
title: "Action required for a VSTS Extension"
description: ""
date: 2017-03-23T07:00:37+02:00
draft: false
tags: [Tfs]
categories: [Team Foundation Server]
---
It could happen that you received an Email from VSTS telling you that one of the extension needs some action.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2017/03/image_thumb.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2017/03/image.png)

 ***Figure 1***: *An email telling you that an extension needs action to be updated.*

If you go to your account and check the extension page, you find a situation like this one.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2017/03/image_thumb-1.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2017/03/image-1.png)

 ***Figure 2***: *Extension is listed in the “action required” section*

You could be puzzled, because there is warning icon, but no indication on what you need to do to solve the situation, nor what the problem is. In this situation, the email states that the extension needs to be upgraded, but whatever problem you have, **you need to check the menu related to the extension.** [![SNAGHTML2484a2](http://www.codewrecks.com/blog/wp-content/uploads/2017/03/SNAGHTML2484a2_thumb.png "SNAGHTML2484a2")](http://www.codewrecks.com/blog/wp-content/uploads/2017/03/SNAGHTML2484a2.png)

 ***Figure 3***: *The extensions that needs action have an additional menù called Review*

From  **Figure 3** you can see that the extension has a new menu entry called “Review”, that open the dialog shown in  **Figure 4**.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2017/03/image_thumb-2.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2017/03/image-2.png)

 ***Figure 4***: *Review dialog that explain what happened*

Thanks to this dialog we can finally understand why the extension needs action,  **there is a new version, but the permissions required by this new version are different from the original one, so it needs an explicit intervention of an administrator to update.** After all we do not want auto update of an extension being automatically able to give more permission to the extension.

Gian Maria.
