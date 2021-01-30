---
title: "Error in AsyncProcessMessage during deploy phase of a TFS Lab Management Build"
description: ""
date: 2014-02-17T18:00:37+02:00
draft: false
tags: [Lab Management]
categories: [Lab Management]
---
I have a customer that experiences this error during a build with Lab Management:

<font face="Consolas" size="2">Exception Message: Team Foundation Server could not complete the deployment task for machine xxx ….<br>Server stack trace:&nbsp;&nbsp;&nbsp; <br>at Microsoft.TeamFoundation.Lab.Workflow.Activities.RunDeploymentTask.ExecuteDeploymentTask.RunCommand(AsyncState state)&nbsp;&nbsp; <br>at System.Runtime.Remoting.Messaging.StackBuilderSink._PrivateProcessMessage(IntPtr md, Object[] args, Object server, Object[]&amp; outArgs)&nbsp;&nbsp; at System.Runtime.Remoting.Messaging.StackBuilderSink.AsyncProcessMessage(IMessage msg, IMessageSink replySink)Exception rethrown <br>at [0]:&nbsp;&nbsp;&nbsp; at System.Runtime.Remoting.Proxies.RealProxy.EndInvokeHelper(Message reqMsg, Boolean bProxyCase)&nbsp;&nbsp; <br>at System.Runtime.Remoting.Proxies.RemotingProxy.Invoke(Object NotUsed, MessageData&amp; msgData)&nbsp;&nbsp; <br>at System.Action`1.EndInvoke(IAsyncResult result)&nbsp;&nbsp; <br>at Microsoft.TeamFoundation.Lab.Workflow.Activities.RunDeploymentTask.ExecuteDeploymentTask.EndExecute(AsyncCodeActivityContext context, IAsyncResult result)&nbsp;&nbsp; <br>at System.Activities.AsyncCodeActivity.CompleteAsyncCodeActivityData.CompleteAsyncCodeActivityWorkItem.Execute(ActivityExecutor executor, BookmarkManager bookmarkManager)</font>

This [customer](http://www.biesse.com/it/corporate) is developing a complex software that uses OpenGL to render on the screen and it uses lots of custom code to verify the output of the rendering. Lab management build is simply an **Xcopy deploy of the nightly build on a physical environment where the UI test are run on the output of the nightly build**.

This kind of errors are not really informative, moreover we have a strange behavior, the first run of the build usually fails, if you run it the secondo time most of the time it got green, the third time it is always ok. Since deployment scripts usually copy build output to the server, this sounds like a timeout. The first time the script runs it copies some files, then it goes in timeout, the subsequent run will finish copying the rest of the files and everything is good (copy is made with robocopy so only files that were not still copied will be copied the subsequent run).

The strange aspect is that the timeout happens after a couple of minutes of run, while the build is configured to wait for 30 minutes for deploy script to finish.

If you have such a problem, please check how you are actually deploying binaries to the server.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2014/02/image_thumb23.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2014/02/image23.png)

 ***Figure 1***: *Deploy phase of a Lab Management Build*

In such example,  **deployment is done invoking robocopy and xcopy directly from cmd /c and this could cause a problem of timeout**. The bad stuff about this kind of error, is that it does seems to completely ignore timeout value for deployment script that you specify in the build. If you have this kind of deploy, I strongly suggests you to move to a script based solution (PowerShell is the best choice but a simple bat can be enough). I’ve blogged in the past on [how to deploy a Web Project and a Database in a Lab Management virtual environment](http://www.codewrecks.com/blog/index.php/2010/06/29/deploy-a-solution-and-a-database-in-a-lab-management-virtual-environment/). My suggestion is  **creating a script that will be stored inside source control, then reference the build in the solution so it will be copied in drop folder during a build, and finally configure Lab Management Build to run script on the machine**.

![](https://www.codewrecks.com/blog/wp-content/uploads/2010/07/image_thumb6.png)

 ***Figure 2***: *Deploy the build using scripts in source control that will be copied to drop location*

Using the deploy script instead of using directly Cmd.exe solved the problem and the build now is able to deploy all the times without problems.

Gian Maria.
