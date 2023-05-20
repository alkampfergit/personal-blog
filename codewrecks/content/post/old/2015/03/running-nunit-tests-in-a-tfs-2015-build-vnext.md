---
title: "Running NUnit Tests in a TFS 2015 Build vNext"
description: ""
date: 2015-03-16T18:00:37+02:00
draft: false
tags: [Team Foundation Server]
categories: [Tfs]
---
## Scenario

In TFS2015 CTP you can have a preview of the new build system that will be available with the next version of Team Foundation Server. If you start  **scheduling a new build that has NUnit test you probably will notice that your unit tests are not executed during the build**.

> To execute NUnit test in a vNext build you should ensure that appropriate tests adapters are available to agents that will run the build

The easiest way to make  **NUnit adapters available is downloading them from Visual Studio Gallery, unzip the.vsix extension file, then copy all the extension file in the folder**.

> C:\Program Files (x86)\Microsoft Visual Studio 14.0\Common7\IDE\CommonExtensions\Microsoft\TestWindow\Extensions

This operation should be done in every machine where you deployed Test Agents that will be used to run build with nunit tests. This can be annoying if you have lots of agents, if you prefer,  **Test Runner Task has an options to specify the path where the agent can find needed test runners**.

The easiest way to automate all the process is adding Nunit Test Adapter nuget package to your test project, adding a standard Nuget Reference.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2015/03/image_thumb.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2015/03/image.png)

 ***Figure 1***: *Add Nuget Package for NUnit Test Adapter*

Once you’ve added the package, you should see all needed assemblies under the package directory of your solution. Now you can specify the location that contains the Nunit Test Adapter directly from Build Definition using this string

> “$(Build.SourcesDirectory)\src\packages\NUnitTestAdapter.1.2\lib”

Please not the use of quotes (“) and the use of the $(Build.SourceDirectory) macro to specify the location where the build is taking place.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2015/03/image_thumb1.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2015/03/image1.png)

 ***Figure 2***: *Specify path of custom Test Adapter inside build definition.*

Pro and con of the two approaches:

### Copying adapters inside Visual Studio TestWindows folder

 **Pro** : You do not need to specify path of the adapters inside each build definition

 **Cons** : You should do this for every machine where agent is deployed.

### Specify Path to Custom Test Adapter with nunit packages

 **Pro** : You can use the version you need referencing different nuget packages. You should not have access to machines where agent is installed.

 **Cons** : You need to remember to use that settings inside each build where you want to run NUnit tests. All Test Adapters should be placed inside the same directory.

Gian Maria.
