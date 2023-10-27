---
title: "Pills: Install release agent in ARM machines"
description: "Azure Devops release agent can be installed in ARM machines, but you need to tweak a little bit the script because it assumes X64 architecture"
date: 2023-10-27T09:12:42+02:00
draft: false
categories: ["AzureDevOps"]
tags: ["Pills"]
---

With Azure Devops Environments you can register Virtual Machines with a dedicated agent that is capable of releasing your software. The procedure is simple, **just create an environment, and a VM resource, and you are greeted with a minimal UI that let you choose configuration**.

![Configuring an agent for Azure DevOps environment](../images/configure-agent.png)

***Figure 1***: *Configuring an agent for Azure DevOps environment*

As you can see it just require you to select the operating system then you can **copy in clipboard a simple script that you can execute in all machines you want to add in an environment**. You need to have sudo rights to execute the script but running on ARM machine I got this.

> not a dynamic executables

![](agent-arm-error.png)

![Error when you try to install environment agent in ARM machine.](../images/agent-arm-error.png)

***Figure 2***: *Error when you try to install environment agent in ARM machine*

Ok, the error is probably due to the fact that the script is not compatible with ARM architecture. If you look at the script you can **indeed find that it assumes X64 architeture**, and this indeed is the error.

{{< highlight bash "linenos=table,hl_lines=21-28 45-53,linenostart=1" >}}
mkdir azagent;cd azagent;curl -fkSL -o vstsagent.tar.gz https://vstsagentpackage.azureedge.net/agent/3.229.0/vsts-agent-linux-x64-3.229.0.tar.gz; if [ -x "$(command -v systemctl)" ]; then ./config.sh --environment --environmentname "xxxx" --acceptteeeula --agent $HOSTNAME --url https://dev.azure.com/xxxxx/ --work _work --projectname 'xxxx' --auth PAT --token you-have-a-token-here --runasservice; ./svc.sh install; ./svc.sh start; else ./config.sh --environment --environmentname "xxxx" --acceptteeeula --agent $HOSTNAME --url https://dev.azure.com/xxxx/ --work _work --projectname 'Jarvis' --auth PAT --token you-have-a-token-here; ./run.sh; fi

{{< / highlight >}}

This is really a wall of text (one liner script), but in the first part is evident **that the script is downloading the x64 version of the agent**, so no problem, just go to the [Release page in GitHub project](https://github.com/microsoft/azure-pipelines-agent/releases), select the right architecture (ARM) that usually has a link of this type (https://vstsagentpackage.azureedge.net/agent/3.229.0/vsts-agent-linux-arm64-3.229.0.tar.gz) and then proceed to replace the url into your script.

Running the script again should now work and you will end with your **resources added to the environment**

![Your ARM resources is now added to the right environment.](../images/arm-resource-added.png)

***Figure 3***: *Your ARM resources is now added to the right environment*

Gian Maria.