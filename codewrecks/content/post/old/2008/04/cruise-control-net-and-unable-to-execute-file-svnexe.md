---
title: "Cruise control net and Unable to execute file svnexe"
description: ""
date: 2008-04-04T04:00:37+02:00
draft: false
tags: [NET framework]
categories: [NET framework]
---
The sourceControl task of cc.net should specify the path of the executable of svn.exe as in the following example.

{{< highlight xml "linenos=table,linenostart=1" >}}
<sourcecontrol type="svn">
   <workingDirectory>C:\CruiseControl.NET\Projects\xxx\src</workingDirectory>
   <trunkUrl>svn://10.8.0.1/xxx</trunkUrl>
   <username>CCnet</username>
   <password>xxxx</password>
   <autoGetSource>true</autoGetSource>
   <executable>c:\Program Files\Subversion\bin\svn.exe</executable>
</sourcecontrol>{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

If you omit the &lt;executable&gt; part of the source control it happens that if you do not have subversion in your path, cc.net cannot find svn.exe. The error is something like "Unable to execute file C:\CruiseControl.NET\Projects\xxx\svn.exe" and it could be misleading since cc.net try to execute svn in the directory of the project.

Alk.

Tags: [Cc.net](http://technorati.com/tag/Cc.net) [subversion](http://technorati.com/tag/subversion)
