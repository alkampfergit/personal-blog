---
title: "Azure Pipelines starts failing indexing symbols"
description: " sudden failure occurred during the index symbol task of a build in Azure Devops. The error was vague, but some messages provided hints towards the underlying issue."
date: 2023-07-31T08:10:42+02:00
draft: false
categories: ["AzureDevOps"]
tags: ["Pipeline"]
---

A build in Azure Devops recently started to fail during the index symbol task. The error wasn't immediately clear. The error messages are really not informative, One such message was, "Request ed7b95f6b6f439e769a3e85422b7172be872403388fae1974fb4233dfd13da66 is sealed. Only expirationDate may be modified."

Honestly, this error didn't tell me much. **My general advice when facing such perplexing errors is to examine the entire log. Given the vast size of the log**, it's wise to start with the most common areas where useful information can be found. In the case of most .NET-related tools, I began by inspecting what appeared to be a stack trace. A stack trace in the log often indicates something has gone wrong.

![Error log of failing task](../images/isf_image_1.png)
***Figure 1:*** *Error log of failing task*

Looking closer at the stack trace, I noticed some useful information in the verbose log: "requests exists". 

![Check in the surrounding of stack traces, usually you find useful information](../images/isf_image_2.png)
***Figure 2:*** *Check in the surrounding of stack traces, usually you find useful information*

Following the stack trace, I encountered a **series of logs suggesting a name clash**. Messages like "request with given name already exists" and "operation failed: already exists" stood out. This led me to examine the task definition in the build, where I discovered that the SymbolsArtifactName parameter was not unique.

{{< highlight yaml "linenos=table,linenostart=1" >}}
- task: PublishSymbols@2
    displayName: "Index symbols in azure devops"
    inputs:
      SearchPattern: '**/bin/**/*.pdb'
      SymbolServerType: 'TeamServices'
      TreatNotIndexedAsWarning: true
      IndexSources: true
      PublishSymbols: true
      SymbolsArtifactName: 'Symbols_${{parameters.BuildConfiguration}}'
{{< / highlight >}}

The SymbolsArtifactName parameter's value comprises a prefix and a value that can be either 'debug' or 'release'. This is not unique. **I checked the Microsoft documentation to confirm that the task seemed to be correct.** The official documentation stated that the SymbolsArtifactName could indeed be set as a string with a prefix and build configuration.

![Official documentation about the PublishSymbol Task](../images/isf_image_3.png)
***Figure 3:*** *Official documentation about the PublishSymbol Task*

However, in my mind, this parameter was the only one that could potentially generate the error, especially since the error indicated that the name already existed. As such, **my first attempt at a solution was to remove this parameter, as it wasn't mandatory.** I could use the default one instead.

As soon as I removed the parameter from the pipeline definition, the build began working again.

![Removing SymbolsArtifactName fixes the build.](../images/isf_image_4.png)
***Figure 4:*** *Removing SymbolsArtifactName fixes the build.*

> If you're facing an odd failure, your best bet is to closely examine the error log and try to deduce the problem. 

In this case, **something in the task must have changed, as the build hadn't been modified for months and all previous builds were successful until two weeks ago**. I do not know if this is a bug in some task update, but now the build is green again.

Another useful technique to diagnose the error is **comparing task declaration with other builds that succeeds**. Honestly I have almost all build with indexing symbols, and this is the only one that sets that property. This is also a good indication of what is wrong.

Gian Maria.
