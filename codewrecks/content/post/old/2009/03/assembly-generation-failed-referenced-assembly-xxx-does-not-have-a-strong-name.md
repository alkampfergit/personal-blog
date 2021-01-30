---
title: "Assembly generation failed Referenced assembly 8216xxx8217 does not have a strong name"
description: ""
date: 2009-03-13T04:00:37+02:00
draft: false
tags: [NET framework]
categories: [NET framework]
---
I have a solution where projects are not signed, now I need to sign them, but clearly when I begin to insert signing I end with some errors like

> Assembly generation failed Referenced assembly ‘xxx’ does not have a strong name

These errors are caused because your projects are referencing dll that are not strongly signed. For those dll that are open source you can simply recompile everything with a strong name, for those one that comes in compiled form only you need to disassemble and reassemble again with a strong name. To make everything simple I usually use this batch

{{< highlight csharp "linenos=table,linenostart=1" >}}
call "%VS80COMNTOOLS%\vsvars32.bat"
ildasm /all /out=%1.il %1.dll
ilasm /dll /key=..\..\actvalue.snk %1.il
pause{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

you can invoke it passing the assembly file name as unique argument like

{{< highlight csharp "linenos=table,linenostart=1" >}}
resign.bat somelibrary
{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

This permits you to resign every assembly without the need of source code.

alk.

Tags: [signing](http://technorati.com/tag/signing) [.NET Framework](http://technorati.com/tag/.NET%20Framework)
