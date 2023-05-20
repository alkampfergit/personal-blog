---
title: "Troubleshoot a failing build a Winrm story"
description: ""
date: 2017-06-03T08:00:37+02:00
draft: false
tags: [build,PowerShell]
categories: [Tfs]
---
 **Many VSTS build and deploy tasks are based on Winrm to operate on a remote machine** , one of the most common is the “Deploy Test Agent on” that will install a test agent on a remote machine.

[![This image shows the deploy test agent task on a standard build](https://www.codewrecks.com/blog/wp-content/uploads/2017/05/image_thumb-14.png "Deploy test agent task ")](https://www.codewrecks.com/blog/wp-content/uploads/2017/05/image-14.png)

 ***Figure 1***: *Task to install a TestAgent on a different machine*

If you are not in a domain [Winrm](https://msdn.microsoft.com/en-us/library/aa384426%28v=vs.85%29.aspx) can be a really thought opponent, especially because the target machine is not part of the same domain and is not trusted. Usually you configure the build, insert all password but when you run the build you incurr in an error like this one.

*Error occured on ‘yourmachinename:5985’. Details : ‘Connecting to remote server jintegration.cyberpunk.local failed with the following error message : The WinRM client cannot process the request. If the authentication scheme is different from Kerberos, or if the client computer is not joined to a domain, then HTTPS transport must be used or the destination machine must be added to the TrustedHosts configuration setting. Use winrm.cmd to configure TrustedHosts. Note that computers in the TrustedHosts list might not be authenticated. You can get more information about that by running the following command: winrm help config. For more information, see the about\_Remote\_Troubleshooting Help topic.’. For troubleshooting, refer*[*https://aka.ms/remotevstest*](https://aka.ms/remotevstest)*.*

This error can happen for various reasons, firewalls, trust, misconfigured winrdm and so on, but the annoying stuff is:  **each time you change some configuration trying solve the problem, you usually re-schedule a build and need to wait for the build to complete to understand if the problem is gone**. This way to proceed is something that actually kills your productivity.

> Whenever possible, try to verify if the build is fixed without queuing another entire build.

In the new VSTS Build, the agent is running simple tasks, most of the time they are composed by PowerShell scripts, so it  **is really better running scripts manually to verify that your problem is gone, instead of launching another entire build**. In this scenario the problem is *winrm configuration*, and you can use a simple *winrs* command from the machine where the VSTS Agent is running.

{{< highlight bash "linenos=table,linenostart=1" >}}


winrs -r:jintegration.cyberpunk.local /u:.\administrator /p:myP@ssword dir

{{< / highlight >}}

 **This simple command will try to execute the dir command on the computer jintegration.cyberpunk.local using winrm** , if you see the result of the dir command, it does mean that WinRs is configured and the computer can be contacted and it accepts WinRm commands. If you have any error, you should check your configuration and retry again. Once winrs command runs fine, communication between the two machine is ok. The important aspect is that  **until winrs command gives you error, you can be 100% sure that your build will not complete.** > Replicating the commands issued by the build agent outside the build, greatly reduces the time needed to solve the problem.

In my situation here are the set of commands I’ve run to have Winrs command to works.

1) Ensure that winrm is enabled on both computer, do this with command *winrm quickconfig*2) Verify that on target computer port 5985 is opened for connection  
3) Run in both computers the command: *winrm s winrm/config/client ‘@{TrustedHosts=”RemoteComputer”}’*where RemoteComputer is the name of the other computer. If you want to do a quick test you can specify \* as Remote Computer name

After these three steps I was able to execute the WinRs command. Now I queued another build to verify if the task is now working ok.

[![The image shows the output of the step &quot;Deploy test agent&quot; and it shows that now the build agent was capable of using winrm to connect to target machine.](https://www.codewrecks.com/blog/wp-content/uploads/2017/06/image_thumb.png "Deploy test agent task is ok")](https://www.codewrecks.com/blog/wp-content/uploads/2017/06/image.png)

 ***Figure 2***: *Deploy test agent task now runs without error*

Actually I’ve done several tentative to troubleshoot the reason of the error, but since I checked each time with a simple winrs command (instead of waiting 4 minute build to run) the total time to troubleshoot the issue was few minutes instead of an hour or more.

Gian Maria.
