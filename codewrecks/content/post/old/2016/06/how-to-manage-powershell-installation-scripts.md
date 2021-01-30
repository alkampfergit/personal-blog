---
title: "How to manage PowerShell installation scripts"
description: ""
date: 2016-06-18T06:00:37+02:00
draft: false
tags: [devops,PowerShell]
categories: [DevOps]
---
In  [previous post](http://www.codewrecks.com/blog/index.php/2016/06/03/create-a-release-manager-in-tfs-with-powershell-and-zipped-artifacts/) I explained how I like to release software using a simple paradigm:

> build produces one zipped file with everything needed for a release, then a PowerShell scripts accepts the path of this zipped release and installation parameters and executes every step to install/upgrade the software.

This approach has numerous advantages, first of all  **you can always test script with PowerShell ISE in a Developer Machine**. Just download from build artifacts the version you want to use for test, load installation script in PowerShell ISE, then run the script, and if something went wrong (the script has a bug or needs to be updated) just debug and modify it until it works.

My suggestion is to use Virtual Machines with snapshots. The process is,

> restore a snapshot of the machine without the software installed, then run the script, if some error occurred, just restore the snapshot, fix the script, and run again.

You can do the very same using a snapshot of the VM where the software has a previous version of the software installed, so you can verify that the script works even for an upgrade, not only for a fresh installation.  **This is a really simple process, that does not involve any tool related to any release technology.** The ability to debug script using VM and snapshot, is a big speedup for release script development. If you are using some third part engine for Release Management software, probably you will need to trigger a real release to verify your script. Another advantage is that this process allows you to do a manual installation where you can simply launch the script and manually verify if everything is good.

 **You should store all scripts along with source control** , this allows you to:

*1) Keep scripts aligned with the version of the software they install. If a modification of the software requires change in installation scripts, they are maintained togheter.  
2) You can publish script directory as build artifacts, so each build contains both the zipped release, and the script needed to install it.  
3) History of the scripts allows you to track the entire lifecycle of the script, and you can understand why someone changed the script in version Y of your software.   
4) You can test installation script during builds or run during a Build for a quick release on a test environment*

Final advantage is: the script runs on every Windows machine, without the need to use tasks, agents, or other stuff. Once the script is ready to go,  **you first start testing in DEV, QA and Production environment manually**. Manual installation is really simple, just download artifacts from the build, run the script, check script log and manually checks that everything is ok.  **If something went bad (in DEV or QA) open a Bug and let Developers fix the script until everything is ok**.

> Once the script start to be stable, you can proceed to automate the release.

Gian Maria.
