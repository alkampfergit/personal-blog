---
title: "How to security expose my test TFS on the internet"
description: ""
date: 2017-09-19T16:00:37+02:00
draft: false
tags: [linux,Security]
categories: [EverydayLife]
---
I’m not a security expert, but I have a basic knowledge on the argument, so when it is time to expose my test TFS on the outside world I took some precautions. First of all this is a test TFS instance that is running in my test network, it is not a production instance and I need to access it only sometimes when I’m outside my network.

Instead of mapping 8080 port on my firewall I’ve deployed a Linux machine, enabled SSH and added google two factor authentication, then I expose port 22 on another external port. Thanks to this, the only port that is exposed on my router is a port that remap on port 22 on my linux instance.

Now when I’m on external network, I use putty to connect in SSH to that machine, and I setup tunneling as for Figure 1.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2017/09/image_thumb-2.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2017/09/image-2.png)

 ***Figure 1***: *Tunneling to access my TFS machine*

Tunneling allows me to remap the 8080 port of the 10.0.0.116 machine (my local tfs) on my local 8080 port. Now from a machine external on my network I can login to that linux machine.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2017/09/image_thumb-3.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2017/09/image-3.png)

 ***Figure 2***: *Login screen with verification code.*

This is on a raspberry linux pi, I simply use pi as username, then use verification code from my cellphone (google authenticator app) and finally the password of my account.

Once I’m connected to the raspberry machine I can simply browse [http://localhost:8080](http://localhost:8080) and everything is redirected through a secure SSH tunnel to the 10.0.0.116 machine. Et voilà I can access any machine, any port in my network just using SSH tunneling.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2017/09/image_thumb-4.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2017/09/image-4.png)

 ***Figure 3***: *My local TFS instance now accessible from external machine*

This is surely not a tutorial on how to expose a production TFS instance (please use https), but instead is a simple tutorial on how you can access every machine in your local lab, without the need to expose directly the port on your home router. If you are a security expert you will probably find flaws in this approach, but surely it is better than directly map ports on the router.

Gian Maria.
