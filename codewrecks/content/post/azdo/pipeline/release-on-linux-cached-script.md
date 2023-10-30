---
title: "Azure DevOps: Script Caching in Azure DevOps"
description: "Addressing a caching issue in Azure DevOps where separate repository scripts aren't updating, leading to repeated pipeline errors on Linux machines."
date: 2023-10-30T8:00:42+00:00
draft: false
categories: ["AzureDevops"]
tags: ["AzDo", "Pipeline"]
---

I'm authoring a release pipeline in Azure DevOps on an AWS ARM linux machine, I've installed the agent and created the script. The pipeline uses artifacts produced by **another build pipeline and depends on a git repository that contains script**. Here is how resources are declared in the pipeline.

{{< highlight yaml "linenos=table,linenostart=1" >}}
resources: 

  pipelines:
  - pipeline: UniqueHost
    source: Publish-UniqueHost
    branch: master

  repositories:
    - repository: JarvisSetupScripts
      type: git
      ref: feature/AWS
      name: JarvisSetupScripts
{{< / highlight >}}

Usually the question is: **why you store scripts in another repository?**. The classic approach is writing release scripts inside the very same repository as source files, then include release script inside the build so **release pipeline depends only on one or more pipeline**. Personally having the script in a different repositories easy script authoring, because you can simply modify the script, push, and then immediately re-trigger the pipeline to verify that everything is working as expected.

> Having script in a different repository allows for a faster development cycle.

The downside of this approach is that the **script is not versioned with the source code**, but you can easily include the script in the original repository once the script is stable.

Despite the various reason I've encountered a strange problem when I author the script for the first time in a linux machine. The problem is simple: I run the pipeline and found an error **then I modify the script, push new version, run the pipeline and ... I have the very same error**. Looking at the logs it seems that the Git repository is not updated so the script uses the old version without the fix.

I do not know if this is a bug or something I've badly configured, but the net result is **that the release is still using the old version of my script and this is clearly visible from the log, where I verified that indeed the repository is pointing to an old commit**. A quick fix is including a script task before the checkout task that deletes the old script folder, so the checkout task is forced to download the latest version of the script. 

{{< highlight yaml "linenos=table,linenostart=1" >}}
- script: |
    rm -rf $(Pipeline.Workspace)/JarvisSetupScripts
  displayName: Deleting old script to avoid caching
  name: delete_old_scripts_prevent_caching

- checkout: JarvisSetupScripts
  fetchDepth: 1
  clean: true
  path: JarvisSetupScripts
{{< / highlight >}}

I know that this is not **a super clean approach**, but this fixes all the problem for me, because now, whenever the checkout action runs it starts from an empty folder so it will **download again everything, check out the folder, and always uses the latest version of the script**.

Gian Maria.