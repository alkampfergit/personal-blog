---
title: "Pills: Conditional Pipeline decorators"
description: "Pipeline decorators are really powerful, but for some users they are a tool too blunt to use. Learn how to run decorator conditionally for an optimal experience"
date: 2023-01-17T00:12:42+02:00
draft: false
categories: ["AzureDevOps"]
tags: ["Pills"]
---

[Pipeline decorators](https://www.codewrecks.com/post/azdo/pills/pipeline-decorators/) are a really peculiar feature of Azure DevOps, because they allow you to **specify a series of tasks that are run for EVERY pipeline in your organization**, so they are rarely needed, but nevertheless they are a nice tool to know because there are situation when they are useful. Moreover, in latest [Sprint 194 update](https://docs.microsoft.com/en-us/azure/devops/release-notes/2021/sprint-194-update) they are expanded to support new functionalities, like running **before or after specific tasks**.

The major criticism against a pipeline decorator is **it runs in every pipeline so it is a really impacting technique to use**, but sometimes we forget that we have a **rich syntax in pipeline to specify conditional execution**. This allows you to change the decorator to run **only if you have a specific variable defined, or you can exclude if you have a specific variable defined**. These two scenarios allows you to implement an op-in or opt-out procedure.

> Having a decorator to run in EVERY pipeline without the ability to even opt-out is usually a too risky/impacting decision.

The solution is really simple, just put a condition in the decorator definition, condition can be positive **if you want to use opt-in or negative if you want to use opt-out**. Let's see an example with the decorator that runs after each build to remove all non source controlled files.

{{< highlight yaml "linenos=table,hl_lines=1,linenostart=1" >}}
steps:
- ${{ if not(eq(variables['skip-clean-decorator'], 'true'))}}:
  - task: CmdLine@2
    displayName: "do a git clean (injected from decorator)"
    inputs:
      workingDirectory: $(Build.SourcesDirectory)
      failOnStderr: false
      script: |
        git checkout -- .
        git clean -xdf
    continueOnError: true
{{< / highlight >}}

> Pay attention to the indentation, **task section must be indented after condition or it will not run**.

As you can see the **very first line of the decorator is a condition**. In this case the condition is **if the variable skip-clean-decorator is not equal to true**. This means that if you define the variable skip-clean-decorator with value true, the decorator will not run. In this example I've used an **opt-out solution, my decorator runs in every build, excepts those one that explicitly disable it**.

If you change the condition removing the not you will use the **opt-in model, the decorator does not run unless you explicitly enable it defining a specific variable**. 

> It is a good practice to at least use opt-out mechanism for your decorators so you can always disable them if you need to.

If you didn't know that a decorator can **run conditionally you can now use it in a more effective way**. Decorators are a really powerful weapon in your arsenal.

Gian Maria.