---
title: "Publishing a Nuget package to NugetMyget with VSO Build vNext"
description: ""
date: 2015-09-26T09:00:37+02:00
draft: false
tags: [build,vNext]
categories: [Team Foundation Server]
---
Publishing a package to myget or nuget with a TFS/VSO vNext build is a breeze. First of all you should  **create a** [**.nuspec file**](https://docs.nuget.org/create/nuspec-reference) **that specify everything about your package and include it in your source control**. Then Add a variable to the build called NugetVersion as shown in  **Figure 1.** [![Adding NugetVersion variable to the list of variables for this build.](http://www.codewrecks.com/blog/wp-content/uploads/2015/09/image_thumb6.png "Adding NugetVersion variable")](http://www.codewrecks.com/blog/wp-content/uploads/2015/09/image6.png)

 ***Figure 1***: *Added NugetVersion variable to build definition.*

In this build I disabled continuous integration, because I want to publish my package only when I decided that the code is good enough to be published. Publishing to a feed for each build is usually a waste of resources and a nice way to make the history of your package a pain. Since I want to do manual publishing I’ve checked the  **“Allow at Queue Time” checkbox, to be able to change Nuget Version Number at queue time.**  **Build vNext has a dedicated step called NugetPackager that takes care of creating your package from nuspec file** , so you do not need to include nuget.exe in your repository or in the server. If you are curious where is nuget.exe stored, you can check installation folder of your build agent, and browse the Task Directory where all the tasks are contained. There you should find the NugetPackager folder where all the script used by the tasks are stored.

[![How to configure Nuget Packager to create your package.](http://www.codewrecks.com/blog/wp-content/uploads/2015/09/image_thumb7.png "Nuget Packager build step")](http://www.codewrecks.com/blog/wp-content/uploads/2015/09/image7.png)

 ***Figure 2***: *Added Nuget Packager step to my build.*

You can use wildchars as pattern to nuspec files; as an example **you can specify \*\*\\*.nuspec to create a package for all nuspec file in your source directory **. In this example I’have multiple nuspec in my repository, but I want to deploy only a specific package during this build, so I’ve decided to specify a single file to use. Thanks to the small button with ellipsis at the right of the textbox, you can choose the file browsing the repository.

[![Thanks to source browsing you can easily choose your nuspec file to create package.](http://www.codewrecks.com/blog/wp-content/uploads/2015/09/image_thumb8.png "Browsing source")](http://www.codewrecks.com/blog/wp-content/uploads/2015/09/image8.png)** Figure 3: ***Browsing source files to choose nuspec file to use.*

Then  **I’ve choose $(Build.StagingDirectory) as Package folder, to be sure that resulting nupkg file will be created in staging directory, outside of the src folder**. This is important, because if you do not choose to clean src folder before each build, you will end with multiple nupkg file in your agent work directory, one for each version you published in the past. If you use StagingDirectory as destination for your nupkg files, it will be automatically cleared before each build.  **With this configuration you are sure that staging directory contains only.nupkg files created by current build**.

Finally in the Advanced tab I’ve used the Nuget Arguments textbox to specify the -version option to force using version specified in the $(NugetVersion) build parameter.

The last step is including a step of type Nuget Publisher, that will be used to publish your package to nuget / Myget.

[![Configuration of NugetPublisher step to publish your package to your feed](http://www.codewrecks.com/blog/wp-content/uploads/2015/09/image_thumb9.png "Nuget publishing")](http://www.codewrecks.com/blog/wp-content/uploads/2015/09/image9.png)

 ***Figure 4***: *Final publishing step to publish nuget to your feed.*

If you use Staging Directory as output folder for your Nuget Package step,**you can specify a pattern of $(build.stagingDirectory)\\*.nupkg to automatically publish all packages created in previous steps **. If you will change the build in the future adding other NugetPackager steps to create other packages, you can use this single Nuget Publisher to automatically publish every.nupkg file found in staging directory.

Finally you need to specify the Nuget Server Endpoint; probably your combobox is empty, so you need to click the** Manage **link at the right of the combo to manage your endpoint.

[![Manage endpoint in your VSO account](http://www.codewrecks.com/blog/wp-content/uploads/2015/09/SNAGHTML563093_thumb.png "Managing Endpoint")](http://www.codewrecks.com/blog/wp-content/uploads/2015/09/SNAGHTML563093.png)** Figure 5: ***Managing endpoint*

Clicking Manage link, a new tab is opened in the service tab of Collection configuration, here  **you can add endpoint to connect your VSO account to other service. Since Nuget or MyGet is not in the list, you should add a new service endpoint of type**  **Generic.** [![Specify your server url and your api key to create an endopint](http://www.codewrecks.com/blog/wp-content/uploads/2015/09/image_thumb10.png "Adding endpoint")](http://www.codewrecks.com/blog/wp-content/uploads/2015/09/image10.png)

 ***Figure 6***: *Adding endpoint for nuget or myget server*

**You must specify the server url of your feed and your API KEY in the *Password/Token Key*field of the endpoint. **Once you press OK the endpoint is created; no one will be able to read the API KEY from the configuration and your key is secured in VSO.

Now all Project Administrators can use this endpoint in your Nuget Publisher step to publish against that feed, without giving them API KEY or password.** All endpoints have specific security **so you can specify the list of the users that will be able to change that specific endpoint or list of users that will be only able to Read that specific endpoint. This is a nice way to save details of your nuget feed in VSO, specifying the list of the user that can use this feed, without giving password or token to anyone.

When everything is done, you can simply queue a new build, and choose the version number you want to assign to your Nuget Package.

[![You can queue the build specifying branch and Nuget Numbering](http://www.codewrecks.com/blog/wp-content/uploads/2015/09/image_thumb11.png "Queuing the build")](http://www.codewrecks.com/blog/wp-content/uploads/2015/09/image11.png)** Figure 7: ***Queuing a build to publish your package with a specific number.*

You have the ability to choose the branch you want to publish, as well as the Number of your nuget package to use. Once the build is finished your package should be published.

[![Feed detail in MyGet account correctly list packages published by my vNext build](http://www.codewrecks.com/blog/wp-content/uploads/2015/09/SNAGHTML601346_thumb.png "Feed Detail")](http://www.codewrecks.com/blog/wp-content/uploads/2015/09/SNAGHTML601346.png)

 ***Figure 8***: *Your package is published in your MyGet feed.*

In previous example I’ve used master branch and published version number 1.3.1. Suppose you want to publish a pre-release package with new features that are not still stable.  **These features are usually in develop branch (especially true if you use GitFlow with git repositories), and thanks to configuration you can simply queue a new build to publish pre-release package**.

[![Specifing developing branch and a package number ending with beta1 you can publish pre-release packages.](http://www.codewrecks.com/blog/wp-content/uploads/2015/09/image_thumb12.png "Publishing pre release package")](http://www.codewrecks.com/blog/wp-content/uploads/2015/09/image12.png)

 ***Figure 9***: *Publish a pre-release package using develop branch and a nuget version that has a –beta1 suffix.*

 **I’ve specified to use develop branch and a nuget version number ending with –beta1, to specify that it is a pre-release package**. When the build is finished you can check from your visual studio that everything is ok.

[![Verify that in Visual Studio stable and Pre-Release package is ok.](http://www.codewrecks.com/blog/wp-content/uploads/2015/09/image_thumb13.png "Visual Studio browsing")](http://www.codewrecks.com/blog/wp-content/uploads/2015/09/image13.png)

 ***Figure 10***: *Verify in Visual Studio that everything is ok.*

Thanks to Build vNext, publishing your package to myget or nuget or private nuget feed is just a matter of including a couple of steps and filling few textboxes.

Gian Maria.
