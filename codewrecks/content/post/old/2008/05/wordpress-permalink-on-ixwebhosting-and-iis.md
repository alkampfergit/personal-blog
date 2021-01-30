---
title: "WordPress Permalink on IXwebhosting and IIS"
description: ""
date: 2008-05-26T00:00:37+02:00
draft: false
tags: [General]
categories: [General]
---
Uff…that was thought, it is almost one year I opened my blog, wordpress is great, but I never be able to set permalink to work correctly, caused by the fact that my hosting use IIS, and wordpress likes to be hosted on apache. In a lot of blog I found that to enable permalink I need to change some settings in php.ini, these settings are

cgi.fix\_pathinfo = 1  
cgi.force\_redirect = 0

So I called my hosting helpdesk and ask them to apply this setting to my php ini file. It seems not to work, today I take a simple info.php get running on my site and I see a strange thing, it told me that

Configuration File (php.ini) Path F:\zzzzz\xxxxxx\nablasof\nablasoft.com\php4-cgi-someotherstuff.ini

This is a big surprise for me, I’do not know a single instruction on php, but I read that the default ini file is called php.ini, but my info.php is telling me that the configuration is stored in a different file. I download this file and see that it does not contain the fix\_pathinfo = 1….too bad, so I correct the file, upload again in the site and now permalink seems to work :D finalllyyyy yattaaa!!!!!

here is a sample link of the previous post [http://www.codewrecks.com/blog/index.php/2008/05/26/working-with-distributed-team-vpn-and-source-control/](http://www.codewrecks.com/blog/index.php/2008/05/26/working-with-distributed-team-vpn-and-source-control/)

Ok, next step……. I will have to change the skin of the blog that is really not appealing.

alk.

Tags: [wordpress](http://technorati.com/tag/wordpress) [permalink](http://technorati.com/tag/permalink) [iis](http://technorati.com/tag/iis)

 <script type="text/javascript"><!--
digg_url = 'http://www.codewrecks.com/blog/index.php/archives/2008/05/26/wordpress-permalink-on-ixwebhosting-and-iis/';
digg_title = 'Wordpress and permalink on iis and ixwebhosting';
//--></script> <script src="http://digg.com/tools/diggthis.js" type="text/javascript"></script> 
