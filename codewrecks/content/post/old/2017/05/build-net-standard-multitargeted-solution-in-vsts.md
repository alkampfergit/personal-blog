---
title: "Build NET standard multitargeted solution in VSTS"
description: ""
date: 2017-05-24T17:00:37+02:00
draft: false
tags: [build]
categories: [Team Foundation Server]
---
I have a solution with multitargeting enabled to compile for full framework 4.5.2 and.NetStandard 1.6; it works quite well in Visual Studio, but when it is time to create a VSTS / TFS Build, if you using the standard Visual Studio template you got lots of errors.

{{< highlight bash "linenos=table,linenostart=1" >}}


Z:\a\g\_work\_temp\.NETStandard,Version=v1.6.AssemblyAttributes.cs (4, 20) 

Z:\a\g\_work\_temp\.NETStandard,Version=v1.6.AssemblyAttributes.cs(4,20): 
Error CS0400: The type or namespace name 'System' could not be found in the global namespace 
(are you missing an assembly reference?)

{{< / highlight >}}

This happens because.NET Standard uses NuGet for package management, but the standard Task of NuGet restore does not work with a.NET Standard solution. The fix is simple,  **just add a.NET Core Task and ask to issue a dotnet restore command before the standard Visual Studio build**.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2017/05/image_thumb-5.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2017/05/image-5.png)

 ***Figure 1***: *Add a dotnet restore task to restore nuget package for your.NET standard /.NET core solution*

 **Now the solution builds, but no test assembly was found by the Test assembly runner**. Even if you are able to execute tests from Visual Studio, it seems that the Test Assemblies task in VSTS build is not able to find tests, even if we added the correct test adapter from Visual Studio.

>.NET Core and.NET Standard projects uses dotnet.exe tools and even if everything works as expected in Visual Studio, special care should be taken when you configure the build.

 **The solution to this problem is, again, using the dotnet command line utility to run the tests**. The complete configuration is shown in  **Figure 2.** [![image](http://www.codewrecks.com/blog/wp-content/uploads/2017/05/image_thumb-6.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2017/05/image-6.png)

 ***Figure 2***: *Configuration of dotnet command line to run the tests*

The configuration is simple, just add a.NET core task (1), then specify the project that contains the test to run (2) and finally specify arguments to output the result in a format that can be uploaded to VSTS (3). The arguments property is:

* **–logger:trx;LogFileName=$(Common.TestResultsDirectory)\test.trx** *

This simply requests that output should be created in as pecial directory $(Common.TestResultsDirectory) and  **should be in trx format (the standard format known by Visual Studio Test Runner). T** he output file will be called test.trx.

Now you only need to add an action to Publish Test Result to the build, as shown in  **Figure 3**.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2017/05/image_thumb-7.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2017/05/image-7.png)

 ***Figure 3***: *Publishing test result with the appropriate task.*

The configuration of the Publish Test Result task is really straightforward, just specify VSTest as *Test Result Format* (2) and finally specify that you want to publish all \*.trx files inside the $(Common.TestResultsDirectory). The Publish Test Results task can also understand test output of JUnit, NUnit and xUnit.

 **The result is a nice build that is capable of building your multitargeted project, and you can see tests result in the standard UI, even if the tests are executed directly from a command line utility (dotnet.exe).** [![image](http://www.codewrecks.com/blog/wp-content/uploads/2017/05/image_thumb-8.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2017/05/image-8.png)

 ***Figure 4***: *Test results are uploaded to the build as for a standard build.*

Since the project is MultiTargeted, we find both the versions in the Artifacts of the build, as you can see from Artifacts Explorer in  **Figure 5**.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2017/05/image_thumb-9.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2017/05/image-9.png)

 ***Figure 5***: *Both versions (.net 452 and.netstandard 1.6) are present in the artifacts.*

Thanks to the great flexibility of VSTS / TFS build system you can easily create a build that is capable to run tests from command line dotnet.exe tool and upload into the build.

Gian Maria.
