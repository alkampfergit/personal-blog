---
title: "Publishing web project on disk during build"
description: ""
date: 2014-09-23T15:00:37+02:00
draft: false
tags: [Msbuild]
categories: [NET framework]
---
During a build you can ask MsBuild to deploy on build using the switch /p:DeployOnBuild=true as I [described in previous posts](http://www.codewrecks.com/blog/index.php/2013/07/05/deploying-on-azure-web-sites-from-on-premise-tfs/). This is mainly used to deploy the site on IIS thanks to WebDeploy, but you can also use WebDeploy to deploy on a disk path. The problem is that the path is stored in publication settings file,  **but what about changing that path during a Build** ?

The answer is simple, you can use the /p:publishUrl=xxx to override what is specified inside the publication file and choose a different directory for deploy. Es.

> msbuild WebApplication1.csproj /p:Deploy  
>  OnBuild=true /p:PublishProfile=Profile1 /p:publishUrl=c:\temp\waptest

Thanks to this simple trick you can instruct MsBuild to store deployed site in any folder of the build server.

Gian Maria.
