---
title: "Mounting network share in Release Definition"
description: ""
date: 2017-08-21T19:00:37+02:00
draft: false
tags: [build,release]
categories: [Azure DevOps]
---
Using Deployment Groups with Release Management in VSTS is really nice, because you can use a pull release model, where the agent is running on machines that are deployment target, and all scripts are executed locally (instead of using PowerShell Remoting and WinRM).

A typical release definition depends on artifacts produced by a build and with VSTS  **sometimes it is convenient to store build artifacts in a network share instead that on VSTS.** This is especially true if, like me, you have a internet connection with really slow upload bandwidth (256 Kbps). Storing artifacts in network share reduce the time needed from the build to upload artifact and the time needed by the release to download them to almost few seconds.

> Storing build artifacts in network share is really useful in situation where internet bandwidth is limited.

In this scenario, if the machines that belongs to Deployment Groups are outside your domain you have  **authentication problem when the release process try to access the network share to download the artifacts.** Here the error I have when triggering a release.

{{< highlight bash "linenos=table,linenostart=1" >}}


Downloading artifacts failed: Microsoft.VisualStudio.Services.Agent.Worker.Release.Artifacts.ArtifactDownloadException: 
The artifact directory does not exist: \\neuromancer\Drops\VSO\Jarvis - CI - Package For UAT Test\JarvisPackage debug - 2.1.0-sprint7-team.2078.
 It can happen if the password of the account JVSTSINT\Administrator is changed recently and is not updated for the agent. 

{{< / highlight >}}

This error is clear, the user that runs the agent in the Deployment Groups is not part of the domain, thus it cannot access a network share that is part of the domain.

> Storing artifacts in a network share is useful to reduce bandwidth, but you need to be sure that all agents have access to it.

I want to solve this problem without the need to join the machine to the domain or to configure in some special way the agent on the machine, my goal is resolving this problem inside the release definition.

**To solve this problem you can simply use the *net use* command line tool, that is used to map a network share with specific credentials **, but the download artifact phase of the release takes part before any task and the release will fail before any of your task has the opportunity to run.

[![SNAGHTML5877fcc](https://www.codewrecks.com/blog/wp-content/uploads/2017/08/SNAGHTML5877fcc_thumb.png "SNAGHTML5877fcc")](https://www.codewrecks.com/blog/wp-content/uploads/2017/08/SNAGHTML5877fcc.png)** Figure 1: ***Task used to map the network share.*

A quick solution to this problem is inserting a dedicated Deployment Group phase (Figure 1) before any other phase, call this phase “mount network share” (1) , add a simple Command Line task (2) and finally be sure to select the “Skip download of artifacts” (3) option.  **Point 3 is the most important one, because downloading artifacts takes place before the execution of any task**.

Then I declare a couple of release variables to store username and password of a user that have access to that share (in my domain I have a dedicated TfsBuild account).

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2017/08/image_thumb-8.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2017/08/image-8.png)

 ***Figure 2***: *Variables to mount network share with a valid domain user*

Now I only need to configure the Command Line task to use the *net use*command to mount the network share with the user specified in release variables. The configuration is straightforward and is represented in  **Figure 3.** [![image](https://www.codewrecks.com/blog/wp-content/uploads/2017/08/image_thumb-9.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2017/08/image-9.png)

 ***Figure 3***: *Configuration of Command Line task to use net use command*

 **Thanks to the net use command, the release is able to mount the network share in each machine of Deployment Group using the TfsBuild user**. You can verify from release logs, that the Command Line task correctly run and maps the network share.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2017/08/image_thumb-10.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2017/08/image-10.png)

 ***Figure 4***: *Net use command in action in build logs.*

> Using a special Deployment Group phase with “Skip download of artifacts” selected allows you to run any task you need before the download of the artifacts takes place.

Gian Maria.
