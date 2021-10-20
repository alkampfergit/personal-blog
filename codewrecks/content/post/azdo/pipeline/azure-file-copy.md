---
title: "Azure DevOps: Azure File copy troubleshooting"
description: "Azure File Copy Task is really useful, but sometimes it needs a little bit of love to work."
date: 2021-10-20T07:00:42+00:00
draft: false
categories: ["AzureDevops"]
tags: ["AzDo"]
---

If you need to copy files in a Azure Blob or in an Azure Virtual machine within a Azure DevOps pipeline, Azure File Copy Task is the right task to use, but sometimes you could find some problem that make it fails. In this post I'll state some common errors I found using it and how to solve.

#### Wrong number of arguments, please refer to the help page on usage of this command

If you specify **additional command to the task you can have this error**, actually I was not able to fully troubleshooting the reason, but I discovered that version 4 of the task is somewhat erratic, so it is really **better using version 3 that seems to me really more stable**. 

> Azure File Copy Task is one notable exception where, if you find strange error, it worth returning to previous version.

I starting getting this error in perfectly working pipeline after upgrading to version 4, reverting to version 3 makes everything work. **If you have some strange error, try change version to see if the error is still there**

![Use version 3 of the task if you find wrong number of arguments error](../images/azurefilecopytaskversion.png)

***Figure 1***: *Use version 3 of the task if you find wrong number of arguments error*

#### The system cannot find the file specified. 

This is the most annoying error I've found on the task, I have a pipeline that ran perfectly and suddenly Azure Copy Task starts failing with errors like ** Failed to open file C:\fast\_work\23\s\src\.....\main.0298fc54b62e8ee4c7f6.js.map: The system cannot find the file specified. **

This error was especially annoying because **we didn't immediately find the reason why the task cannot find the file**. After thorough investigation we discover that the file it was trying to upload **was not produced by the build**, this raises an interesting question: *Why the task is trying to upload files that were not included in the folder we want to upload?*.

> Azure File Copy task is based on azcopy command line, that has some default options, like journaling, not so useful for using in a pipeline

One possibility is that a previous operation fails and it is trying to resume, to verify this, check if you find **Incomplete operation with same command line detected at the journal directory "AzCopy", AzCopy will start to resume** in your output log. AzCopy command line is using a journal to recover operations and the default location is the **user profile folder**. This will create a nice problem, because if an upload in a previous build encounters a problem, the next run it will try to resume the upload, but files are not there anymore.

An easy solution is using additional arguments, **specifying a journal folder that was cleaned up at each build to avoid resume**. In my situation I used the artifact directory because I'm sure that it is **cleaned before each run**.

{{< highlight bash "linenos=table,linenostart=1" >}}
/Z:$(Build.ArtifactStagingDirectory)
{{< / highlight >}}

#### No input is received when user needed to make a choice among several given options.

This is another annoying errors that happens if you are trying to **upload a file that was already present in the blob / VM**, to solve this you will need to specify /Y options. If you are uploading an entire directory I use also the /S option. 

> As usual all command line tools will have a input parameter to assume Yes on all query (if you need to run non interactively)

In the end this is **how my custom command line appears in pipeline definition**

![Standard additional parameter for Azure File Copy Task](../images/azcopyadditionalparametesr.png)

***Figure 2***: *Standard additional parameter for Azure File Copy Task*

And this is the corresponding YAML code.

{{< highlight yaml "linenos=table,linenostart=1" >}}
- task: AzureFileCopy@3
  displayName: 'AzureBlob File Copy'
  inputs:
    SourcePath: xxxxx
    azureSubscription: 'yyyy'
    Destination: AzureBlob
    storage: zzzzz
    ContainerName: 'aaaaaaa'
    AdditionalArgumentsForBlobCopy: '/Z:$(Build.ArtifactStagingDirectory) /S /Y'
    sasTokenTimeOutInMinutes: 240
{{< / highlight >}}

Actually I always use version 3 with the AdditionalArgumentsForBlobCopy parameter **for all my pipelines to avoid aforementioned problems** and my pipelines are more stable.

Gian Maria.
