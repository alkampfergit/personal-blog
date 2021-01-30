---
title: "BruteForcing login with Hydra"
description: ""
date: 2019-11-29T18:00:37+02:00
draft: false
tags: [Security]
categories: [security]
---
Without any doubt, Hydra is one of the best tool to bruteforce passwords. It has support for many protocols, but  **it can be used with standard web sites as well forcing a standard POST based login**. The syntax is a little bit different from a normal scan, like SSH and is similar to this cmdline.

./hydra -l username -P x:\temp\rockyou.txt hostname –s port http-post-form “/loginpage-address:user=^USER^&password=^PASS^:Invalid password!”

Dissecting the parameters you have

> -l: specify a username you want to try, you can also specify a file containing all the username you want to try  
> -P: specify a file with all the password you want to try, rockyou.txt is a notable standard  
> -s: service, it should be the port the site is listening to

After these three parameters **it comes the part needed to select the site and the payload you want to sent to the site**. You start with http-post-form to specify that you want POST request with form urlencoded, followed by a special string composed by three parts separated by semicolon.

The first part is the page that will be called, the second part is the payload, with ^USER^ and ^PASS^ placeholder that will be substituted by Hydra at each tentative, finally, the last part is the text that hydra should look to understand if access is denied. Once launched it will try to bruteforce the password with tremendous speed.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2019/11/image_thumb-24.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2019/11/image-24.png)

 ***Figure 1***: *Hydra in action*

As you can see it works perfectly also on Windows.

Gian Maria.
