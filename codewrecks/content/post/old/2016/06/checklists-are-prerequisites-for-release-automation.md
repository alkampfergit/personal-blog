---
title: "Checklists are prerequisites for Release Automation"
description: ""
date: 2016-06-09T19:00:37+02:00
draft: false
tags: ["ContinuousDeployment"]
categories: [DevOps]
---
I’ve dealt in some posts on how to  **deploy an application with a PowerShell script** that uses an archive produced by a build. Automating a release could be simple or complex, depending on the nature of the software to be deployed, but there is a single suggestion that I always keep in my mind:

> If you don’t have one or more Checklists for manual installation of a software do not even try to autmate installation process

Automatic Release and Continuous Deployment is a real key part of DevOps culture, but**before starting to write automation scripts, it is necessary to ask yourself: *Do I really know every single step to be done in order to release the software?* **This seems a simple question, but in my experience people always tends to forget installation steps: obscure settings in windows registry or in some files, operating system settings, prerequisites, service pack and so on.

Since the devil is in the details, deploying a software manually without a cheklist is almost impossible, because the knowlege on “how to deploy the software” is scattered among team members.

> Scripts are stupid, there is no human intelligence behind a script, it simply does what you told it to do, nothing more.** Before even try to write a script, you should write one or more CheckLists for the installation: PreRequisite Checklist, Installation Checklist, Post Installation Checklist and so on.**Each checklist should contain a series of tests and tasks to be accomplished in order to release the software. If you are not able to take a person, give her/him installation checklists and have her/him install the software successfully, how you can think to write a script that automate the process?

The correct process to create automated script is:

*1) Generate PreRequisite, Installation, PostInstallation CheckList.  
1) Run them manually until they are complete and correct, write down the time needed for each step  
2) Start automating the most time consuming steps.  
3) Proceed until every step is automated.*

 **Usually it is not necessary to immediately try to automate everything** , as an example, if you use virtual machine, you can use golden images to use machines with all prerequisites already installed. This simply the deployment process because you can avoid writing PowerShell DSC, Puppet or Chef scripts to install Prerequisites.

If a specific installation step is difficult to automate (because there is some human intelligence behind it) let this task to be executed manually, but automate other expensive part of the checklist. There is always value in automating everything that can be easily automated.

> Try to use Virtual Machine templates and sysprepped VM to simplify setup of prerequisites. Start creating automation for operations that are repeated for each upgrade, not those ones that are done only once.

 **Step by step you will eventually reach the point where you automated everything, and you can start to do Continous Deployment. If you followed CheckList and rigorous process, your deployment environment will be stable.** If you immediately jump in writing automation scripts, even before knowing all the operation required to install the software (after all it is a simple web site), you will end with a fragile Automatic Deployment Environment, that will eventually require more maintenance time than a manual install.

Gian Maria.
