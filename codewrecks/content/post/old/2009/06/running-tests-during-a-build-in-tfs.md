---
title: "Running tests during a build in TFS"
description: ""
date: 2009-06-26T10:00:37+02:00
draft: false
tags: [Team Foundation Server]
categories: [Team Foundation Server]
---
The term â€œBuildâ€ is a complex one that does not only means â€œcompile source files into final assembliesâ€, but it comprehends many other operations that are vital for the project. One of these operation is running unit tests during Tfs build. The reason to have unit tests run at each build is to continuously keep track of the quality of the project.

Specifying test to run in a Tfs build is really simple, since you have a specific step of the wizard dedicated to this operation.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2009/06/image-thumb42.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2009/06/image42.png)

During the definition of the build, I can simply ask to automatically detect tests in all assembly that matches the pattern \*.Test.dll. Now if you schedule a build you should see results of test run.  Here the first result of my test build.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2009/06/image-thumb43.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2009/06/image43.png)

Now we have a problem, because the task â€œrunning testsâ€ is failed, but we also check that we have a â€œNo test resultâ€, something went wrong and weare in trouble :). The most important thing to avoid when you work with Tfs is having panic :) you will always get detailed error of a failing build. To look at these details, you need to look in the file *BuildLog.txt*located in the shared folder used by the build (in my situation is [\\10.0.0.200\Builds\FluentMsTest\BuildWithTests\_20090625.3](file://\\10.0.0.200\Builds\FluentMsTest\BuildWithTests_20090625.3)). Since the failure is due to a Test failure, I need to look for string  **testtoolstask** (the task related to running test) to find problem related to unit testing.

Here is what I found

{{< highlight csharp "linenos=table,linenostart=1" >}}
SBUILD : warning : Visual Studio Team System for Software Testers or Visual Studio Team System for Software Developers is required to run tests as part of a Team Build. 
  The previous error was converted to a warning because the task was called with ContinueOnError=true.
  Build continuing because "ContinueOnError" on the task "TestToolsTask" is set to "true".{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

Ok, it seems that I forgot to install Visual Studio Team System for Software Tester in the Tfs test machine (I'm doing posts using a test virtual machine installed ex novo). Visual studio is needed, because the build is done with msbuild tool, and if visual studio is not present the build machine does not have the correct tasks to use with msbuild. Another interesting stuff is that this error states that build can continue, because the ContinueOnError of â€œTestToolsTaskâ€ is set to true. This is the default setting, when something goes wrong with running tests, the build does not fail, and we have a   **â€œpartially succeededâ€** build.

Now when you install Visual Studio Team System for Software Testers on the build machine, you will finally see test result.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2009/06/image-thumb44.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2009/06/image44.png)

The interesting stuff here is that if you click on the hilighted link, you can download test results on your machine. The file you download can be opened directly from visual studio, and you can examine results as if you executed them locally.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2009/06/image-thumb45.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2009/06/image45.png)

Once again we can see that setting Tfs to run unit tests during the build is a simple process, and can be simply done with the wizard. In the next post of the series I'll deal on more advanced configuration for test run during a build.

alk.

Tags: [Team foundation Server Build](http://technorati.com/tag/Team%20foundation%20Server%20Build)
