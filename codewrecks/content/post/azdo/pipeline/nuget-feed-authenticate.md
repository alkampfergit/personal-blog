---
title: "Authenticate to Azure DevOps private Nuget Feed"
description: "Azure DevOps artifacts are great for hosting your packages, but you can incur in authentication problem in piplines"
date: 2020-12-29T10:00:00+02:00
draft: false
categories: ["AzureDevops"]
tags: ["AzDo", "Pipeline"]
---

When you build a project that depends on Azure DevOps hosted nuget feed, usually if the feed **is on the same organization of the pipeline and you are using Nuget task, everything regarding authentication happens automatically**. A really different situation arise if you are using Nuget directly from Command Line or PowerShell script. A typical situation is: everything seems to work perfectly in your machine but during pipeline run you receive 401 (unauthenticated) error or the build hangs with a message like this:

{{< highlight text "linenos=table,linenostart=1" >}}
  OK https://api.nuget.org/v3-flatcontainer/system.reflection.emit.lightweight/4.3.0/system.reflection.emit.lightweight.4.3.0.nupkg 4ms
    [CredentialProvider]Using the ADAL UI  flow for uri https://pkgs.dev.azure.com/xxxxx/_packaging/xxxxx@Local/nuget/v3/index.json. User sign-in required in a pop-up authentication window.
    [CredentialProvider]Using the ADAL UI  flow for uri https://pkgs.dev.azure.com/xxxxx/_packaging/xxxxx@Local/nuget/v3/index.json. User sign-in required in a pop-up authentication window.
{{< / highlight >}}

This happens because the feed is authenticated, nuget.exe is trying to open the typical popup window to allow for login, but **since the build is running without a user interface, the whole process hang.**. 

> Remember that this problem does not happen if you use standard NuGet task, but happens usually when you manual call NugetExe in PowerShell or other scripts.

This is annoying and happens with every nuget feed **that needs authentication** but the solution is really simple because you have a special task **that helps authenticating to Feed in the same organization or in different organization or in any other NuGet server that requires login.** Task is called NuGetAuthenticate@0 and if the feed is on the very same organization you can simply add as shown in following snippet of a YAML pipeline.

{{< highlight yaml "linenos=table,hl_lines=9,linenostart=1" >}}
steps:

  - task: UseDotNet@2
    displayName: 'Use .NET Core sdk 3.1.201'
    inputs:
      version: 3.1.201
      performMultiLevelLookup: true

  - task: NuGetAuthenticate@0

  - task: PowerShell@2
    displayName: 'Full Powershell Build'
    inputs:
      targetType: filePath
      workingDirectory: $(Build.SourcesDirectory)
      filePath: "$(Build.SourcesDirectory)/Build.ps1"
      arguments: -skipPackageInstallation $false
{{< / highlight >}}

As you can see in line 9 I simply added a NuGetAuthenticate task that does all the dirty work for me. Once I've added it subsequent **commandline nuget.exe commands work like a charm without any hiccup**.

![Nuget Restore correctly restored everything without any problem](../images/nuget-restore-auth-success.png)

***Figure 1:*** *Nuget Restore correctly restored everything without any problem*

The aforementioned NugetAuthenticate task can be used as is if you need to **authenticate to feeds that belong to the very same organization**. A different scenario happens when you want to use nuget against an authenticated feed that resides somewhere else (different organization, MyGet or other provider).

In such a situation you need to proceed in a different route, first of all you need to go **on Team Project settings to add a Service Connection that points to nuget feed**.

![Go to Team Project settings to add a Service Connection](../images/service-connection-to-nuget-feed.png)

***Figure 2***: *Go to Team Project settings to add a Service Connection*

Now you should select Nuget Connection type:

![Choose Nuget as Service Connection Type](../images/service-connection-nuget-type.png)

***Figure 3***: *Choose Nuget as Service Connection Type*

At this point you must specify all the information to connect to the feed you need, you **should add the same NuGet feed address contained in nuget.config, give it a name and specify an access token**. A special consideration should be done to the last parameter in **Figure 4** used to decide if this service connection can be used by any pipeline. If you left checked, every pipeline can authenticate to the feed, if you need **to control which pipeline can access the feed you can remove the check**.

![Specify all data to connect to external feed in Service Connection page](../images/nuget-connection-feed-specifications.png)

***Figure 4***: *Specify all data to connect to external feed in Service Connection page*

As a final step you must change YAML build to specify name of the Service Connection in authenticate task; to maximize flexibility, better specify the name as a parameter. 

{{< highlight yaml "linenos=table,hl_lines=9-11,linenostart=1" >}}
parameters: 
  
  - name: externalFeed
    default: ProximoFeed
    type: string

steps:

  - task: NuGetAuthenticate@0
    inputs:
     nuGetServiceConnections: ${{ parameters.externalFeed }}
{{< / highlight >}}

Now you can specify name of the feed at queue time; it comes in hand if you build the repository on more than one organization. **Now you can schedule the build and everything should work as expected**.

If you unchecked the *Grant access permission to all pipelines*, the first time you schedule a build that tries to authenticate to the feed, **job execution stops asking for authentication.**

![Pipeline need to be authorized to access specified Feed](../images/service-connection-ask-for-permission.png)

***Figure 5***: *Pipeline need to be authorized to access specified Feed*

If the Service Connection contains data you do not want everyone to access, **you can control which pipeline can access the service** and this is the reason not giving access to Service Connection to all pipeline. Giving permission is really simple, you can simply press View Button (**Figure 5**) and if you have enough permission on Service Connection, you can grant permission to the pipeline.

![Give permission to Service Connection to chosen pipeline](../images/give-permission-to-pipeline.png)

***Figure 6***: *Give permission to Service Connection to chosen pipeline*

Once the pipeline gets permission job resumes and everything should work perfectly. If you still encounter problems like having 401 response from the feed, please **check the output of authentication task**. 

{{< highlight commandline "linenos=table,hl_lines=9-11,linenostart=1" >}}
Setting up the credential provider to use the identity 'Proximo Build Service (gianmariaricci)' for feeds in your organization/collection starting with:
  https://pkgs.dev.azure.com/gianmariaricci/
  https://gianmariaricci.pkgs.visualstudio.com/

Setting up the credential provider for these service connections:
  https://pkgs.dev.azure.com/otherorganization/_packaging/xxxxx@Local/nuget/v3/index.json
{{< / highlight >}}

In the output of the task you can view ALL feeds that were authenticated, it is imperative that the list **contains all the feeds specified in nuget.config as they are typed in the config file**; even if there is one different character authentication does not work. As an example a typical error is not having @local after the name of the package.

Happy Nuget and Azure DevOps.

Gian Maria.
