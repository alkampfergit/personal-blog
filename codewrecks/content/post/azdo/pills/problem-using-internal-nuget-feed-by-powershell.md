---
title: "Pills: What to do when dotnet restore failed with 401 against an internal feed"
description: "Sometimes you powershell or bash code does not work restoring packages from an internal feed because of 401 error. Let's examine how can you solve this"
date: 2024-02-23T08:10:42+02:00
draft: false
categories: ["AzureDevOps"]
tags: ["Pills", "Pipelines"]
---

This is an argument I've already discussed in the past in [A post about nuget authentication](https://www.codewrecks.com/post/azdo/pipeline/nuget-feed-authenticate/). From a couple of days, in a project I'm working into the service started to return 401 even with the technique described in the aforementioned post.

The sympthom is this error in the script that executed `dotnet restore` command.

```plaintext
   Unable to load the service index for source https://pkgs.dev.azure.com/organizaion/_packaging/FeedName@Local/nuget/v3/index.json.
  Response status code does not indicate success: 401
```

In such a situation here is what you need to do to try to solve the problem.

## Add a nuget authenticate task

I know that the pipeline should authenticate automatically to download **artifacts that are stored in the same organization**, but sometimes it does not work. So you can add this task to the build definition
    
```yaml
    - task: NuGetAuthenticate@1
        inputs:
        nuGetServiceConnections: 'NugetInterno'
        forceReinstallCredentialProvider: true
```

As you can see I simply specify the service connection name **as described in my previous post**. This is important because after this modification if you run the pipeline again you should double check the user that got authenticated. You will see an output like this

```plaintext
Setting up the credential provider to use the identity 'Project Collection Build Service (orgname)' for feeds in your organization/collection starting with:
  https://pkgs.dev.azure.com/orgname/
  https://orgname.pkgs.visualstudio.com/
```

## Explicitly add the user to the feed

This gives you the name of the user used to run the pipeline, in this situation is `Project Collection Build Service (orgname)`. Now you should go to the **permission section of your feed and explicitly put that account as collaborator.

![Explicitly adding the pipeline user to the feed](../images/collab-agent.png)

***Figure 2:*** *Explicitly adding the pipeline user to the feed*

This usually solves any problem, but in my situation I still got the problem, so you can try another technique.

## Explicitly restore packages with dotnet task

Even if you have a PowerShell script that perform the whole build, **you can add explicit restore with the appropriate task** because usually it will work better with authentication (do not know why).

```yaml
    - task: DotNetCoreCLI@2
        inputs:
        command: 'restore'
        projects: 'src/my-solution-name.sln'
        feedsToUse: 'config'
        nugetConfigPath: 'src/nuget.config'
```

In my situation restore **performed with the official task works as expected** so when my script issue a dotnet restore it found that every was restored and it did not fail anymore.

If you use the trick I described in the post cited at the beginning of this post, please double check that the PAT you inserted is not expired in the service connection configuration pane. **If you are in doubt, just create a new PAT and use it in the service connection**.

Gian Maria.