---
title: "Add a capability to agent in a Deployment Group"
description: ""
date: 2017-07-14T09:00:37+02:00
draft: false
tags: [ReleaseManagement,VSTS]
categories: [Team Foundation Server]
---
When you deploy a Build agent in VSTS / TFS, in the administration page you have the ability to add custom Capabilities to the agent, as you can see in Figure 1.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2017/07/image_thumb-3.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2017/07/image-3.png)

 ***Figure 1***: *Adding capabilities to a standard build agent.*

With the new Release Management, you can install agents in machine that will be added to Deployment Groups.  **If you look at the UI, you can see that the capabilities tab is listing all the capabilities of the agent, but you have not the option to specify custom capabilities.** If you need to add some capabilities, as an example you want to add the VSTest capability because Test Agent was installed manually,  **you can simply add an Environment Variable in the machine.** The agent will translate all the environment variables in Agent Capabilities for you.

As an example here is the result of a release

{{< highlight bash "linenos=table,linenostart=1" >}}


[Error]Unable to deploy to the target 'JVSTSINT' as some of the following demands are missing:
 [DotNetFramework, vstest, Agent.Version 

{{< / highlight >}}

> Environment variables added to the Machine will be added to the capabilities of the agent installed on that machine.

In that specific scenario I do not have vstest capabilities, even if Test runner was installed by the build with WinRm, so I simply added the environment variable in the machine.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2017/07/image_thumb-4.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2017/07/image-4.png)

 ***Figure 2***: *VSTest environment variable added to the machine*

Then restart the service of the agent and the new capabilities is now showing up in the summary.

[![SNAGHTMLc29ccd](http://www.codewrecks.com/blog/wp-content/uploads/2017/07/SNAGHTMLc29ccd_thumb.png "SNAGHTMLc29ccd")](http://www.codewrecks.com/blog/wp-content/uploads/2017/07/SNAGHTMLc29ccd.png)

 ***Figure 3***: *VSTest capabilities now shows up in the agent capabilities list.*

This will allow you to specify any capabilities you want in agents installed in machines on Deployment Groups for VSTS Release management.

Gian Maria
