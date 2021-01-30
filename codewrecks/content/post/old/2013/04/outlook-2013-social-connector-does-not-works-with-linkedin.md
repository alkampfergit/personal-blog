---
title: "Outlook 2013 social connector does not works with linkedin"
description: ""
date: 2013-04-16T07:00:37+02:00
draft: false
tags: [General]
categories: [General]
---
It is a couple of days that Outlook 2013 cannot connect with linkedin anymore, I’ve tried to remove and readd again my account but it fails telling me that Password is not valid.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2013/04/image_thumb.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2013/04/image.png)

After a brief lookup in the internet I’ve found the reason, the certificate that outlook uses to connect to linkedin is expired (check this on [https://outlook.linkedinlabs.com/](https://outlook.linkedinlabs.com/) ) so we need to wait until linkedin updates the certificate.

If you are in a hurry and really want outlook to connect back again to linkedin you can use a dirty developer trick. Just launch [fiddler](http://fiddler2.com/), a web debugging proxy that is used by developer to intercept traffic of web application. In tools-&gt; Options menu you can instruct fiddler to intercept HTTPS traffic and decrypt it

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2013/04/image_thumb1.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2013/04/image1.png)

This is usually a security hole, but it is the only way a developer can inspect HTTPS traffic of web application. The good side effect of this options, is that outlook now connect to Linkedin through fiddler, and since I’ve told him to ignore server certificate errors, outlook can connect to linkedin.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2013/04/image_thumb2.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2013/04/image2.png)

Clearly as soon as you close fiddler connection get lost, but it can be useful if you need to retrieve some information from linkedin (new contact, etc), then you can simply close fiddler.

Do not remember to remove interception certificate once the problem will be corrected with a new official certificate.

Gian Maria.
