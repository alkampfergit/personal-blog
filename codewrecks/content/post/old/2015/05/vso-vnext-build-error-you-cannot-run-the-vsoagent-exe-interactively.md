---
title: "VSO vNext build error You cannot run the vsoAgentexe interactively "
description: ""
date: 2015-05-23T07:00:37+02:00
draft: false
tags: [build,VSO]
categories: [Azure DevOps]
---
* **Error Symptom** *: *You installed and configured an Agent for the new Visual Studio Online Build System, and you decided not to run as a service, but interactively. When you double click the VsoAgent.exe executable you got this error.*

> You cannot run the vsoAgent.exe interactively from within the Agent folder. Try running it from the parent folder

I’ve encountered this error on my main workstation machine, and I’m not sure why I got this error. Actually I’ve configured agent for TFS 2015 RC without this problem and  **in the same machine I got three distinct agents, but only the one targeting my VSO primary account is having this problem**.

If you open a command prompt and run the program from the parent folder everything runs just fine.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2015/05/image_thumb9.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2015/05/image9.png)

 ***Figure 1***: *Running from the parent folder solves the problem*

* **Solution** *: *the simplest solution to avoid opening a CLI is creating a shortcut to the executable and change the Start In location*

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2015/05/image_thumb10.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2015/05/image10.png)

 ***Figure 2***: *Configure the agent with Start In main folder*

This should solve the problem. Double clicking on the link now run the agent just fine.

Gian Maria.
