---
title: "Decide to publish artifacts on Server or Network Share at queue time"
description: ""
date: 2017-07-19T16:00:37+02:00
draft: false
tags: [Tfs,VSTS]
categories: [Tfs]
---
A build usually produces artifacts and thanks to the extreme flexibility of VSTS / TFS Build system, you have complete freedom on what to include as artifacts and where you should locate them.

Actually you have a couple of options out of the box, a network share or directly on your VSTS / TFS Server. This second option is especially interesting because you does not need a special network share and you do not have permission issue (every script or person that can access the server and have build permission can use the artifacts).  **Having everything (build result and artifacts) on the server simplify your architecture** , but it is not always feasible.

> Thanks to VSTS / TFS  you can store artifacts of builds directly in your server, simplifying the layout of your ALM infrastructure.

The main problem with artifacts stored in the server happens with VSTS, because  **if you have really low upload bandwidth, like me, it is really a pain to wait for my artifacts to be uploaded to VSTS and is is equally a pain to wait for my releases to download everything from the web.** When your build server is local and the release machine, or whatever tool need to consume build artifacts is on the same network, using a network share is the best option, especially if you have good Gigabit network.

The option to “where to store my artifacts” is not something that I want to be embedded in my build definition,  **I want to be able to choose at queue time** , but this is not possible, because the location of the artifacts cannot be parameterized in the build.

> The best solution would be to give user the ability to decide at queue time where to store artifacts. This will allow you to schedule special build that store artifacts on a network share instead that on server

The obvious and simple solution is to use Two “Publish Artifacts” task, one configured to store artifacts on the server, the other configured to store artifacts on a network share.  **Then create a simple variable called PublishArtifactsOnServer and run the Publish Artifacts configure to publish on the server only when this value is true.** [![SNAGHTML7ebdcd](https://www.codewrecks.com/blog/wp-content/uploads/2017/07/SNAGHTML7ebdcd_thumb.png "SNAGHTML7ebdcd")](https://www.codewrecks.com/blog/wp-content/uploads/2017/07/SNAGHTML7ebdcd.png)

 ***Figure 1***: In Figure 1 there is the standard configuration of a Publish Artifact task that stores everything on the server and it is run on the custom condition that the build is not failed and the PublishArtifactsOnServer is true. Now you should place another Publish  Artifacts task configured to store drops on a network share.

[![SNAGHTML80160a](https://www.codewrecks.com/blog/wp-content/uploads/2017/07/SNAGHTML80160a_thumb.png "SNAGHTML80160a")](https://www.codewrecks.com/blog/wp-content/uploads/2017/07/SNAGHTML80160a.png)

 ***Figure 2***: *Another Publish Artifacts task, configured to run if PublishArtifactsOnServer is not true*

In Figure 2 you can verify that the action is configured with the very same option, the only differences are the Artifact Type that is on a File Share with the corresponding network share and the Custom condition that runs this action if the build is not failing and if  **the PublishArtifactsOnServer variable is NOT equal to true.**  **This is another scenario where the Custom Conditions on task can allow you for a highly parameterized build** , that allows you to specify at queue time if you want your artifacts stored on the server or onto a network share. The only drawback to this solution is that you need to duplicate your tasks, but it is a really simple things to do. Now if you queue a build where PublishArtifactsOnServer is true, you can verify that your artifats are indeed stored on server.

{{< highlight bash "linenos=table,linenostart=1" >}}


2017-07-07T16:28:21.0609004Z ##[section]Starting: Publish Artifact: primary drop 
2017-07-07T16:28:21.0618909Z ==============================================================================
2017-07-07T16:28:21.0618909Z Task         : Publish Build Artifacts
2017-07-07T16:28:21.0618909Z Description  : Publish Build artifacts to the server or a file share
2017-07-07T16:28:21.0618909Z Version      : 1.0.42
2017-07-07T16:28:21.0618909Z Author       : Microsoft Corporation
2017-07-07T16:28:21.0618909Z Help         : [More Information](https://go.microsoft.com/fwlink/?LinkID=708390)
2017-07-07T16:28:21.0618909Z ==============================================================================
2017-07-07T16:28:22.6377556Z ##[section]Async Command Start: Upload Artifact
2017-07-07T16:28:22.6377556Z Uploading 2 files
2017-07-07T16:28:27.7049869Z Total file: 2 ---- Processed file: 1 (50%)
2017-07-07T16:28:32.7375546Z Uploading 'Primary/xxx.7z' (14%)
2017-07-07T16:28:32.7375546Z Uploading 'Primary/xxx.7z' (28%)
2017-07-07T16:28:32.7375546Z Uploading 'Primary/xxx.7z' (42%)
2017-07-07T16:28:37.7827330Z Uploading 'Primary/xxx.7z' (57%)
2017-07-07T16:28:37.7827330Z Uploading 'Primary/xxx.7z' (71%)
2017-07-07T16:28:40.3306829Z File upload succeed.
2017-07-07T16:28:40.3306829Z Upload 'C:\vso\_work\13\a\primary' to file container: '#/534950/Primary'
2017-07-07T16:28:41.4309231Z Associated artifact 214 with build 4552
2017-07-07T16:28:41.4309231Z ##[section]Async Command End: Upload Artifact
2017-07-07T16:28:41.4309231Z ##[section]Finishing: Publish Artifact: primary drop 

{{< / highlight >}}

As you can see from the output of the task, the task uploaded the artifacts to the server. Now you can schedule another build with PublishArtifactsOnServer to false and you should see that the other task was executed, now the artifacts are on a network share.

Gian Maria
