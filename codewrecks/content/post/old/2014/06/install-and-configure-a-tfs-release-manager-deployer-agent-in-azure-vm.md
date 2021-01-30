---
title: "Install and configure a TFS Release Manager Deployer Agent in Azure VM"
description: ""
date: 2014-06-11T07:00:37+02:00
draft: false
tags: [Azure,ReleaseManagement]
categories: [Team Foundation Server]
---
## The Problem

> You have a domain with TFS and -release management, there are no problems deploying agents on machines inside the domain, but you are not able to configure an agent for machines outside the domain.

Es: you have some Azure VMs you want to use for your release pipeline and you do not want to join them to the domain with VPN or other mechanism.

This scenario usually ends in being not able to configure Deployment Agents in those machines due to various authorization problems. The exact symptom range from getting 401 errors when you try to configure Agent on the VM. Another symptom is being able to configure the Deployment Agent, but whenever the service starts you do not see any heartbeat on the server and in the Event viewer of VM you got error like these ones

*Timestamp: 6/10/2014 6:17:12 AM  
<br>Message: Error loading profile for current user: nabla-dep1\inreleasedeployer  
<br>Category: General  
<br>Priority: -1  
<br>EventId: 0  
<br>Severity: Error  
<br>Title:  
<br>Machine: NABLA-DEP1*

## The usual cause

The most common cause of the problem is a bad configuration of Shadow Accounts and authentication problem between the machine outside the domain and the machines inside the domain.  **I want to share with you the sequence of operation that finally made my Azure VM runs a Deployer Agent and connect to Release Management Server**.

Here is my scenario

My domain is called * **CYBERPUNK** *and the user used to run deployment agents is called * **InReleaseDeployer** *.

The machine where TFS and RM Server is installed is called  **TFS2013PREVIEWO** and Azure VM is called  **NABLA-DEP1**.

I’ve already the user  **CYBERPUNK\InReleaseDeployer** added as a Service user to Release Manager, and I already used to deploy an agent for a machine in the domain with no problem.

Now head for configuring everything for an Azure VM.

## The solution

This is the solution:

> You need * **THREE ACCOUNTS** *:

1. * **CYBERPUNK\InReleaseDeployer** *: You already have this because is the standard domain account used for Domain Agent in machine joined to your domain.
2. * **TFS2013PREVIEWO\InReleaseDeployer** *: this is the shadow account on RM serve machine. It is a local user that should be created in the machine running Release Management server.
3. * **NABLA-DEP1\InReleaseDeployer** *: this is the shadow account on the Azure VM Machine, is a local user on the Azure VM Machine

Now be sure that these account satisfy these conditions:

1. All three accounts * **must have same password** *
2. **NABLA-DEP1\InReleaseDeployer must be *administrator of NABLA-DEP1 machine***, it must also have the right o *logon as a service*.
3. All three account should be added to Release Management Users with these permissions.

Domain user should have the standard Service User flagged

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2014/06/image_thumb3.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2014/06/image3.png)ù

Then the shadow account in the RM machine should be also Release Manager and not only Service User, here is the setting.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2014/06/image_thumb4.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2014/06/image4.png)

Please note that the user is expressed in the form MACHINENAME\username, so it is TFS2013PREVIEWO\InReleaseDeployer, and it is a Release Manager and a Service User.

Finally you need to add the user of the Azure VM.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2014/06/image_thumb5.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2014/06/image5.png)

Even for this user you need to express it in the form MACHINENAME\UserName, so it is NABLA-DEP1\InReleaseDeployer. This completes the setup of the shadow account for your RM Server.

Now it is the turn of the Azure VM so **connect in Remote Desktop on Azure VM, and *login with credentials NABLA-DEP1\InReleaseDeployer user, do not use other users* and finally configure the agent **. Before configuring the agent, open credential manager and specify credentials to connect to the public address of RM Server. You need to add a Windows Credential specifying the Credentials that should be used upon connection to the Remote Release Management Server. Be sure to prefix the user with domain specification, as in the following picture (CYBERPUNK\InReleaseDeployer).

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2014/06/image_thumb6.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2014/06/image6.png)

You should now see the credentials you just entered.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2014/06/image_thumb7.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2014/06/image7.png)

Actually adding Credentials in Windows Credentials is required only if you want to use RM Client to connect to the server, but I noticed that my user had problem connecting to the server if I miss this part, so I strongly suggest you to add RM Server to Windows Credentials to avoid problem.

Now the last step is configuring the agent.** You must specify Nabla-dep1\InReleaseDeployer as the user used to run the service and the public address of your Release Management Server**.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2014/06/image_thumb8.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2014/06/image8.png)

Press Apply settings and the configuration should complete with no error.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2014/06/image_thumb9.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2014/06/image9.png)

Once the Deployer Agent is configured you should be able to find the new agent from Release Management Client, in Configure Path –&gt; Servers –&gt; New –&gt; Scan For New.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2014/06/image_thumb10.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2014/06/image10.png)

Everything is ok, my RM Server is able to see the deployer on the VM even if the VM is outside the network and not joined to corporate domain. Now you can select the new agent and Press Register to register with the list of valid Deployer Agents.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2014/06/image_thumb11.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2014/06/image11.png)

Gian Maria.
