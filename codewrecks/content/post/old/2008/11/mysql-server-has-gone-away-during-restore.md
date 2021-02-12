---
title: "MySQL server has gone away during restore"
description: ""
date: 2008-11-06T07:00:37+02:00
draft: false
tags: [General]
categories: [General]
---
Today I was upgrading a Mantis bug tracking system, to avoid problems I backup the db and tried to restore in a different catalog. The restore procedure fail with the error

> MySQL server has gone away

My first question is *gone away? and where? it is gone in vacation?* this is a perfect example of strange error message, fortunately I suspect that the problem was due to a table with BLOB field with great data, and in fact the restore process generated this error during the restore of  a very big row. after some search I found that I can increase the packet size for my server going into the server directory, edit the *my.ini* file adding this line

set-variable= **max\_allowed\_packet** =5M

that increase the maximum packet size to 5 M then everything went ok.

alk.

Tags: [MySql](http://technorati.com/tag/MySql)

<script type="text/javascript">var dzone_url = 'http://www.codewrecks.com/blog/index.php/2008/11/06/mysql-server-has-gone-away-during-restore/';</script><script type="text/javascript">var dzone_title = 'MySQL server has gone away during restore';</script><script type="text/javascript">var dzone_blurb = 'MySQL server has gone away during restore';</script><script type="text/javascript">var dzone_style = '2';</script><script language="javascript" src="http://widgets.dzone.com/widgets/zoneit.js"></script> 

[![DotNetKicks Image](http://www.dotnetkicks.com/Services/Images/KickItImageGenerator.ashx?url=http://www.codewrecks.com/blog/index.php/2008/11/06/mysql-server-has-gone-away-during-restore/&amp;bgcolor=0080C0&amp;fgcolor=FFFFFF&amp;border=000000&amp;cbgcolor=D4E1ED&amp;cfgcolor=000000)](http://www.dotnetkicks.com/kick/?url=http://www.codewrecks.com/blog/index.php/2008/11/06/mysql-server-has-gone-away-during-restore/)
