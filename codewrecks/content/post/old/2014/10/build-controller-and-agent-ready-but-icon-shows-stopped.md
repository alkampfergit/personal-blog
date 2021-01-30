---
title: "Build controller and agent ready but icon shows stopped"
description: ""
date: 2014-10-09T19:00:37+02:00
draft: false
tags: [Tfs]
categories: [Team Foundation Server]
---
Today I encountered a strange error during the configuration of a Build Controller in TFS. We installed and configured the first Build Controller for a TFS Instance, everything went good,  **but both controllers and agent are marked with stopped icon, even if status is “ready”** [![image](http://www.codewrecks.com/blog/wp-content/uploads/2014/10/image_thumb3.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2014/10/image3.png)

 ***Figure 1***: *Controller and agents are marked as stopped even if they are in Ready State*

I immediately looked into Event Viewer, but absolutely no clue of what is happening. I tried creating and scheduling a build, but it starts, then remains silent forever. The build system was not working. I remember a [post by Richard](http://blogs.blackmarble.co.uk/blogs/rfennell/post/2011/09/17/what-to-do-when-your-tfs-build-agent-says-it-is-ready-but-the-icon-says-it-is-not.aspx) where he had the same problem, but I’m not in that scenario. I checked DNS, tried to ping the server and everything is ok, but **builds never starts and there are absolutely no error in event viewer**.

Then I noticed that in the upper section of the Build Server there is another link called Details… that usually is not there. If I clicked on that link it told me that  **the controller is not able to communicate with TFS because he got a 500 internal error response**.

This is extremely painful, because it means that something in the Application Tier is not working properly, so I immediately remote desktop into the TFS machine and looked at the Event Viewer of the server. This time the error is there and luckily enough it was simple to fix.

{{< highlight bash "linenos=table,linenostart=1" >}}


System.ServiceModel.ServiceHostingEnvironment+HostingManager/42931033
 Exception: System.ServiceModel.ServiceActivationException: The service '/tfs/queue/test/Services/v4.0/MessageQueueService2.svc' cannot be activated due to an exception during compilation.  The exception message is: Memory gates checking failed because the free memory (176160768 bytes) is less than 5% of total memory.  As a result, the service will not be available for incoming requests.  To resolve this, either reduce the load on the machine or adjust the value of minFreeMemoryPercentageToActivateService on the serviceHostingEnvironment config element.. ---&gt; System.InsufficientMemoryException: Memory gates checking failed because the free memory (176160768 bytes) is less than 5% of total memory.  As a result, the service will not be available for incoming requests.  To resolve this, either reduce the load on the machine or adjust the value of minFreeMemoryPercentageToActivateService on the serviceHostingEnvironment config element.
   at System.ServiceModel.Activation.ServiceMemoryGates.Check(Int32 minFreeMemoryPercentage, Boolean throwOnLowMemory, UInt64&amp; availableMemoryBytes)
   at System.ServiceModel.ServiceHostingEnvironment.HostingManager.CheckMemoryCloseIdleServices(EventTraceActivity eventTraceActivity)
   at System.ServiceModel.ServiceHostingEnvironment.HostingManager.EnsureServiceAvailable(String normalizedVirtualPath, EventTraceActivity eventTraceActivity)
   --- End of inner exception stack trace ---
   at System.ServiceModel.ServiceHostingEnvironment.HostingManager.EnsureServiceAvailable(String normalizedVirtualPath, EventTraceActivity eventTraceActivity)
   at System.ServiceModel.ServiceHostingEnvironment.EnsureServiceAvailableFast(String relativeVirtualPath, EventTraceActivity eventTraceActivity)
 Process Name: w3wp
 Process ID: 2768

{{< / highlight >}}

 **This is a typical error you can encounter if you install TFS in a single machine configuration**. If you follow general [guidance on MSDN](http://msdn.microsoft.com/en-us/library/dd578592.aspx) the single server approach is ok for groups up to 500 users, with 4 GB of ram and 1 disk at 10k. * **Single server maintenance is easier and for small team is probably the best configuration, but you need to be aware of one possible problem: SQL Server is greed about memory** *.

The problem is that SQL Server tends to use all available memory, until the system starts becoming really, really slow because it has no free memory for other processes.  **Whenever you install TFS in a single machine environment, is a good suggestion to limit maximum amount of memory available to SQL Server, leaving space for the AT to work properly**. I have no gold number to give you, but if you have a single machine with 4 GB of RAM, usually I limit SQL Server to a maximum of 2 GB. In this specific situation I remember talking about this configuration, but it was never done; this results in SQL Server using about 3 GB of RAM in a 4 GB machine, leaving no space for WCF Service to starts.

Lesson learned:  **Whenever something goes wrong in TFS, always have a look at events viewer of all machines involved in the process** (AT, SQL, Build, etc) because root error could originates in another machine and not in the one you are looking at. As a rule of thumb, if something went wrong, always look at the AT machine Event Viewer.

Gian Maria.
