---
title: "Pills: Azure Devops pipeline demands"
description: "If you have pipeline run stuck in queue and some of the pool agent are in idle, if you wonder why those agents did not pick the pipeline, the answer is probably some demands."
date: 2022-12-19T08:10:42+02:00
draft: false
categories: ["AzureDevOps"]
tags: ["Pills"]
---

Situation: You are waiting a pipeline to run, you view at the agent pool queue and notice that some of the agents are in idle, **they are not running any pipeline, yet you have run that are waiting in queue**.

You can have basically two reasons: the first one is you reached maximum number of parallel pipeline that can run on the pool, the second one is that **the pipeline has some demands that are not satisfied by idle agents**. Troubleshooting demands can be annoying, but basically it is just matter of verifying the tasks that are present in the pipeline and check if all agents have required demands.

Actually most of the time the problem is due to **custom demands, manually added to the pipeline to be sure that a pipeline runs only on some agents**. For real old build, such information can be lost in the mind of those that authored the build, but basically the first place where you need to look is build definition in YAML.

{{< highlight yaml "linenos=table,linenostart=1,hl_lines=3-5" >}}
pool:
  name: MyPool
  demands:
  - myCustomCapability   # exists check for myCustomCapability
  - Agent.Version -equals 2.144.0 # equals check for Agent.Version 2.144.0
{{< / highlight >}}

In the above example (taken from official documentation) you can see that you have a demands section **that requires some special capabilities for your agents to be able to run that pipeline**. 

If you still have old-style pipeline (the ones with the default UI editor) you should check demands in a couple of places. First **in the job section where you can view all demands for all tasks presents in the job**.


In Feed settings page you have a **retention policy** that will automatically deletes old packages but keep those ones that are recently used, to avoid removing a package that is still in use.

![Task demands summary in old pipeline definition](../images/demands-in-pipeline.png)

***Figure 1***: *Task demands summary in old pipeline definition*

> Pay attention because Demands show in Figure 1 are only taken from tasks, you can still miss custom demands.

The UI in Figure 1 is sometimes sources of headache, because you have a pipeline that does not run in some agents, yet you **check them and those agents have all required demands**. The problem is that there is another part in the UI where you specify custom demands.

![Custom demands in old pipeline UI](../images/custom-demands-old-ui.png)

***Figure 2***: *Custom demands in old pipeline UI*

As you can see in Figure 2, we have a custom **demands called ufficio that is required to run the pipeline**. Custom demands are really useful, you can find them in the detail of the agent.

![Agent custom capabilities](../images/custom-capabilities.png)

***Figure 3***: *Agent custom capabilities*

If you go to project settings, then "Agent pools" and finally select an Agent, **you can choose capabilities tab where you can View installed capabilities as well define custom capabilities**. In my experience, if a pipeline does not run in an agent, this is the very first place you need to check, just compare custom capabilities between agents, because usually the problem is there.

This happens because standard capabilities are pretty much standard, and thanks to various task that are capable to automaticall install, java, .net core, node, etc, you usually have agents with pretty much nothing installed (usually Visual Studio is the only exception), so **standard capabilities are never the reason why an agent is not able to run a pipeline**.

Gian Maria.