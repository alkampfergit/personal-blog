---
title: "Azure DevOps: pipeline permission to use an agent pool"
description: "When you create an agent Pool in Azure DevOps to run your pipeline, you can require each pipeline to be authorized to run on that agent and sometimes this can generate some glitch."
date: 2023-01-10T07:00:42+00:00
draft: false
categories: ["AzureDevops"]
tags: ["AzDo", "Pipeline"]
---

Scenario: We had created a **new Agent Pool** in Azure DevOps called "linux" and we added some **agents based on docker**, and finally scheduled pipeline to run on that agent pool. A couple of pipelines had no problem, than we change on existing pipeline to run **one job on linux pool but the pipeline failed execution**. The error is depicted in **Figure 1**

![Failed build details after changing pool to linux](../images/build-failed-not-allowed-to-run-on-agent.png)

***Figure 1***: *Failed build details after changing pool to linux*

The error is quite strange, ***(1)*** we have clearly a failed build, the build is red, but in ***(2)*** **we have a link "Show 1 additional error" that does nothing when you click on it**, and finally ***(3)*** we can **verify that last job was canceled**. 

> The problem is a job canceled, and that is the job we moved to the new agent pool