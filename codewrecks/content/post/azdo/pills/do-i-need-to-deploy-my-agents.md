---
title: "Pills: Exploring Agent Options in Azure DevOps Pipelines: Managed vs. Self-Hosted"
description: "Knowing when to use Microsoft-managed agents and when to use self-hosted agents in Azure DevOps pipelines is critical for optimizing build and deployment processes. Lets explore pro and cons of each option."
date: 2024-02-02-T08:10:42+02:00
draft: false
categories: ["AzureDevOps"]
tags: ["Pills", "Pipelines"]
---

When configuring Azure DevOps pipelines, developers have a choice to make regarding the execution environment for their pipelines: they can either leverage **Microsoft-managed agents provided in Azure or opt to self-host agents on their own infrastructure**, whether that be on-premises virtual machines or cloud-based instances. One of the first question that arise is: which I need to use for my organization? Let's explore the pro and cons of each option.

> Choosing between managed agents or self-hosted is one of the first question you have when you start using pipelines.

This decision is also not to be made up-front, you can always mix the two options, so it is just a matter of **avoiding to choose the wrong option in the current scenario.**

The critical distinction between these options isn't just the physical location of the machines, but rather the **management responsibilities that come with each choice.** Often, the ease of scalability and reduced maintenance overhead make Microsoft-managed agents the go-to choice for many teams. After all you need zero minutes to use a managed agent.

However, the story doesn't end there. Self-managed agents have their unique advantages, particularly when it comes to the **installation of specific prerequisites required for build processes.**

It is true that a majority of development tools, such as Java or .NET, can be automatically installed by the pipeline itself, not requiring them to be pre-installed on agent machine, but not all tools are supported. If you need .NET to a specific version you have a simple task, but this is not always the case.

![Azure DevOps task to require installation and usage of .NET 8](../images/use-dot-net-8.png)

***Figure 1***: *Azure DevOps task to require installation and usage of .NET *

Primary reasons in my opinion to choose self-hosted agent are:

**Execution Speed**: For complex projects with numerous unit and integration tests, execution time is a critical factor. With self-hosted agents, it's possible to **deploy high-performance machines equipped with multiple CPUs, NVMe SSDs, and substantial RAM, all of which can greatly enhance performance.**

**Specialized Hardware Requirements**: Consider use cases such as running tests that leverage artificial intelligence models; these may necessitate machines with dedicated GPUs to handle the computational load effectively.

**Unique Prerequisites**: Integration tests might **require access to specific databases (SQL, NoSQL) or other tools like Redis or Elasticsearch.** While it's feasible to use [Docker to spin up instances on-demand](https://www.codewrecks.com/post/old/2020/02/github-actions-plus-azure-docker-registry/) for a particular pipeline, this approach is typically slower compared to having a ready-to-go instance.

**Legacy software**: Some legacy solutions are written without the concept of being build by an agent, often they require specific tools installed on Visual Studio, predefined folders inside developer machine and so on. In these scenario before you have the first successfully pipeline lots of time is needed, and usually the answer is **we cannot use pipeline for this project**. A quick and dirty solution is to **install agents on developers machine and starts creating pipeline.** Then you [queue the very same pipeline on another pool](https://www.codewrecks.com/post/azdo/pipeline/conditional-variable-in-pipeline/) where you have only hosted agent and slowly you will refactor your solution.

**Each run can benefit from a previous run**: While hosted service will spin out a new host for each pipeline, a best practice that also minimize security risk, sometimes it is convenient that a **subsequent build can reuse a previous build (maybe only few files are changed).**

**Access to network resources**: Sometimes we need to access network resources on premise to complete the build, or we need to put artifacts in some on-premise network share. In this scenario self-hosted agent are the only choice. 

Disadvantages of this approach are:

**Maintenance**: Self-hosted agents **require maintenance, including patching, updating, and monitoring operating system** and all software installed. It is not uncommon to have disk full, or other problems in your build agents; so be prepared to spend some time in maintenance tasks.

**Slow to scale**: If you need to scale your build process, you need to manually add new agents to your pool, and this is a process that can take time. A good solution is to **package your agent with Docker Compose to have a [ready-to-go agent](https://www.codewrecks.com/post/old/2019/12/azure-devops-agent-with-docker-compose/) that you can scale with a simple command. **

**Security**: The very same agents usually builds different projects from many pipelines and repositories. If one of the pipeline is corrupted and install malware or some other tools, it can alter the security of all subsequent run of others pipeline. **Basically it means that every pipeline+repository that can run on that agent can potentially corrupt other pipelines**. (this problem can be minimized using docker by continuously creating new agent and killing the others after a while).

In the end there are always trade-offs to consider, usually you will end with some managed agents and some on-premise agents, and the most important thing is knowing when to use one or the other.

Gian Maria.