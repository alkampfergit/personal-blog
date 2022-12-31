---
title: "Pills: Backup your Azure DevOps server"
description: "I cannot stress enough how important are backups and Azure DevOps Server is not an exception, especially because if you do not schedule backups you can have surprises."
date: 2022-12-31T07:10:42+02:00
draft: false
categories: ["AzureDevOps"]
tags: ["Pills"]
---

Some days ago I got a call from a friend at customer site that experiences some problems with Azure DevOps server. The symptoms are strange **server starts to become unresponsive, it is not possible even to login with Remote Desktop, it seems that there is some memory problem**.

Being unable to diagnose by telephone the problem I suggest them to disable search services, sometimes it can happen that elastic search services consumes too much ram, **since I did not have any other data, I suggests rebooting the machine forcibly from virtualization system and immediately connect with remote destop and disable elastic search service** then try to better diagnose the problem.

For a couple of hours, this seemed to resolve the problem, but then suddenly they have problem again. **I suggests rebooting the machine or trying to read windows event logs to understand if there are information on the problem**.

It turns out (it is not the first time) that the disk is full.

> Simplest installation of Azure DevOps Server is done in a single server with everything, it is really simple to manage, but you absolutely need to backup Sql Server.

This is a standard problem, if you **do not backup Sql Server, transaction log file starts growing until it fills the entire disk**. In an emergency situation you can **change recovery mode to simple, shrink the transaction log file, and put back again recovery mode to full**. This is an emergency procedure, the real solution is to schedule backup of Sql Server.

> Backup of the entire Virtual Machine is now the standard, but it is not always the best solution.

In this particular situation a backup of the entire machine is taken in the night, so it is perfectly sufficient for the customer, but in this situation **Sql Server transaction logs are going to fill the disk**. It is not an immediate process, but after years is a problem that could happen.

If you manage a Azure DevOps server, I strongly encourage you to **configure the official backup from its own management console**, you will configure with few clicks and it can avoid lots of problem. It is really few clicks away, so it is really better to have it configured.

![Backup configured in Azure DevOps server](../images/backup-in-azdo-server.png)

***Figure 1***: *Backup configured in Azure DevOps server*

In Figure 1 you can see a configured backup, but as you can see **Administration console has a special node devoted to backup**. Configuring a backup is simple, in Figure 2 you can see the wizard, first step is simply to give a network share where to store the backup. **It is mandatory that the account that runs Azure DevOps server has write and read access to that location**. You can also choose the retention period.

![Step 1: Choose location](../images/backup-start-azdo.png)

***Figure 2***: *Step 1: Choose location*

In step 2 you need to configure the alerts, it is really important that you configure them **because you need to know if the backup are running correctly**. If you will need the backup it is really bad to discover that no backup is in the expected location because the job is constantly failing since months.

![Step 2: Configure alerts](../images/azure-devops-backup-alerts.png)

***Figure 3***: *Step 2: Configure alerts*

In third and final step you can choose the schedule, as you can see you can create a really good differential backup, **and you can also schedule a transaction log backup each 15 or less minutes**. This is really important because it allows you to loose very few data in case of a VM disaster. 

![Step 3: Schedule configuration](../images/azdo-backup-schedule.png)

***Figure 4***: *Step 3: Schedule configuration*

Once everything is in place, you can simply relax, check your email for **failed and successful jobs** and you can rest assured that you can always restore your Azure DevOps server.

> Backing up the entire Virtual Machine from the Hypervisor is a good strategy, but in my opinion you absolutely need to add the official backup as I shown before.

Advantages of the official backup are:

1. You have an official, standardized and **supported** backup strategy. If you restore your VM and Azure DevOps server does not starts due to some problem in database, you are in an **unsupported situation**.
1. Transaction log of Sql Server stops growing indefinitely, you will avoid Disk Full problems.
1. You can also try restore of the backup on a different machine
   - To simply try out restore procedures and verify how much time you need to restore everything and have your server up and running again
   - to restore on a different machine to test a migration / update
1. You can have much more granular backup, up to few minutes thanks to transaction log backup.

You can always have a backup of the entire VM, this strategy is not exclusive, but **due to its simplicity, there is absolutely no reason not to spent a few clicks and some network share storage space to have an official and supported backup**.

Gian Maria.