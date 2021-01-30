---
title: "GitHub Actions second round"
description: ""
date: 2019-10-05T09:00:37+02:00
draft: false
tags: [GitHub Actions]
categories: [GitHub]
---
After being capable of running build and test in my GitHub action workflow, it is time to experiment with matrix to have the build run on multiple OSes. This can be tricky if you use (like me) some Docker Images (Mongodb, SqlServer).  **This because when you choose Windows machine, you are using Windows Container services** , not standard Docker for Windows. This means that you are not able to run standard Docker container based on linux, but you need to use Windows Container based image.

> GitHub actions Windows based machines are running Windows Container, not Linux ones.

 **This is especially annoying for me because it seems that there is no SQL Server image available for Windows Server 2019**.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2019/10/image_thumb.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2019/10/image.png)

 ***Figure 1***: *Docker image for Sql Server does not support Windows Server 2019.*

Ok, I’m forced to use Windows server 2016, when I really have preferred to use Windows 2019, that has a much better support for containers.

Apart these difficulties, GitHub actions saved my day because it allows me to specify new variables depending on matrix values, thus  **allowing me to use different container commands for different operating systems** , as you can see in  **Figure 2.** [![image](http://www.codewrecks.com/blog/wp-content/uploads/2019/10/image_thumb-1.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2019/10/image-1.png) 

 ***Figure 2***: *Different mssSql and mongContainer variable values depending on operating system.*

Thanks to the *include* directive, **I’m able to give different value to job variables, I’m creating two new variables: msssql and mongoContainer, that contain the command line to start MsSql server and MongoDb containers.** This is important because, in Windows, the image of MsSql container gaves me problem if I use ‘ instead of “. With include directive I’m able to specify a completely different run command line for different operating system.

This is also fundamental because I need to use two different container images for MsSql, in fact they are different for different operating systems. With linux I can use mcr.microsoft.com/mssql/server:2017-latest-ubuntu, while for Windows 2016 (but not for Windows 2019) I should use microsoft/mssql-server-windows-developer.

> Thanks to include: condition, I can change value for jobs variable depending on Matrix combinations

The net result was that my action now runs in both operating systems.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2019/10/image_thumb-2.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2019/10/image-2.png)

 ***Figure 3***: *Action now runs on both operating systems, I still got error from mongo test because of problem in container in Windows, but this is a different story.*

If I want to run my build and test also against.NET Core 3 Rc, I can simply add another value on dotnet matrix, et voilà, now I got 4 different runs of my workflow.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2019/10/image_thumb-3.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2019/10/image-3.png)

 ***Figure 3***: *Running actions with matrix, cross product between all variables allows me to run action in different combination of operating system and.NET  Core framework.*

 **Thanks to the max-parallel: setting, I ask to the system to run only two build in parallel, but with fail-fast equal to false I’m asking to GitHub to always run all the combination, even if one previous combination fails.** This allows me to always have all four actions run, regardless of the outcome of a previous action.

 **I can also use Exclude to remove some combination from matrix cross product** , in  **Figure 4** I’m excluding running for.NET core 3 on windows machine

[![SNAGHTML181d66](http://www.codewrecks.com/blog/wp-content/uploads/2019/10/SNAGHTML181d66_thumb.png "SNAGHTML181d66")](http://www.codewrecks.com/blog/wp-content/uploads/2019/10/SNAGHTML181d66.png)

 ***Figure 4***: *Excluding a specific combination from matrix combination*

This will generate a total of three runs, I will build both version of framework in linux machine, but only 2.2.401.net Framework on windows machine.

> Include and exclude are powerful action configurations, that allows to configure differently the job or completely exclude some matrix combination, allowing for fine grained control on job parallelism.

Everything is really good, but here is some problems that I encountered while using Actions, but it is completely understandable because it is still in beta.

Running on Windows Machine is slower than Linux, I do not know if this is a problem of docker images, but in  **Figure 5** you can see timing of the action in Linux (red square) and in Windows (blue square). I suspect that Windows machine runs in a much slower hardware. Nevertheless, pay attention at timing, if you are building.NET core, probably linux is the best choice (better container support and faster in GitHub actions).

[![SNAGHTML1d0571](http://www.codewrecks.com/blog/wp-content/uploads/2019/10/SNAGHTML1d0571_thumb.png "SNAGHTML1d0571")](http://www.codewrecks.com/blog/wp-content/uploads/2019/10/SNAGHTML1d0571.png)

 ***Figure 5***: *Timing running the action in Linux and Windows machine*

 **Another area where actions need improvement is the concept of a partially failing action, like we had for Years in Azure DevOps (TFS).** The concept is: when I’m running a series of tests, I do not want the entire action job to stop if one of the test run fails, I want it to be reported failed, continue to the next step, and the entire action should be marked as “partially failing” if one of the job marked with continue-on-error failed.  **This kind of CI workflow is standard, do not stop the script, just continue and mark the single step as failed.** It is true that GitHub actions  **have a continue-on-error property** , but it simply report the step as succeded even if it fails, this is a real annoying missing feature.

[![SNAGHTML41e080](http://www.codewrecks.com/blog/wp-content/uploads/2019/10/SNAGHTML41e080_thumb.png "SNAGHTML41e080")](http://www.codewrecks.com/blog/wp-content/uploads/2019/10/SNAGHTML41e080.png)

 ***Figure 6***: *Continue-on-error actually mark the step as succeeded even if it fails.*

As you can see from  **Figure 6** , step failed (2 test failed), but the it is marked as successful (due to continue-on-error) and the overall execution is green. This is a real missing feature for complex project where you want to execute every steps and visualize which steps failed.

This second wave of test confirmed me that GitHub actions is a powerful build system, but it still need in its early day and need more work to be really usable in complex projects.

Gian Maria.
