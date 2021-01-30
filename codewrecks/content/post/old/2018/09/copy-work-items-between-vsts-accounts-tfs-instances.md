---
title: "Copy Work Items between VSTS accounts  TFS Instances"
description: ""
date: 2018-09-05T08:00:37+02:00
draft: false
tags: [VSTS]
categories: [Azure DevOps]
---
This is a very common question: how can I copy Work Items information from a VSTS account to another account, or between VSTS and TFS. There are many scenarios where such functionality would be useful, but sadly enough, there is no option out-of-the box in the base product.

If you do not have images or other complex data inside your WI and you do not care to maintain history, you can simply create a query that load all the WI you want to copy, open it in excel with TFS / VSTS integration (be sure to select all columns of interest), then copy and past into another Excel instance connected to the destination project, press push and you are done. This is only useful if you do not care losing images contained in description of your Work Item and if you do not care about history, because Excel is not capable of handling images.

> Copy with Excel is a quick and dirty solution to copy simple WI in less than few minutes, without the need of any external tool.

If you need more fidelity you can rely on a couple of free tools. One of the greatest advantage of TFS / VSTS is that everything is exposed with API and everyone can write tool to interact with the service.

A possible choice can be the [VSTS Sync Migration Tools](https://marketplace.visualstudio.com/items?itemName=nkdagility.vsts-sync-migration), if you read the documentation, this is what the tool can do for you.

- Supports all currently supported version of TFS
- Supports Visual Studio Team Services (VSTS)
- Migrates work items from one instance of TFS/VSTS to another
- Bulk edits fields in place for both TFS and VSTS
- Being able to migrate Test Plans an Suits from one Team Project to another
- Being able to migrate Teams from one Team Project to another

It is a good set of feature and the tool is available with [Chocolatey](https://chocolatey.org/packages/vsts-sync-migrator/), so it is really simple to install.  **I’ve friend that used it and confirmed that it is really flexible and probably is the best option if you need high fidelity migration.** Another super useful function of this tool is the ability to map source fields to destination fields, an option that can allow you to copy Work Items between different Process templates. It comes with good documentation and it definitely a tool that worth a shot.

>  **VSTS Sync Migration Tools is one of the most useful tool to move Work Items between Team Project. Mapping capabilities helps to change process template.** Another interesting option can be the [VSTS Work Item Migrator tools](https://github.com/Microsoft/vsts-work-item-migrator), published on GitHub, it has many features, **but is somewhat limited on the version supported,** Source projects can be VSTS or TFS 2017 Update 2 or later and destination project can be only VSTS or TFS 2018 or later, so it is of limited usage if you have some older TFS instance. Nevertheless it migrates all Work Item Fields, attachments links git commit links and history, thus copied work items are really similar to source ones.

Gian Maria.
