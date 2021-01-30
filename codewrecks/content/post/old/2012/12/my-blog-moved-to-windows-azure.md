---
title: "My blog moved to Windows Azure"
description: ""
date: 2012-12-28T13:00:37+02:00
draft: false
tags: [Azure]
categories: [General]
---
Actually it is a few days **I’ve moved my blog to Windows Azure using Web Sites** , still in Preview, but really stable. The only problem with my WordPress Site, is that I’m not able to use the automatic update of plugins, due to some problem in writing on the virtual file system, but apart from this little problem (I updated my plugin with standard FTP) I’m really satisfied of azure.

Thank to the fact that I have a MSDN subscription I have a certain amount of resources available for free, because they are included in the base MSDN subscription, [you can read details here](http://www.windowsazure.com/en-us/pricing/member-offers/msdn-benefits/).

Moving to azure was really simple, just activated a new Web Site in reserved or shared mode, upload all site content with FTP, then restore MySql database to a linked MySql database (you have 20MB of MySql actually available for Web Sites), and finally switched my dns, and the blog is now running on Azure.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2012/12/image_thumb1.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2012/12/image1.png)

Actually if you have a MSDN subscription, Azure is a really appealing hosting solution. PHP support is good, you can also use the WinCache as cache backend for your W3 Total Cache plugin and everything runs smooth.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2012/12/image_thumb2.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2012/12/image2.png)

Happy New Year to everyone :).

Gian Maria
