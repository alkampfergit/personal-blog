---
title: "Publish nuget package during build NET Standard"
description: ""
date: 2017-05-29T20:00:37+02:00
draft: false
tags: [build,nuget,VSTS]
categories: [Team Foundation Server]
---
In a previous post I dealt with how to build a [Multitargeted dotnetcore solution in VSTS](http://www.codewrecks.com/blog/index.php/2017/05/24/build-net-standard-multitargeted-solution-in-vsts/), but the build is not really complete unless you are publishing the result somewhere. Since my example was a simple library, the obvious solution is publishing everything to a nuget feed.

 **Publishing with nuget is really really simple with VSTS build system** , because you should simply use another.NET Core task instance plus a NuGet publisher.

[![This image shows two tasks in the build, the dotnetpack and nuget publisher.](http://www.codewrecks.com/blog/wp-content/uploads/2017/06/image_thumb-7.png "Tasks in the build")](http://www.codewrecks.com/blog/wp-content/uploads/2017/06/image-7.png)

 ***Figure 1***: *Couple of simple task is enough to publish to nuget feed*

The configuration of these two task is really really simple, the dotnet pack task needs the list of the project that we want to publish and an additional command line that allows you to specify the version to publish and some other options.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2017/06/image_thumb-8.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2017/06/image-8.png)

 ***Figure 1***: *.NET core task configuration*

> Thanks to dotnet task, it is really easy to invoke dotnet command during a build, thus, creating nuget package is really a breeze.

You should use pack command an in the projects section allows you to specify directly all the path of the csproj you want to publish, and in the arguments I’ve used several options.  **Here is the complete arguments commandline** :

–configuration $(BuildConfiguration) –no-build /p:Version=$(NugetVersion) -o $(build.artifactstagingdirectory)\Nuget

configuration allows to decide what configuration you want to release **, the –no-build option is needed to speedup the build, because the projects where built with previous tasks, there is no need to build them another time.** The /p:Version parameter allows me to specify the version of the nuget package and finally the –o options allows you to specify the folder where the packages will be created.

After this task you have the Nuget Publisher task, that simply need to know the folder where the build generated the nuget packages and the target package where to publish the result.

[![This picture shows the configuration of nuget publisher wher I simly selected the path that contains nuget packages and the endpoint destination](http://www.codewrecks.com/blog/wp-content/uploads/2017/06/image_thumb-9.png "Configuration of the NuGet Publisher task.")](http://www.codewrecks.com/blog/wp-content/uploads/2017/06/image-9.png)

 ***Figure 3***: *Configuration of the NuGet Publisher task.*

Et voilà, this is everything you need to do to have your package to be published and thanks to multitargeting, the nuget package automatically contains all the version of the framework you are targeting.

[![Package details in myget, showing that all targeted framework are included in the package](http://www.codewrecks.com/blog/wp-content/uploads/2017/06/image_thumb-10.png "details of the package")](http://www.codewrecks.com/blog/wp-content/uploads/2017/06/image-10.png)

 ***Figure 4***: *Package details in myget, showing that all targeted framework are included in the package*

> With a simple couple of task and 1 minute configuration, you have your library published to nuget feed.

Gian Maria.
