---
title: "The Dreadful IIS Loopback  Check"
description: ""
date: 2018-09-26T19:00:37+02:00
draft: false
tags: [Security]
categories: [Frameworks]
---
This is something that from times to times bites me, both as TFS Consultant and when I’m developing code. The problem is the following:  **you have a site hosted with IIS in the computer you are logged in, the site has windows authentication, but you cannot login using a FQDN, but only with localhost.** This is a Security Feature, because it avoid a [reflection attack](https://en.wikipedia.org/wiki/Reflection_attack) if the machine gets compromised. Sometimes this is annoying when you develop, because you are usually using your IIS machine to host site while you are developing, accessing it with localhost; then it is necessary to verify that everything works with real site names. For this reason I usually modify my hosts file to create alias like [www.myproduct.local](http://www.myproduct.local) that points to 127.0.0.1 and here comes the problems.

If you use Forms authentication in ASP.NET you are ready to go, but if you enable windows authentication, the  symptom is that your browser continue to ask for password, because you will get a permanent 401 response.

> A typical symptom of Loopback Check is when your site do not accept windows authentication when accessed with a FQDN, but works perfectly using localhost

 **If you legitimate want that** [**www.myproduct.local**](http://www.myproduct.local) **points to localhost, and you want to use your NTLM/Kerberos credentials, you can follow the instruction** [**on this link.**](https://serverfault.com/questions/485006/why-cant-i-log-in-to-a-windows-protected-iis-7-5-directory-on-the-server) I really like the answer in that link because I’ve found many other place that suggests to disable the Loopback Check entirely (Wrong choice from security points of view). In that link you are pointed to the right solution: specifying only the FQDN names that you want to exclude from the loopback check. In my situation I can disable [www.myproduct.local](http://www.myproduct.local) while maintaining the security check for everything else.

> If you have problem accessing TFS instance from the server where the Application tier is installed  do not disable Loopback Check, browse from another computer or disable check for only the real FQDN name.

Pretty please, resist the urge to disable security features, especially if this is your Team Foundation Server production instance. Avoid accessing the web interface from the AT, or disable Loopback check only for the real FQDN,  **but avoid turn off entirely security feature (like Loopback Check) on your production server.** Gian Maria.
