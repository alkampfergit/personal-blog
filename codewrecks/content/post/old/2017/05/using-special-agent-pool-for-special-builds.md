---
title: "Using special agent pool for special builds"
description: ""
date: 2017-05-10T20:00:37+02:00
draft: false
tags: [build]
categories: [Team Foundation Server]
---
When you use Build to generate artifact for installation or whenever you need a build to validate code with tasks that are not easily runnable on client machine you  **can have delay to install patches to your production system**.

Lets examine this situation: You have a build that produces artifacts for installation and upload artifacts to VSTS. Then with Release Management you have release plan that deploy in production.  **What happens when you need to deploy an hotfix in production?** > If your deploy is fully automated and you cannot take manual shortcut, you need to have fast build-deploy track for hotfix

In some scenario you can build locally and patch production system manually, but especially when you are in the cloud or with distributed system, you need to rely on your deploy script, not doing anything manually.

To speedup deploy of patch you usually configure reduced pipelines (deploy directly to prod without dev/test/preprod/deploy path) but y **ou need to have artifacts as soon as possible.** The problem is that you can queue a build for your hotfix branch but

- Your build is queued after many other builds
- Your build needs lots of time to execute

This is not a problem if you configure your project with an option to build locally. Such scenario is perfectly fine, but if you have a build that produces artifacts,  **the only option to have a reliable system to execute a local build, is when the build system runs the very same set of scripts that are run locally**. It is a really bad idea to have your build system use a different set of operation than your local build. This approach can be feasible, but often you loose some build system specific capabilities because build script should not rely on build infrastructure. (the usual problem is, how the build grab test results, or logs).

> The simplest way to have a predictive way to generate artifacts, is using builds, because your artifacts are produced with the very same set of operation and from a predefined set of configuration controlled machine (agents)

With such a scenario,**if you want to have the ability to run *High Priority*builds, you usually should have a different agent pool, where you do not schedule any build and have at least one agent always ready to execute your build **.

As an example, here is a pool called Solid, that is composed only by computer capable of running the build on a Solid State Disk.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2017/05/image_thumb-1.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2017/05/image-1.png)** Figure 1: ***Create a special build for high priority builds.*

Usually build agents are configured with standard virtual machine that does not operates with SSD, and this is perfectly acceptable for standard build.

 **Whenever you need a fast build, you want to have agents that are capable of squeezing out everything it can to execute the build as fast as possible.** One of the possibility is using even dev machines. Actually my developing computer is an i7 7700K, with 32GB of ram and a Samsung 960 NVMe disk, I have also a development instance of MongoDb that runs on memory instead that on disk. This will allows builds that does testing against MongoDb really faster than a build machine that runs agent on a standard disk.

Installing and configuring an agent is really simple, and the agent is completely idle so it does not bogus down your dev machine, but whenever you need to trigger a fast build it is ready to be used. If you have a small office, you can simply ask the dev not to schedule heavy task on pc for the time of the build and you have high priority build super-fast system for free. **If you are a big company, probably it is better to have a dedicated super-fast machine that is ready to execute fast build**.

> As for firefighter, you do not want to have all of your firefighters busy when you need them, and it is perfectly fine to keep them idle, ready to operate. At the same way, it is better to have an idle superfast machine to execute high priority builds if you need.

In such a situation remember to configure [Agent Maintenance](http://www.codewrecks.com/blog/index.php/2017/05/06/maintenance-for-build-agent-in-tfs-build/), because it is unlikely that you have big disks. After all if a machine is used rarely and only to do a fast build, a 256 GB ssd is more than enough.

Gian Maria.
