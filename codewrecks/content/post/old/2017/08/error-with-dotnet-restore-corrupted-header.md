---
title: "Error with dotnet restore corrupted header"
description: ""
date: 2017-08-18T16:00:37+02:00
draft: false
tags: [NET Core]
categories: [NET Core]
---
I’m trying to compile with dotnetcore 2.0 a project on Linux, but I got this strange error when I run the dotnet restore command.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2017/08/image_thumb-11.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2017/08/image-11.png)

 ***Figure 1***: *Error restoring packages*

The exact error comes from NuGet.targets and tells me:  **a local file header is corrupt** and points to my solution file. Clearly this project builds just fine on another computer.

Since I’m experiencing intermittent connection, I suspect that nuget cache can be somewhat corrupted, so I run this command to clear all caches.

{{< highlight bash "linenos=table,linenostart=1" >}}


dotnet nuget locals --clear all

{{< / highlight >}}

 **This clear all the caches. After this command run, I simply re-run again the dotnet restore command and this time everything went well.** Gian Maria.
