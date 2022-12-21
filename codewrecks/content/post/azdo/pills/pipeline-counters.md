---
title: "Pills: Azure Devops pipeline Counters"
description: "If you need to have a unique incremental number for each pipeline run, Counters are your solution"
date: 2022-12-21T08:10:42+02:00
draft: false
categories: ["AzureDevOps"]
tags: ["Pills"]
---

Sometimes you need to have a unique number in your pipeline, usually this is needed to **generate a unique version number as an example for publishing NuGet packages and avoid conflict**. If you use Git (and there is no need to not use it) you can use [GitVersion](https://gitversion.net/docs/) to generate **a unique semver version number that is unique for each build**. But if you are not using Git and GitVersion, or if you need to rebuild the same commit and have a **unique version for each run, regardless of the commit** you can use a Counter. 

> A counter is a sort of auto incremented Dictionary container scoped to a pipeline.

Lets see how you can declare a counter, the following example is taken from the [official documentation](https://learn.microsoft.com/en-us/azure/devops/pipelines/process/expressions?view=azure-devops):

{{< highlight yaml "linenos=table,linenostart=1,hl_lines=4" >}}
variables:
  major: 1
  # define minor as a counter with the prefix as variable major, and seed as 100.
  minor: $[counter(variables['major'], 100)]
{{< / highlight >}}

As you can see a variable called $(minor) is defined as a counter, passing two parameters. The first parameter is called prefix and it is used to have multiple counters for each pipeline. This means that **For each prefix you will have a different counter and so a different sequence**. Second parameter is seed, and it is simply **the first number that will be generated for a prefix**.

Now suppose you run the pipeline, what happens is that during the first run, Azure DevOps engine will create a sort of dictionary with 1 as key and 100 as value and value of $(minor) will be 100. If you run again the pipeline, **the engine will check the entry of the dictionary, found that for entry 1 there is a value of 100, will increment to 101 and so the value of $(minor) will be 101**. 

If you change major version for the pipeline, you will have a new entry in the dictionary with 2 as key and first value 100. **At the end of the run you have value 101 for key 1 and 100 for key 2**. This will helps you to maintain different counters for the same pipeline based on some logical key.

Another interesting example is defining the variable to have **a seed that is based on timestamp, like this:**
{{< highlight yaml "linenos=table,linenostart=1" >}}
variables:
  buildNumber: $[counter(format('{0:yyyyMMdd}', pipeline.startTime), 100)]
{{< / highlight >}}

In this example seed is based on the date, this will generate a new sequence for each day. You can use **every variable you want as seed, there are [plenty of examples in official documentation](https://learn.microsoft.com/en-us/azure/devops/pipelines/build/variables?view=azure-devops&tabs=yaml).**

![Verify Counter expansion in build logs](../images/variables-counter-log.png)

***Figure 1***: *Verify Counter expansion in build logs*

As you can see in **Figure 1, you can verify from log how expansion of Counters is done** to verify that everything works as expected.

Gian Maria.