---
title: "Azure DevOps Pills: Cleanup on premise pipeline agents"
description: "If you need Pipeline agents that runs on premise, Disk Space could become a problem, let's see how to solve this problem."
date: 2024-12-02T08:00:42+02:00
draft: false
categories: ["AzureDevOps"]
tags: ["AzDo", "Pills"]
---

Managing pipeline/build agents is something that **you should avoid if possible, preferring [docker based agents](https://www.codewrecks.com/post/old/2019/12/azure-devops-agent-with-docker-compose/) or Microsoft hosted agents**. Sometimes this is not a viable options, especially if you have lots of integration tests, that runs on mongodb/elasticsearch/etc etc. While it **is quite simple to create a pipeline that uses docker to run these prerequisites** speed is sometimes a problem that makes this solution not so feasible. 

Azure DevOps has a cost for pipeline that is based on concurrent execution, so it is quite **important that pipelines run fast to use less license but, more important, to give a quick feedback to the team**. For this reason, we use physical machines, with quick NVMe Disks, RAM and Mongodb / Elastic / SQL installed on bare metal for maximum speed for integration tests.

> Speed of execution is a quite important characteristic for pipeline

The drawback of this approach is that we need time to create a new agent, even if we **start from a saved virtual machine** it is another machine that we need to manage. One of the problem we face is space of disks, because build after build, usually spaces accumulates. We identified a couple of source problems.

1. After a build finished we left all the product of the build in the build directory. 

So for each pipeline definition we have multiple instances of our software in build agent and we have Gigabytes of space used (mainly due to runtimes included by some libraries we are using). A possible solution of the problem is [automatically clean working folder with pipeline decorators](https://www.codewrecks.com/post/azdo/pills/pipeline-decorators-conditional/) to automatically clean working folder.

2. Working folder for agents becomes usually really big

Inside a build agent, working folder, called **_work** contains lots of data related to tasks and tool. One of the problem is that, over months, folders like **\_tool\dotnet\sdk** starts having lots of versions downloaded. This happens for a lots of tools/sdk/tasks etc.

![Lots of sdks for .NET installed in my build agents working folder](../images/tasks-in-build-agents.png)

***Figure 1***: *Lots of sdks for .NET installed in my build agents working folder*

Actually on a build agent that never had cleaning of the folder for a couple of years, we have 15 GB of _tools folder and 2GB of _tasks folder. If it seems **a small space, consider that we have multiple agents for each physical machines and you can understand that this problem is quite annoyng.**.

3. Nuget and npm packages continues to grow over the time

This is another problem, npm and nuget packages continue to grow, because we got new packages over time, so you will end with **multiple version of each pacakges in the cache folder, also some of the packages contains big binary files, so we have other GB of growing space**

> In the end in our physical build agents, disk space starts to become a problem.

We can simply buy bigger disk, but this is usually a wrong solution, the right approach **is simply scheduling operations to run on servers to cleanup folders**

The easiest solution is create **a simple pipeline that runs scheduled, once a week, and run for each agent cleaning nuget and npm caches**. The next build will be slower because it will need to download packages again, but saved space worth the price.

![Simple build to cleanup agents caches](../images/build-cleanup.png)

***Figure 2***: *Simple build to cleanup agents caches*

As you can see from **Figure 2** we created a simple pipeline based on standard editor (it is a really old pipeline :D) where we simply install right version of dotnet and node, and then use **dotnet and npm commands to cleanup caches**. This approach works perfectly because these pipeline will be executed **by the same agent that runs build, so we will run clean with the correct user**.

Thanks to pipeline Demands, it is easy to **create a demand on agent.name to be sure that it will be executed on a specific agent**. This gives me the ability to decide, for each agent, what to run to perform a complete cleanup (not all the agents are the same).

For _work and _tools folder we simply create a PowerShell script that will be scheduled once a month with windows scheduler.

{{< highlight powershell "linenos=table,linenostart=1" >}}
# List of folders to clear
$folders = @(
    "C:\A\_work\_tool",
    "C:\A\_work\_tasks"
)

# Define the service name
$serviceName = "vstsagent.xxx.BUILD2017"

# Stop the service
Stop-Service -Name $serviceName -Force
Write-Output "Service $serviceName stopped."


foreach ($folder in $folders) {
    if (Test-Path $folder) {
        # Delete all files and subfolders
        Get-ChildItem -Path $folder | Remove-Item -Force -Recurse
        Write-Output "Cleared folder: $folder"
    } else {
        Write-Output "Folder does not exist: $folder"
    }
}

# Start the service
Start-Service -Name $serviceName
Write-Output "Service $serviceName started."

{{< / highlight >}}

Thanks to the pipeline and the Scheduled tasks, we managed to reduce space in our build server and **stopped worrying to periodically login to the machine to do some cleanup**.

> Managing a pipeline agent require maintenance, so be ready to automate with cron/windows scheduled tasks and maintenance pipeline.

Gian Maria