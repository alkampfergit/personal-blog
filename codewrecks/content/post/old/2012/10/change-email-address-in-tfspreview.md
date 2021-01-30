---
title: "Change email address in TFSPReview"
description: ""
date: 2012-10-19T21:00:37+02:00
draft: false
tags: [Team Foundation Server]
categories: [Team Foundation Server]
---
Actually TFSservice only accepts live id as a login mechanism, but if you start to use it in your company probably you want it to use another email address for E-Mail communication (alert, Feedback, etc), this is possible through the My Profile link

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2012/10/image_thumb1.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2012/10/image1.png)

 ***Figure 1***: *My profile link to change your TFS Service profile*

Once you got to configuration page,  **you can simply change your preferred email address to whatever mail you want** [![image](http://www.codewrecks.com/blog/wp-content/uploads/2012/10/image_thumb2.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2012/10/image2.png)

 ***Figure 2***: *Change your preferred email to another mail*

Now you should receive an E-Mail at this new address  to confirm the change of the address, and the game is done. If you already changed the preferred Email and never received the confirmation email (maybe it got into spam folder), your new email address is not verified and you will never receive E-Mail to it.

If you find that after the change of the preferred email, TFS Service still send mail to your original Live Id account, or if you do not receive E-Mail anymore, it could be due to missing confirmation E-Mail. The solution is: change preferred mail back to your original E-Mail, save configuration, enter again in your profile and reconfigure again the new E-Mail,  **then check for Confirmation E-Mail in your spam folder, if you do not receive it after a couple of minutes**.

Alk.
