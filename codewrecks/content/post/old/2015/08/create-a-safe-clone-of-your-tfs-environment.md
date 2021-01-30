---
title: "Create a safe clone of your TFS environment"
description: ""
date: 2015-08-07T08:00:37+02:00
draft: false
tags: [TestLab,Tfs]
categories: [Team Foundation Server]
---
## 

## ChangeServerId to avoid confusion of client tools

Around the web there are a lot of resources about how to create a clone of your TFS environment for testing purpose. The most important step was  **always running the** [**TfsCongfig ChangeServerId**](https://www.google.it/search?q=tfsconfig+changeserverid&amp;ie=&amp;oe=) **Command** as described in the [Move Team Foundation Server from your hardware configuration to another](https://msdn.microsoft.com/en-us/library/ms404869.aspx).

With the new wave of guidance for TFS 2015, a new interesting article cames out on how to do a [Dry Run in a pre-production environment](https://msdn.microsoft.com/en-us/Library/vs/alm/TFS/upgrade/pre-production). In that articles a couple of tricks worth a mention, because they are really interesting and easy to do.

## 

## Risk of corrupting production environment

Tfs uses a lot of extra tools and products to fulfill it functions, it is based on Sql Server database but it communicates also with Reporting Services, Sharepoint, SCVMM for Lab management, test controllers and so on. When you restore a backup of your production environment to a clone (pre-production) environment,  **you need to be sure that this cloned installation does not corrupt your production environment.** As an example, if cloned server still uses the same Reporting Services instance of production server, you will probably end with a corrupted Reporting Services Database.

## Protect your environment

In the above article, a couple of simple technique are described to avoid your cloned pre-production TFS corrupt something in production environment.

> Edit your hosts file to make all of production servers not reachable from cloned server.

This is the simplest but most efficient trick, if you **modifiy hosts file in cloned machine, giving an inexistent ip address for all the names of machines related to TFS environment** , you are pretty sure that cloned environment cannot corrupt other services.

If for some reason you forgot to change Lab Management SCVMM Address or Sharepoint, cloned machine is not able to reach them, because name resolves to invalid address.

> Use a different user to run TFS Service cloned environment, and be sure that this user has no special permission

Usually TFS Services runs with an account called TFService, and this account has lot of privileges in all machines related to TFS environment. As an example, it has right to manage SCVMM in a Lab Management scenario.  **If you create a user called TFSClonedService or TFSServiceCloned, withouth no special permission, and use that user to run cloned TFS environment** , you are pretty sure that if cloned environment try to contact some external service (Ex SCVMM, Report Service, Etc) you will get a Unauthorized exception.

Remember that running a cloned TFS instance is an operation that should be done with great care, and you should adopt all techniques useful to limit accidental damage to production environment.

Gian Maria.
