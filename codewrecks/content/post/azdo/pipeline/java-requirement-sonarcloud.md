---
title: "Azure DevOps: Use specific version of java in a pipeline"
description: "If you have existing and old SonarCloud pipeline, they could be start failing due to old version of java used, time to automatically install java."
date: 2021-04-26T17:00:42+00:00
draft: false
categories: ["AzureDevOps"]
tags: ["AzDo"]
---

I have lots of pipelines with SonarCloud analysis, and in the last months I've started receiving warning for an old version of Java used in pipeline. **SonarCloud task scanner is gentle enough to warn you for months before dropping the support**, nevertheless there is always the possibility that you forgot to update some agents so some pipeline starts failing with error

> The version of Java (1.8.xxx) you have used to run this analysis is deprecated and we stopped accepting it.

If you have lots of agents, **updating java version in all of them could be annoying**, moreover you can have some other software on those agents that maybe requires some obsolete Java version, preventing you to update. The correct solution is to configure the Pipeline to automatically install java for you, but this is a **task that requires several steps**.

First you need to download the version you need, then you can update it on a azure blob storage to have it available to a **special java task installer**. As you need to know, the task cannot download a JDK installer for you, but it needs **to have a location where it can find the installer**, and the easiest solution is using Azure Blob storage.

![Jdk installer in azure blob storage](../images/jdk-installer.png)

***Figure 1:*** *Jdk installer in azure blob storage*

Once you uploaded the installer on an azure blob, you simply need to **connect that Azure Account to Azure DevOps Team Project**, so the action can simply access the blob without need to input any credential in pipeline definition.

![Add a service connection to Azure Account that contains the blob with jdk installer](../images/service-azdo-connection.png)

***Figure 2:*** *Add a service connection to Azure Account that contains the blob with jdk installer*

Now you can easily use the "Java Tool Installer" Pipeline task and configure to retrieve correct JDK version from your azure Blob storage.

![Java Tool Installer configuration](../images/java-tool-installer.png)
***Figure 3:*** *Java Tool Installer configuration*

Thanks to that task we can easily **use a specific Java version in your pipeline** without worrying to have the correct JDK installed in the target agent.

> Thanks to Azure Blob Storage, distributing correct JDK version between agents is just a matter of configuring a Task.

If you do not like to use an Azure Blob Storage, you can preinstall java version on the agents (in this scenario the task will only configure the correct version to run) or you can save the installer in some local or shared location. **I strongly suggest the Azure Blob option, because it is easy, really straightforward to use and remove the need to have JAVA preinstalled on agent machines.** 

Gian Maria.
