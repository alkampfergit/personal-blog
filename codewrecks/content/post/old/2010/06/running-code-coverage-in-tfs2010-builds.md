---
title: "Running Code Coverage in Tfs2010 Builds"
description: ""
date: 2010-06-14T07:00:37+02:00
draft: false
tags: [TFS Build]
categories: [Team Foundation Server]
---
To have Code Coverage collection for test execution during a build, you first need to create a.testsettings file in the solution with code coverage enabled. To enable code coverage simply open the testsetting file, go to *Data And Diagnostics* and check the *Code coverage* option. This is not enough, because when you check the code coverage option, the *Configure* link highlighted in the picture become enabled.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2010/06/image_thumb21.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2010/06/image21.png)

Since Code Coverage works with instrumentation, you need to configure the assemblies you want to instrument, in my examplce only the MyMath assembly

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2010/06/image_thumb22.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2010/06/image22.png)

To verify that everything is ok just run the test locally and verify that code coverage data is collected. Now you can specify the testsetting file in the build configuration.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2010/06/image_thumb23.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2010/06/image23.png)

You need also to know that in order to collect code coverage settings, you need to have visual studio Premium or Visual Studio Ultimate installed in the machine with the build agent. If you got no code coverage during the build you should check the detailed log, that contains detailed reason and test run output.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2010/06/image_thumb24.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2010/06/image24.png)

If you see this message it means that tests were executed in a machine that has not visual studio ultimate, so the code coverage is disabled. If everything is ok, you should see code coverage result directly in the build output.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2010/06/image_thumb25.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2010/06/image25.png)

To look at code coverage details, you need to click on *View Test Results* and view code coverage output as if it were executed locally.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2010/06/image_thumb26.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2010/06/image26.png)

Alk.
