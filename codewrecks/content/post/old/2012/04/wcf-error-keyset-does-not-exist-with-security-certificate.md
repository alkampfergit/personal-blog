---
title: "Wcf error Keyset does not exist with security certificate"
description: ""
date: 2012-04-21T11:00:37+02:00
draft: false
tags: [Wcf]
categories: [Programming]
---
I worked a lot with WCF secured services and whenever is time to use certificates it is not uncommon to encounter strange and not so much descriptive exceptions. One of the less intuitive one is “ **keyset does not exists with security certificate”** , that basically means that the worker process in IIS is not able to access the service.

I’ve dealt with this problem in an old post, when I used self issued certificates to manage secure client/server communication between windows forms client and a service hosted in IIS, but the very same error happened yesterday trying to configure a **net.tcp binding on a service that already uses wsHttpBinding to communicate through Https**. The root cause of this error usually is due to a wrong security configuration so you should fire mmc.exe (just start-&gt;run-&gt;mmc) then choose the certificate snap-in on local computer, locate the certificate used by IIS for HTTPS and give read permission to the user used to run the worker process of the service.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2009/09/image-thumb4.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2009/09/image4.png)

In my example I simply used NetworkService to run the application so I give to network service the appropriate rights.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2009/09/image-thumb5.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2009/09/image5.png)

Try again to access the service and the exception should be gone away.

Gian Maria.
