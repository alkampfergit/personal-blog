---
title: "Pill: Problems in Azure DevOps Pipelines due to Shallow Fetch"
description: "Understanding the shallow fetch method in Azure DevOps pipelines to troubleshoot problems using tools that rely on git history to work"
date: 2025-02-02T06:00:00+02:00
draft: false
categories: ["AzureDevOps"]
tags: ["Pipelines", "Git", "Optimization"]
---

In Azure DevOps, pipelines are a fundamental component for automating the build and release process. One of the key optimizations in these pipelines is the use of **shallow fetch when cloning repositories**. Unlike a full clone, which downloads the entire history of the repository, a **shallow fetch retrieves only the specific commit needed for the build**. This is a really welcomed feature, because repositories can contain years of history, or they can have **some big file committed by error in some older commit**.

By fetching only the required commit, the pipeline can start the build process much faster, leading to more efficient CI/CD workflows.

> Shallow fetch is a commonly used technique in CI/CD where you usually want to execute some build script on a specific commit of your repository.

### Look at Azure DevOps pipeline code for details

Here is part of the checkout phase of a pipeline where you can see that the pipeline is not doing a regular clone.

```text
it remote add origin https://xxxxx.visualstudio.com/Jarvis/_git/xxxxxx
git config gc.auto 0
git config core.longpaths true
git config --get-all http.extraheader
git config --get-regexp .*extraheader
git config --get-all http.proxy
git config http.version HTTP/1.1
git --config-env=http.extraheader=env_var_http.extraheader fetch --force --tags --prune --prune-tags --progress --no-recurse-submodules origin --depth=1  +fca96acbd08bb101d534c8f1a7c60cfcb4c2bc0d:refs/remotes/origin/fca96acbd08bb101d534c8f1a7c60cfcb4c2bc0d
remote: Azure Repos        
remote: 
remote: Found 68 objects to send. (25 ms)        
From https://xxx.visualstudio.com/Jarvis/_git/xxxxxx
 * [new ref]         fca96acbd08bb101d534c8f1a7c60cfcb4c2bc0d -> origin/fca96acbd08bb101d534c8f1a7c60cfcb4c2bc0d
git --config-env=http.extraheader=env_var_http.extraheader fetch --force --tags --prune --prune-tags --progress --no-recurse-submodules origin --depth=1  +fca96acbd08bb101d534c8f1a7c60cfcb4c2bc0d
remote: Azure Repos        
remote: 
remote: Found 0 objects to send. (0 ms)        
From https://xxx.visualstudio.com/Jarvis/_git/xxxxx
 * branch            fca96acbd08bb101d534c8f1a7c60cfcb4c2bc0d -> FETCH_HEAD
git checkout --progress --force refs/remotes/origin/fca96acbd08bb101d534c8f1a7c60cfcb4c2bc0d
Note: switching to 'refs/remotes/origin/fca96acbd08bb101d534c8f1a7c60cfcb4c2bc0d'.
```

As you can see actually the checkout phase is **simply downloading the commit that it needs to build, leaving all the history out of the process**. 

### Problems with Shallow Fetch

While shallow fetch offers significant benefits, it can cause issues with tools that rely on the full git history to function correctly. One such tool is **GitVersion**, which calculates version numbers based on the commit history. I extensively use GitVersion to create unique build numbers, and to generate unique **Nuget package names for each build** but each time that I create a new build it fails with this error.

```
INFO [01/30/25 15:14:45:65] Cache file C:\A\_work\4060\s\.git\gitversion_cache\4DCF7F401E13878A2D9F7B870EE718E9327524DC.yml not found.
INFO [01/30/25 15:14:45:65] End: Loading version variables from disk cache (Took: 1.
....
INFO [01/30/25 15:14:45:81] Begin: Getting branches containing the commit 'fca96acbd08bb101d534c8f1a7c60cfcb4c2bc0d'.
INFO [01/30/25 15:14:45:81] Trying to find direct branches.
INFO [01/30/25 15:14:45:81] No direct branches found, searching through all branches.
INFO [01/30/25 15:14:45:81] End: Getting branches containing the commit 

...
'fca96acbd08bb101d534c8f1a7c60cfcb4c2bc0d'. (Took: 0.09ms)
INFO [01/30/25 15:14:45:81] Found possible parent branches: 
INFO [01/30/25 15:14:45:82] End: Attempting to inherit branch configuration from parent branch (Took: 22.42ms)
ERROR [01/30/25 15:14:45:88] An unexpected error occurred:
System.InvalidOperationException: Could not find a 'develop' or 'master' branch, neither locally nor remotely.

...

```

The error is clear: **Could not find a 'develop' or 'master' branch, neither locally nor remotely.**

Luckily enough the fix is simple, in the YAML pipeline you can add (if not already present) an explicit checkout step as the first step of the pipeline, then set `fetchDepth` parameter to `0` to instruct the checkout phase **to clone the entire repository**.

```yaml
trigger:
- main

pool:
  vmImage: 'ubuntu-latest'

steps:
- checkout: self
  fetchDepth: 0
```

In this example, the `fetchDepth: 0` parameter instructs the pipeline to perform a full fetch, retrieving the entire commit history from the `main` branch.

Now lets look at the log of the checkout phase

```text
remote: Azure Repos        
remote: 
remote: Found 32 objects to send. (2 ms)        
From https://xxxx.visualstudio.com/Jarvis/_git/xxxxx
 - [deleted]         (none)     -> origin/feature/build
   9f94869..7631164  develop    -> origin/develop
   5c19e96..d783c1d  main       -> origin/main
git --config-env=http.extraheader=env_var_http.extraheader fetch --force --tags --prune --prune-tags --progress --no-recurse-submodules origin   +76311645eab59f76706e013415772cac65297cb3
From https://xxxxx.visualstudio.com/Jarvis/_git/xxxxx
 * branch            76311645eab59f76706e013415772cac65297cb3 -> FETCH_HEAD
git checkout --progress --force 76311645eab59f76706e013415772cac65297cb3
Note: switching to '76311645eab59f76706e013415772cac65297cb3'.

```

You can see that this time **the checkout phase correctly identify all the branches that are in the repository, actually downloading everything from the server**. This time Gitversion tool is able to determine the version and does not throws an error.

> When you perform CI/CD operations on Azure DevOps always keep in mind that by default shallow fetch is performed.

Happy Azure DevOps.

Gian Maria.
