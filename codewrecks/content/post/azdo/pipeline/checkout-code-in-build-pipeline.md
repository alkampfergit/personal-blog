---
title: "Azure DevOps: Checkout specific branch to avoid gitversion errors in pipeline"
description: "Exploring solutions to a NullReferenceException in Azure DevOps Pipelines when using GitVersion, focusing on proper branch checkout and credential persistence for smooth Git command execution."
date: 2023-11-16T00:00:00+00:00
draft: false
categories: ["AzureDevops"]
tags: ["AzDo"]
---

If you create a new Azure DevOps Pipeline and include running GitVersion, sometimes you may encounter an error like the following:

{{< highlight text "linenos=table,linenostart=1" >}}
INFO [11/15/23 19:00:57:95] Begin: Calculating base versions 
INFO [11/15/23 19:00:57:96] Begin: Attempting to inherit branch configuration from parent branch 
INFO [11/15/23 19:00:57:97] End: Attempting to inherit branch configuration from parent branch (Took: 3.55ms) 
INFO [11/15/23 19:00:57:97] End: Calculating base versions (Took: 12.03ms) 
ERROR [11/15/23 19:00:57:99] An unexpected error occurred: 
System.NullReferenceException: Object reference not set to an instance of an object. 
at LibGit2Sharp.Core.Handles.ObjectHandle.op_Implicit(ObjectHandle handle) in 
/_/LibGit2Sharp/Core/Handles/Objects.cs:line 509 
at LibGit2Sharp.Core.Proxy.git_commit_author(ObjectHandle obj) in /_/LibGit2Sharp/Core/Proxy.cs:line 289 
at LibGit2Sharp.Core.LazyGroup`1.Dependent`2.LibGit2Sharp.Core.LazyGroup<T>.IEvaluator<TInput>.Evaluate(TInput 
input) in /_/LibGit2Sharp/Core/LazyGroup.cs:line 88 
at LibGit2Sharp.Core.LazyGroup`1.<Evaluate>b__6_0(T input) in /_/LibGit2Sharp/Core/LazyGroup.cs:line 36 
at LibGit2Sharp.Core.GitObjectLazyGroup.EvaluateInternal(Action`1 evaluator) in 
/_/LibGit2Sharp/Core/GitObjectLazyGroup.cs:line 20 
at LibGit2Sharp.Core.LazyGroup`1.Evaluate() in /_/LibGit2Sharp/Core/LazyGroup.cs:line 34 
at LibGit2Sharp.Core.LazyGroup`1.Dependent`2.Evaluate() in /_/LibGit2Sharp/Core/LazyGroup.cs:line 80 
at LibGit2Sharp.Core.LazyGroup`1.Dependent`2.get_Value() in /_/LibGit2Sharp/Core/LazyGroup.cs:line 73 
at LibGit2Sharp.Commit.get_Committer() in /_/LibGit2Sharp/Commit.cs:line 87 
at GitVersion.Commit..ctor(Commit innerCommit) in 
D:\a\GitVersion\GitVersion\src\GitVersion.LibGit2Sharp\Git\Commit.cs:line 17 
at GitVersion.Commit.<>c.<.ctor>b__3_0(Commit parent) in 
D:\a\GitVersion\GitVersion\src\GitVersion.LibGit2Sharp\Git\Commit.cs:line 16 
at System.Linq.Enumerable.SelectEnumerableIterator`2.MoveNext() 
at System.Linq.Enumerable.Count[TSource](IEnumerable`1 source) 
{{< / highlight >}}

When executing get version within a local directory, the operation typically proceeds without issues. However, complications can arise during the Azure DevOps pipeline process.

This issue primarily stems from the pipeline's handling of source code downloads. Rather than checking out the current branch, the pipeline often directly checks out a specific commit in a detached head state. This approach is commonly adopted to reduce both build and checkout times.

{{< highlight text "linenos=table,linenostart=1" >}}
* [new ref] fe0b4ca5fc65e6ec3779b7ddabf9ca290028059b -> origin/fe0b4ca5fc65e6ec3779b7ddabf9ca290028059b 
git --config-env=http.extraheader=env_var_http.extraheader fetch --force --tags --prune --prune-tags --progress --no-recurse-submodules origin --depth=1 +fe0b4ca5fc65e6ec3779b7ddabf9ca290028059b 
remote: Azure Repos 
remote: 
remote: Found 0 objects to send. (15 ms) 
From https://xxxx.visualstudio.com/Jarvis/_git/Jarvis.AI 
* branch fe0b4ca5fc65e6ec3779b7ddabf9ca290028059b -> FETCH_HEAD 
git checkout --progress --force refs/remotes/origin/fe0b4ca5fc65e6ec3779b7ddabf9ca290028059b 
Note: switching to 'refs/remotes/origin/fe0b4ca5fc65e6ec3779b7ddabf9ca290028059b'. 
{{< / highlight >}}

The preceding code snippet displays the **result of executing the checkout command**. It reveals that the process does not switch to a particular branch, but instead checks out a specific commit. In cases where you require tools like GitVersion or others that **necessitate verifying the checkout of your original branch, you can adapt the pipeline as follows.**

{{< highlight yaml "linenos=table,linenostart=1" >}}
  - powershell: 'Remove-Item -Recurse -Force *'
    displayName: 'Manually clean directory'

  - checkout: self
    persistCredentials: true
    fetchTags: true
    fetchDepth: 1000
    clean: true
    displayName: 'Checkout code'
{{< / highlight >}}

I have implemented a PowerShell task prior to the checkout process, which involves **complete deletion of the entire directory**. This ensures that with each build execution, a **fresh source directory** is established. Additionally, I have enhanced the checkout step by introducing specific parameters, most notably the option to **persist credentials for tag fetching**. Depth of fetching is set to 1000 but it is not so important as you will see in a moment.

This configuration guarantees that every time the build is executed, all previous data is removed, followed by a fresh checkout. Moreover, it ensures the **persistence of credentials**, enabling the smooth execution of Git commands.

Subsequent to the checkout step, it's straightforward to add PowerShell code for **fetching all necessary data** and to **checkout the current branch**.

{{< highlight yaml "linenos=table,linenostart=1" >}}
  - powershell: |
      write-host "Fetching"
      git fetch
      Write-Host "source branch is $(Build.SourceBranch)"
      $branch = "$(Build.SourceBranch)"
      if ($branch.StartsWith("refs/heads/")) {
          $branch = $branch.Substring("refs/heads/".length)
      }
      Write-Host "Checking out branch $branch"
      git checkout $branch
    displayName: "Checkout current branch"
 {{< / highlight >}}

This approach guarantees that, during the build process, when **GitVersion** is executed, it identifies the correct SemVer version because it **find the correct branch checked out, all tags downloaded and all commits fetched**.

Gian Maria.

