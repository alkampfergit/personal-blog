---
title: "PHP odyssey"
description: ""
date: 2009-02-25T06:00:37+02:00
draft: false
tags: [General]
categories: [General]
---
I have a local copy of my blog in my machine, just to test if I need to do some modification to the skin or to some pages of the blog, everything is always gone ok, just installing php, mysql and the blog works great.

Today I need to reinstall php and mysql because my machine was formatted 3 month ago, I thought it will be a quick process, but I had this problem

First the php installer fails with an error like "one required script fails to run", no clue on what went wrong, the installer aborts.

I tried to install an older version, the installer went ok but when I launch the site I got the error

> Your PHP installation appears to be missing the MySQL extension which is required by WordPress

I never got this error before, I googled it and found a lot of solutions, but everything in my system seems to be ok, so I run phpinfo() to see my actual configuration and I found that the ini file is searched into c:\windows directory and not in the c:\php\php.ini, but nothing works even with the php.ini in the c:\windows directory.

After a long search I found the solution, I need also to copy the libmysql.dll library to c:\windows\system32 and restart IIS.

I must admit that the last time I did not have all these problems….this time it was a little odyssey.

Alk.
