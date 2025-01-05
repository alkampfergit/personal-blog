---
title: "Azure DevOps Pills: Differences between old and new release pipeline"
description: "Azure DevOps has two distinct way to create release pipeline, the new one, fully YAML and the old one, based on a GUI. Let's discover which one to use in your scenario"
date: 2025-01-05T08:12:42+02:00
draft: false
categories: ["AzureDevOps"]
tags: ["Release", "Pills"]
---

Happy New Year to everyone. Today I'll deal with a common question I got from customer regarding Azure DevOps release pipeline. The problem arise because **we already had a GUI based pipeline in the past and then we had a fully YAML pipeline** so people are somewhat puzzled on which one to use in their scenario.

> When you have two way to do the same thing you are often confused on which tool to use to reach your goal

## Basic differencies

Clearly Microsot [has a post about the differencies](https://learn.microsoft.com/en-us/azure/devops/pipelines/get-started/pipelines-get-started?view=azure-devops). This specific post has one nice table that shows **features present in the two different tools**. While we reached feature parity between the two, still there are some thing that are not available in the YAML release pipeline.

One is [Task Groups](https://learn.microsoft.com/en-us/azure/devops/pipelines/release/task-groups?view=azure-devops), the ability to group a series of Tasks in a Macro Task that can be reused. This feature is not a real missed one, **thanks to templating it is easy to define templates for release pipeline that can be reused.**. The only real advantage of Task Goups is that they are really simple to use, thanks also to the GUI interface; while templating is a slightly more complex.

> Task groups are not available in new YAML Release but you can use templates to solve even more powerful scenario.

The other feature that is still missing from YAML Release pipeline [is Gates(https://learn.microsoft.com/en-us/azure/devops/pipelines/release/deploy-using-approvals?view=azure-devops#set-up-gates), the ability to create gates between stages (before and after) that allows to define **rules that must be validated before the release can proceed to the next stage**. While the new YAML release can have a similar result with environments, we still miss a real Gates feature where **we can simply state that before you proceed to a next step some condition must be met**.

As an example of a real scenario I got from one customer is that one where [we need to setup a gate that wait for a specific task in Service Now to go in a certain state](https://learn.microsoft.com/en-us/azure/devops/pipelines/release/approvals/servicenow?view=azure-devops&tabs=classic). This is the classic scenario where a release **must wait for something to happen in an external service before it can proceed**. Thanks to the extendibility of Azure DevOps and the MarketPlace we have integration for common software you can find on your customer, like ServiceNow.

> Gates is the most missing feature in the YAML release pipeline

Another big difference is that, classic release can target Deployment Groups, while newer YAML release can target environments. They can be similar but they have some really basic differences. I personally still prefer the deployment groups approach. Both of them **are a way to group a series of resources that will be target for a deployment**, but they have subtle differencies.

Deployment groups machines have a capability section, identical to build agent's one. This allows you to declare which machine has what capabilities, also it **allows a release to fail if a task require a capability (like java) that is not present in the target machine**.

Another difference is the ability to assign Tag to resources of deployment groups. This allows to differentiate machines (es. Frontend, Db, Cache) and then in the release **you can specify for each part of the release required Tags.**

There are also other differences you can find in the MSDN documentation.

## Personal experience

Even if classic release are somewhat "replaced" by the new YAML one, since we still do not have missing feature parity, I think that they can be a viable option. 

One of the most compelling reason on why to use the old release pipeline is that the GUI makes not only easier to create the release, but also **it gives you an immediate and clear picture of how the deployment is done, and all the stages involved in the release**.

![Classic release definition](../images/classic-release.png)

***Figure 1:*** *Classic release definition*

Also the classic release promotes more the idea of **Build once release many** that is a classic mantra of release management. Usually you have **one or more pipelines that creates artifacts from sources and store them in some shared location**..

> Build once and Deploy Many is a basic and consolidated strategy for release management.

With classic release pipeline you are forced to adopt this approach, you **build with a YAML pipeline (or more than one) then you release artifacts (possibly in multiple environments) with one or more releases.** Each release clearly define the **artifact section (the leftmost one in Figure 1) that clearly list all the artifacts that will be released in the pipeline**. You have a similar feature in YAML release pipeline, but it is buried in text format in pipeline definition so it is somewhat difficult to read. Also the GUI helps you to use artifacts coming from external softwares **like jenkins**. 

The YAML release pipeline has the advantage to be included in the code, so the release evolves with the code. **This is absolutely not a problem with classic pipeline, because I always suggests customers to create release scripts in their language of choice (powershell, bash) or use whatever tool they want, then simply call the script or the tooling from the Release**. In this way the release script is part of the source code as for yaml release pipeline.

Having the release pipeline definition in the source code is a problem **where you have different customers, deploy on premise to different customers, so you need to have different release pipelines**. In this scenario environment names, and other stuff leak in the source code, a place where I do not expect to find anything related to the final environment.

Managing of secrets and variable seems to me more clear in the classic GUI based release, or at least I see customers **immediately understand how things works, while they struggle to replicate the same thing on a YAML release pipeline**.

![Classic release variables definition](../images/release-variables-classic.png)

***Figure 2:*** *Classic release variables definition*

As you can see in Figure 2 you can define variables with a nice GUI and you **can immediately understand which value the variable assumes for each stage**. This is a really good feature because you usually have different values for different environments with a nice interface clear and easy to use.

Also with the new YAML release pipeline we ended with using the customer name / Environment as pipeline variable, a thing that confuses most persons and it is error prone. **I really prefer to have a distinct release, with distinct deployment groups, with distinct permission for each customer.**. If you want to replicate the very same think with YAML, you need to do a good work with templates, then define one pipeline for each customer, usually on a different repo ... it is annoying.

If you have a small project that got deployed in the cloud, with nothing more than test/preprod/prod environment, YAML pipelines are great, no problem in using them. 

> If you release on multiple customers, on-premise and cloud, classic releases reduces confusion and makes everything clearer.

Apart from this, I strongly suggest small customers to start with classic release, because they are easier to explain and to use **then if they find some limitation that is solved by YAML, they can move on them.** After all I'm strongly convinced that the real difficult part is organizing your script and code, good logging, good retry rollback strategies and so on. All problems that are completely unrelated on the type of Release pipeline used.

Happy Azure DevOps.

Gian MAria

