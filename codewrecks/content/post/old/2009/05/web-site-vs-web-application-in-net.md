---
title: "Web site VS Web application in Net"
description: ""
date: 2009-05-04T01:00:37+02:00
draft: false
tags: [Experiences]
categories: [Experiences]
---
I had a big project that contains a big site written in asp.net webform and Visual Basic language. This site was created as â€œweb siteâ€, and when it became really big, it start being really really slooowwww..

To give some number, in my machine I usually need about 30 seconds to compile it, and I have RAID disk array of Velociraptor (10.000 RPM), it was unacceptable. After long debate I follow [Guardian](http://www.nablasoft.com/guardian/) suggestion , and found [this link](http://weblogs.asp.net/meligy/archive/2008/08/03/converting-vs-2008-website-to-web-application.aspx) that explain how to convert a web site to a web application. It took about 6 hours to convert everything, but it worth time spent. Now the project in my computer compiles in about 3 seconds :o, the nant script that deploy the entire site now executes in 6 minutes against 7:30 of the previous version (it have to compile a lot of project, not only the web site). Solution opening time is also improved dramatically.

This experience makes me suggest to everyone of you trying to convert your web sites to web applications, I think when you start to work with web application you never want to come back to web site.

alk.

Tags: [.net web sites](http://technorati.com/tag/.net%20web%20sites)
