---
title: "How secure is your password "
description: ""
date: 2009-05-06T09:00:37+02:00
draft: false
tags: [General]
categories: [General]
---
This is a simple question but is very hard to answer correctly. I just finished reading [this post](http://www.codinghorror.com/blog/archives/001263.html) by [Jeff Atwood](http://www.codinghorror.com/blog/) that makes me rethink on how secure my passwords are. As you can see from that post someone found Jeff password stealing it from a site that does not hash it, this is something that worried me for a long time.

I cannot be sure that my passwords are really secure, so I always think on how much damage someone will do to me when he will steal my password, this lead to some rules I follow, I [discussed some time ago](http://www.codewrecks.com/blog/index.php/2008/08/21/is-policies-for-password-really-useful/).

Now after Jeff's post I'm rethinking not only on how I choose my password, but even on *how services I use manage my passwords.*I must admit that my gmail password is the same I use to admin some communities in Italy, and I did not check in these database if password is store with salted hash etc. So if someone steal password for these communities my Gmail account is also compromised.

Jeff's post make me think that probably I need to *always choose a different password for each service where I have admin privileges or that in some way manages money*, this because you cannot even be sure that *Big companies use a good policy for password*. Now take in consideration [www.trenitalia.it](http://www.trenitalia.it) it is the site of Italian Railways,  a really big company. A month ago I go there to buy train tickets, when it is time to pay I try my standard password and it did not work. Since I know that after some wrong attempts the account would be locked, I asked for password recovery. The system asked me the security answer, and after few second I received this email.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2009/05/image-thumb.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2009/05/image.png)

WHAT!!!!!! They send to me my password in  **CLEAR TEXT** ......, and this is a password I use to access other services, I immediately changed this password on all system but I was horrified because

1. They store my password in clear text, I do not want to imagine how is the overall security of the site.
2. They send my email in CLEAR TEXT via email, without any kind of encryption.

Consider that if you have TravelCard with them you can even buy travel, so if someone steals my access information he/she can buy ticket with my money.

This situation makes me rethink on the criteria I use to choose password, now for every site that have some importance I always use different password.

alk.

Tags: [security](http://technorati.com/tag/security)
