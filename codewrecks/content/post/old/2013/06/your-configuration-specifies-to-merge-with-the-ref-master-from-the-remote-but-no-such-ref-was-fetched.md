---
title: "Your configuration specifies to merge with the ref 8216master8217 from the remote but no such ref was fetched"
description: ""
date: 2013-06-08T07:00:37+02:00
draft: false
tags: [Git]
categories: [Visual Studio]
---
A couple of times I encounter this error when I issue a command line pull of a Git repository hosted on TF Service:

> Your configuration specifies to merge with the ref ‘master’  
>  from the remote, but no such ref was fetched.

If you go to the.git folder and open the git *config*file, I noticed the option tagopt set to –tags

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2013/06/image_thumb10.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2013/06/image7.png)

I do not know if that option was setup from the initial Visual Studio clone option (VS Tools for git are still in beta) but removing it should fix the problem and you should be able to do a standard command line pull again

[![SNAGHTML8a18b0](https://www.codewrecks.com/blog/wp-content/uploads/2013/06/SNAGHTML8a18b0_thumb.png "SNAGHTML8a18b0")](https://www.codewrecks.com/blog/wp-content/uploads/2013/06/SNAGHTML8a18b0.png)

Gian Maria
