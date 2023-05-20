---
title: "Nant and The specified solution configuration Debugmcd is invalid"
description: ""
date: 2008-02-13T08:00:37+02:00
draft: false
tags: []
categories: [General]
---
Today a friend of mine tell me that in his new windows vista computer one nant scritp stopped working giving the error  **The specified solution configuration “Debug|MCD” is invalid** during the msbuild part of the script. After a brief search it turns out that the msbuild command line is not correct because it miss the /p:Platform instruction, my command line now is

{{< highlight xml "linenos=table,linenostart=1" >}}
<exec program="${MSBuild}"
    commandline=' ${ProjectDir}\${BuildSolutionName} /verbosity:quiet /T:rebuild 
   /p:Configuration=Debug /p:Platform="Any CPU"' basedir="."/>{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

now everything is ok.

alk.
