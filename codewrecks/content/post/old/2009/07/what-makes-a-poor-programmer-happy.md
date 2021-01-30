---
title: "What makes a poor programmer happy"
description: ""
date: 2009-07-10T06:00:37+02:00
draft: false
tags: [VSDBEdition]
categories: [NET framework,Tools and library]
---
I must create a duplicate of a database in another server, I need to duplicate only the structure of actual production database to use with a test web application to check how the webapp works with an empty database. I simply fired a command prompt, went to output directory of my database project, and typed

{{< highlight csharp "linenos=table,linenostart=1" >}}
vsdbcmd /a:Deploy /ConnectionString:"Data Source=10.8.x.x\sql2008;user=sa;pwd=xxxxxxxx" /dsp:SQL /manifest:MyProject.deploymanifest /p:TargetDatabase=MyProjectEmptyDb{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

And after a couple of minutes the empty db is ready, with its 9 physical files, 5 filegroups, all the indexes, all fulltext defined etc etc  :D Thanks to Visual Studio Database Edition.

alk.

Tags: [Visual Studio Database Edition](http://technorati.com/tag/Visual%20Studio%20Database%20Edition)
