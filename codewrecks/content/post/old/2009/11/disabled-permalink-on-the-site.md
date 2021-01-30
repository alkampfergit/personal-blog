---
title: "Disabled permalink on the site"
description: ""
date: 2009-11-12T12:00:37+02:00
draft: false
tags: [General,Nablasoft]
categories: [General,Nablasoft]
---
Iâ€™ve disabled all the permalinks on my site. They ceased to work with no reason, both on my blog and guardianâ€™s one ([www.nablasoft.com/guardian](http://www.nablasoft.com/guardian)). After a couple of days, we still do not know why, it seems that suddenly, with no apparent reason, some setting on php.ini are now ignored. I know that wordpress in IIS has some problems with permalink, but with [fix\_pathinfo](http://www.codewrecks.com/blog/?p=274) trick everything worked for more than one year. Now if I look at the info.php on nablasoft site, I do not find the fix\_pathinfo anymore, even if the ini file is correct. Probably we need to restart IIS, but we are on a shared site, and this is simply not possible. We are trying to use 404 redirection, but.. again, we cannot do this from our control panel, so we are waiting for our host to do this. In the endâ€¦ we have a lot of troubles.

For this reason Iâ€™ve begin the procedure to register another domain name, and Iâ€™m planning to move away my blog from nablasoft site, doing a redirect on the new domain. Iâ€™m really sorry to left nablasoft domain, but moving everything on a new host will be a real trouble, because actual host gives us a really big amount of space, and I prefer to move toward a virtual server, with less space, but full control over the machine. There are quite lot of nablasoft E-mail address used by various persons, and I do not want to force anyone to change host, or to experience E-mail discontinuites.

As soon as the name will be registered, Iâ€™ll move everything to a temporary dedicated server, and from there to my final destination :).

The bad stuff is that, until that time, all external links to my blog stopped working. Iâ€™m already experiencing a big drop in page view.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2009/11/image_thumb13.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2009/11/image13.png)

:(

alk.

Tags: [Hosting](http://technorati.com/tag/Hosting)
