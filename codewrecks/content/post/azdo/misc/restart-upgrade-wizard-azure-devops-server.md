---
title: "Azure DevOps Server: restart upgrade wizard"
description: "Suppose you just upgraded your Azure DevOps Server and during the upgrade procedure the wizard tells you that some prerequisites are missing (like sql server version) how should you proceed?"
date: "2022-12-16T06:00:00+02:00"
draft: false
categories: ["AzureDevOps"]
tags: ["AzDo", "Pills"]
---

There are lots of reason why you have an **on-premise installation of Azure DevOps**, and if you manage it, you must devote some time to keep it upgraded to the latest version. 

> Keep your Azure DevOps server instance up to date constantly to avoid too big updates.

Upgrade procedures are really simple, you just **launch the setup.exe from the latest version and follow the wizard**. Actually not every person knows that the upgrade is basically a set of steps.

- All services are stopped
- Actual version is uninstalled
- New version is installed (binary, dependencies, etc)
- A wizard to configure the instance (new instance or upgrade) is launched

Now suppose you forgot to read the requirements of the latest version you are going to install, and you have an unsupported SQL server instance, **you will proceed up to the last point, configure the wizard, but you get a failure at the end when it verify the database version**.

Actually this is sometime a moment of panic, people start getting lost because they do not know how to proceed. Actually the situation is indeed really simple: **you close the wizard and proceed to fix what is missing**. In case of old version of SQL Server, just perform an Upgrade In Place of the SQL engine, or simply backup everything, install SQL on another server, and restore the database. If **you have a single machine installation you can simply upgrade in place, and usually you are asked to reboot**. Now it is a good time to upgrade OS and everything if you forget to do so, in this state **Azure DevOps Server is not configured, it is completely inactive, database are not accessed by anything and you can safely proceed to install/configure everything**.

![Open Azure DevOps Administration console](../images/open-azure-devops-server-console.png)

***Figure 1***: *Open Azure DevOps Administration console*

Now you can simply open Administration Console, and you **should have the very same situation of Figure 1**: server is not configured and not operational. This is the very same situation you will have if you install latest version **in a new Machine**. Now you can simply choose to configure the instance to **reopen the wizard**.

> Alwasy remember that everything related to Azure DevOps in inside Sql Server database

Now it is a really good moment to have a backup of your databases (I hope you have scheduled automatic backup from the console). **Now the wizard restart and you just need to specify Sql Server Instance to upgrade your existing instance**. 

![Choose database to upgrade and simply finish the wizard](../images/choose-azdo-database-to-upgrade.png)

***Figure 2***: *Choose database to upgrade and simply finish the wizard*

Now complete the wizard and you are done. So remember, if Azure DevOps upgrade wizard failed for some reason or for some missing requirement, **you can simply close the wizard and proceed to fix the issue**. Then you can simply reopen the wizard and continue the upgrade procedure.

Gian Maria.