---
title: "WordPress and permalink make your url case sensitive"
description: ""
date: 2008-08-15T02:00:37+02:00
draft: false
tags: [Uncategorized]
categories: [General]
---
This morning I browse some stats that google made on my blog, and saw that there are some 404 (Not Found) page. After some inspection I see that all the 404 have the form

[http://www.nablasoft.com/Alkampfer/xxx](http://www.nablasoft.com/Alkampfer/xxx "http://www.nablasoft.com/Alkampfer/index.php/2008/08/14/overriding-the-equalsmethod/")

They have capital A for Alkampfer, if I changed the Alkampfer in alkampfer everything work……the strange thing is that I perfectly remember that it does work when I first setup the blog. After some inspection I found that the problem is due to the permalink, when you activate permalink in wordpress the url became case sensitive.

[A solution can be found here](http://www.unfocus.com/projects/2007/08/31/case-insensitive-permalinks-plugin-for-wordpress/).

Now link like these [http://www.nablasoft.com/Alkampfer/?p=105](http://www.nablasoft.com/Alkampfer/?p=105 "http://www.nablasoft.com/Alkampfer/?p=105") or [http://www.nablasoft.com/AlkaMPFer/?p=105](http://www.nablasoft.com/AlkaMPFer/?p=105 "http://www.nablasoft.com/AlkaMPFer/?p=105") works perfectly. It seems to me that it real better to have an url not case sensitive.

alk.
