---
title: "Azure DevOps: Conditional variable value in pipeline"
description: "Azure DevOps pipeline have tons of feature, one of the less known is the ability to declare variable conditionally."
date: 2022-06-21T8:00:42+00:00
draft: false
categories: ["AzureDevops"]
tags: ["AzDo", "Pipeline"]
---

Let's examine a simple situation, in Azure DevOps you do not have a way to change pipeline priority, thus, if **you need to have an agent always ready for high-priority builds, you can resort using more agent Pools**. Basically you have N license for pipeline, so you can create N-1 agents in the default Pool and **create another pool, lets call it Fast, where you have an agent installed in a High Performance machine**. When you need to have a pipeline run that has high priority you can schedule to run in Fast Pool and the game is done.

Doing this is super simple thanks to Pipeline parameters, but I have another interesting scenario. I have **many builds of internal libraries used by teams, then when someone publish a stable version for a library, we want this library to be complied and pushed to internal Nuget as soon as possible**

> Time needed to publish internal library in stable version should be low.

When you have many internal libraries, it is normal to 

1. Create a branch on library repository
2. Implement a new feature with all UnitTest
3. Ask for a Pull Request
4. Close everything on main/master and use the new feature in some software

Since these are internal utility, you usually add a new feature because you have a project that needs that feature. Sometimes the feature is a simple **extension method or a really simple new helper function** and you really do not want to wait 1 hour because you push main/master in a moment where you have high amount of build.

The solution I want is being able to automatically schedule pipeline execution **on Fast Pool if I'm compiling main/master branch". This flow seems to me the most natural one, lets the stable version of the code have use high priority queue, while all other checks still run on default queue where developers does not care to wait for a result.

{{< highlight yaml "linenos=table,linenostart=1" >}}
parameters:

  - name: Pool
    displayName: Pool used to run the pipeline
    default: default
    type: string
    values:
      - default
      - fast
{{< / highlight >}}

Parameters allow the user to choose a value during manual trigger, but when **the pipeline is triggered automatically by a push, default value is used**, so in the above situation all runs due to push are executed into the default pipeline.

> What I want is being able to choose the pool to be used based on branch name

Actually I'm used to define a variable for each parameter, so I can access everything with the usual $(VariableName) notation. 

{{< highlight yaml "linenos=table,linenostart=1" >}}
variables:
  ...
  pool: ${{parameters.pool}}
{{< / highlight >}}

This allows for a really simple solution, because **you can set variable values with conditions, thanks to powerful syntax of Azure DevOps pipelines**. Here is the final code.


{{< highlight yaml "linenos=table,linenostart=1" >}}
variables:
  ...

- ${{ if or( eq(variables['Build.SourceBranch'], 'refs/heads/master'), eq(parameters.Pool, 'fast') ) }}:
  - name: Pool
    value: 'fast'
- ${{ else }}:
  - name: Pool
    value: 'default'
{{< / highlight >}}

The syntax could seems strange, but thanks to the **${{ if** instruction I'm able **to use condition directly in the yaml file**. This allows me to tell the engine that, if the parameter Pool is fast or **if the Build.SourceBranch is the master branch I want the value of the variable Pool to be equal to fast**. Condition are evaluated before the pipeline is actually executed, and basically allows you to set part of the YAML file with condition. 

> YAML condition in Azure DevOps pipeline are evaluated before scheduling the run, so they are allowed to select the pool.

This is important because the engine, first of all evaluates all the conditional YAML part, then **when everything was determined, it proceed to analyze YAML content, and schedule the execution on the right pool.**

To diagnose what is happening, after the build is completed you **can download all log in zipped format, because it contains the initializeLog.txt file that contains log of the initialization**. That file is really useful because, as you can see from Figure 1, it contains all checks and condition and expansions that are done before actually executing the pipeline.

![Check initialization of the pipeline](../images/expanded-build-section.png)

***Figure 1:*** *Check initialization of the pipeline*

Then do not forget to look at the azure-pipelines-expanded.yaml files that **contains the result yaml file after all expansions and conditions were evaluated**. These two files are invaluable to diagnose problem when you use some advanced configuration like conditional variables.

In the end the result is obtained, each time that a run is triggered from the master branch, it will be scheduled automatically on Fast pool.

Gian Maria.