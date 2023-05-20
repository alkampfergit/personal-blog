---
title: "TFS New Build System vNext agents"
description: ""
date: 2015-06-03T16:00:37+02:00
draft: false
tags: [build,Continuos Integration,vNext]
categories: [Tfs]
---
 **With the latest Visual Studio Online update, the new build system is now online for all users**. As I said in old post, it is completely rewritten and covering all new features really requires lots of time. Since I’m a great fan of Continuous Integration and Continuous Deploy procedures I’d like to do some post to introduce you this new build system, along with the reason why it is really superior to the old one.

In this post I’ll outline some of the improvements regarding build infrastructure management, starting from the most common problem that customers encountered with the older approach.

## Each project collection needs a separate build machine

In the old build system you should install TFS bit and configure Agents and Controller to create a build machine,  **each machine can provide build capabilities only for a project collection**.

> <font>With the new build system, Controller is part of TFS/VSO core installation, you should only deploy agents on build machines and <strong>an agent can provide build capabilities for an entire instance of TFS.</strong></font>

This means that an agent is connected to an entire TFS instance and it can build stuff from every Project Collection in your server. This simplify a lot your infrastructure because you can use a single build machine even if you have multiple Project Collections. If you are a small shop and you use multiple Project Collections to achieve full project separation, probably a single build machine is enough.

## Deploying new agent is complex

With traditional build system you need to deploy Controllers and agents. Both of them requires a full TFS installation, followed by configuration of Build. Everything is administered trough standard TFS Administration Console.

With the new build system  **build controller is part of the core installation, you should only deploy agents in your machine.** > Deploying an agent is a matter of downloading a file, unzip it and run a PowerShell script.

If you are interested in full installation details, you can follow step by step MSDN procedure here: [https://msdn.microsoft.com/Library/vs/alm/Build/agents/windows](https://msdn.microsoft.com/Library/vs/alm/Build/agents/windows "https://msdn.microsoft.com/Library/vs/alm/Build/agents/windows"). This aspect greatly simplify setup of a new agent.

## I’ve multiple VSO accounts, I need multiple build machines

Since the agent is a simple Console Application you can install more agent simply unzipping agents file in different directories of the same machine. In the end you can have a single machine with agents connected to multiple VSO or TFS instances.

> <font>You can use a single build machine for multiple TFS2015 or VSO instances</font>

## Building is limited to windows machine

Since agents are installed with TFS Bits, **the old build system only allow agents to run on a Windows Machine**. Thanks to some Build Extensions you can run Ant and Maven build, but only with a Windows Box.

New build system provide agents also for non Windows machine thanks to the xPlat Agent. [https://msdn.microsoft.com/Library/vs/alm/Build/agents/xplat](https://msdn.microsoft.com/Library/vs/alm/Build/agents/xplat "https://msdn.microsoft.com/Library/vs/alm/Build/agents/xplat")

> <font>You can run TFS/VSO build on non windows machine such as Linux and Macintosh.</font>

## Running local build is complex for developer

There are lots of reasons to run a build in local machines and with the old system you need to do a full TFS installation, leading to a maintenance nightmare. Usually you will end with a lot of stuff in your Continous Integration scripts, such as publishing nuget packages, and lots more. With such scenario,  **running a build in a local machine should be an easy task for developers**.

New agent can run as a service, or run interactively with a simple double-click on the VsoAgent.exe file. Each developer can install agent in minutes and run the agents only when he/she really needs it.

> <font>Running local build is really easy because you can start local agent with a double click, only when you need to run a local build. </font>

You can also attach a debugger to the build if you need to debug some custom code that can run during a build because it is a simple console application.

## Keeping up with update is complex

If you are a large enterprise, you probably  have several build machines and with the older version of TFS you should update all build agents and controller each time you updated TFS instance.  **With TFS 2012 Update 2 this requirement is relaxed, and older build system can target newer version of TFS.** This will give you a timeframe to update all Build Machines after you updated TFS Core installation, but you really need to run TFS Update on all machines with build Agents or Controllers installed.

You will be happy to know that  **the new build agent has automatic update capabilities.** It actually checks for new version at each startup of the agent, if a new version of the agent is available for the server you are connected to, it will automatically download, upgrade and restart the new version.

The only drawback is that, if you are running the agent as a windows service, you should restart the service for the upgrade check to take place. In future version we expect the agent to periodically check for an upgrade instead of requiring restart.

The overall feeling is that the new Build Infrastructure will be really easier to maintain and deploy, also it will give you new capabilities, like building on non-windows machine.

Gian Maria.
