---
title: "Azure DevOps Pipeline template steps and NET Core 3 local tools"
description: ""
date: 2020-04-07T16:00:37+02:00
draft: false
tags: [Azure Pipelines]
categories: [Azure DevOps]
---
I’m a strong fan of Azure DevOps templates for pipelines because it is a really good feature to both simplify Pipeline authoring and avoid proliferation of too many way to do the same things.  **In some of my** [**previous examples**](http://www.codewrecks.com/blog/index.php/2020/03/29/azure-devops-pipeline-template-for-build-and-release-net-core-project/) **I’ve always used a template that contains full Multi Stage pipeline definition** , this allows you to create a new pipeline with easy, reference repository with the template, choose right template, set parameters and you are ready to go.

> Using a template file that contains all stages allows you to define in a single place an entire pipeline to reuse with simple parameters definition

 **Today my dear friend** [**Giulio Vian**](http://blog.casavian.eu/) **told me that he was investigating the use of a cool feature of.NET core 3.0, called** [**Local Tools**](https://andrewlock.net/new-in-net-core-3-local-tools/) **.** Basically with Local Tools you are able to create a special file called dotnet-tools.json that contains all the tools you need for your project. Since I’m an heavy fan of GitVersion, it seems to me standard to include in every project such file with the actual version of GitVersion used in my project. Here is an example of the file.

{{< highlight js "linenos=table,linenostart=1" >}}


{
  "version": 1,
  "isRoot": true,
  "tools": {
    "gitversion.tool": {
      "version": "5.2.4",
      "commands": [
        "dotnet-gitversion"
     ]
    }
  }
}

{{< / highlight >}}

 **Once you have this file in place, you can simply issue a dotnet tool restore command and all referenced tools will be automatically installed locally and ready to use.** This makes me extra simple to use GitVersion in my pipelines, because a simple dotnet tool restore will make GitVersion available on my pipeline (given that I’ve previously created a dotnet-tools.json in my project).

 **To experiment this new feature I want to give you another approach in using Azure DevOps templates, shared steps.** Lets have a look at this template file:

{{< highlight bash "linenos=table,linenostart=1" >}}


parameters:
  buildName: 'Specify name'
  dotNetCoreVersion: '2.2.301'

steps:
  - task: DotNetCoreInstaller@2
    displayName: 'Use.NET Core sdk ${{parameters.dotNetCoreVersion}}'
    inputs:
      version: ${{parameters.dotNetCoreVersion}}

  - task: DotNetCoreCLI@2
    displayName: 'install if needed dotnet gitversion tool'
    inputs:
      command: 'custom'
      custom: 'tool'
      arguments: 'restore'
  - script: |
      dotnet tool run dotnet-gitversion $(Build.Repository.LocalPath) /output buildserver
    name: Run_dotnet_gitversion

  - powershell: |
      Write-Host "##vso[build.updatebuildnumber]${{parameters.buildName}}-$env:GITVERSION_FULLSEMVER"

      $var = (gci env:*).GetEnumerator() | Sort-Object Name
      $out = ""
      Foreach ($v in $var) {$out = $out + "`t{0,-28} = {1,-28}`n" -f $v.Name, $v.Value}

      write-output "dump variables on $env:BUILD_ARTIFACTSTAGINGDIRECTORY\test.md"
      $fileName = "$env:BUILD_ARTIFACTSTAGINGDIRECTORY\test.md"
      set-content $fileName $out

      write-output "##vso[task.addattachment type=Distributedtask.Core.Summary;name=Environment Variables;]$fileName"
    name: Update_build_number

  - powershell: |
      echo "[task.setvariable variable=GITVERSION_ASSEMBLYSEMVER;isOutput=true]$(GITVERSION.ASSEMBLYSEMVER)"
      echo "[task.setvariable variable=GITVERSION_ASSEMBLYSEMFILEVER;isOutput=true]$(GITVERSION.ASSEMBLYSEMFILEVER)"
      echo "[task.setvariable variable=GITVERSION_SHA;isOutput=true]$(GITVERSION.SHA)"
      echo "[task.setvariable variable=GITVERSION_FULLSEMVER;isOutput=true]$(GITVERSION.FULLSEMVER)"
      echo "##vso[task.setvariable variable=GITVERSION_ASSEMBLYSEMVER;isOutput=true]$(GITVERSION.ASSEMBLYSEMVER)"
      echo "##vso[task.setvariable variable=GITVERSION_ASSEMBLYSEMFILEVER;isOutput=true]$(GITVERSION.ASSEMBLYSEMFILEVER)"
      echo "##vso[task.setvariable variable=GITVERSION_SHA;isOutput=true]$(GITVERSION.SHA)"
      echo "##vso[task.setvariable variable=GITVERSION_FULLSEMVER;isOutput=true]$(GITVERSION.FULLSEMVER)"
    name: 'SetGitVersionVariables'

{{< / highlight >}}

It is a quite long template but basically  **it begins with usual parameters section, followed by a series of steps, not an entire multi stage definition.** The sequence of steps are used to: runs dotnet tool restore, run GitVersion and finally does some PowerShell dumping of the variables. This kind of template was more similar to a Task Group because it is basically just a sequence of steps with parameters.

With this approach you are defining small pieces of an entire pipeline, allowing for a more granular reuse. This other template contains steps to build and run tests for a solution in.NET core.

{{< highlight bash "linenos=table,linenostart=1" >}}


parameters:
  dotNetCoreVersion: '3.1.201'
  buildConfiguration: release
  solution: ''
  continueOnTestErrors: true
  GitVersionFullSemVer: ''
  GitVersionAssemblyVer: ''
  GitVersionAssemblySemFileVer: ''
  SkipInstallDotNetCore: false

steps:

  - task: DotNetCoreInstaller@2
    displayName: 'Use.NET Core sdk ${{parameters.dotNetCoreVersion}}'
    inputs:
      version: ${{parameters.dotNetCoreVersion}}
    condition: ne(${{parameters.SkipInstallDotNetCore}}, 'true')

  - task: DotNetCoreCLI@2 
    displayName: 'dotnet restore'
    inputs:
      command: restore
      projects: '${{parameters.solution}}'
      feedsToUse: config
      nugetConfigPath: src/NuGet.Config

  - task: DotNetCoreCLI@2
    displayName: 'dotnet build'
    inputs:
      command: build
      projects: '${{parameters.solution}}'
      configuration: '${{parameters.buildConfiguration}}'
      arguments: /p:AssemblyVersion=${{parameters.GitVersionAssemblyVer}} /p:FileVersion=${{parameters.GitVersionAssemblySemFileVer}} /p:InformationalVersion=${{parameters.GitVersionAssemblyVer}}_$(Build.SourceVersion)

  - task: DotNetCoreCLI@2
    displayName: 'dotnet test'
    inputs:
      command: test
      nobuild: true
      projects: '${{parameters.solution}}'
      arguments: '--configuration ${{parameters.buildConfiguration}} --collect "Code coverage" --logger trx' 
    continueOnError: ${{parameters.continueOnTestErrors}}

{{< / highlight >}}

This steps declare as parameters some of semVer numbers extracted by GitVersion, so this sequence of steps are based on the fact that you should have run GitVersion in some preceding steps. Finally I’ve the last template that is used to publish with NuGet.

{{< highlight bash "linenos=table,linenostart=1" >}}


parameters:
  dotNetCoreVersion: '3.1.201'
  buildConfiguration: release
  nugetProject: ''
  GitVersionFullSemVer: ''
  GitVersionAssemblyVer: ''
  GitVersionAssemblySemFileVer: ''
  SkipInstallDotNetCore: false

steps:

  - task: DotNetCoreInstaller@2
    displayName: 'Use.NET Core sdk ${{parameters.dotNetCoreVersion}}'
    inputs:
      version: ${{parameters.dotNetCoreVersion}}
    condition: ne(${{parameters.SkipInstallDotNetCore}}, 'true')

  - task: DotNetCoreCLI@2
    displayName: NuGet Pack
    inputs:
      command: custom
      custom: pack
      projects: ${{parameters.nugetProject}}
      arguments: -o "$(Build.ArtifactStagingDirectory)\NuGet" -c ${{parameters.buildConfiguration}} /p:PackageVersion=${{parameters.GitVersionFullSemVer}} /p:AssemblyVersion=${{parameters.GitVersionAssemblyVer}} /p:FileVersion=${{parameters.GitVersionAssemblySemFileVer}} /p:InformationalVersion=${{parameters.GitVersionAssemblyVer}}_$(Build.SourceVersion)

  - task: NuGetCommand@2
    displayName: NuGet Push
    inputs:
      command: push
      packagesToPush: '$(Build.ArtifactStagingDirectory)\NuGet\*.nupkg'
      nuGetFeedType: internal
      publishVstsFeed: '95a01998-aa90-433c-8077-41da981289aa'
    continueOnError: true

{{< / highlight >}}

 **Now that I have these three distinct template files in a repository of my Azure DevOps account I can refer them to pipelines in another repository**.

Here is the real pipeline file of final project that is actually using all those three steps template defined in another repository.

{{< highlight bash "linenos=table,linenostart=1" >}}


trigger:
  branches:
    include:
      - master
      - develop
      - release/*
      - hotfix/*
      - feature/*

resources:
  repositories:
  - repository: templatesRepository
    type: git
    name: Jarvis/BuildScripts
    ref: refs/heads/develop

jobs:

- job: net_build_test

  pool:
    name: '$(Pool)'
    demands:
      - vstest
      - msbuild
      - visualstudio

  steps:
  - template: 'steps/GitVersionDotnetCoreLocal.yml@templatesRepository' # Template reference
    parameters:
      dotNetCoreVersion: '3.1.201'
      buildName: 'License Manager'
  - template: 'steps/BuildAndTestCore.yml@templatesRepository' # Template reference
    parameters:
      dotNetCoreVersion: '3.1.201'
      solution: 'src/LicenseManager.sln'
      SkipInstallDotNetCore: true
      GitVersionFullSemVer: '$(GITVERSION.FULLSEMVER)'
      GitVersionAssemblyVer: '$(GITVERSION.ASSEMBLYSEMVER)'
      GitVersionAssemblySemFileVer: '$(GITVERSION.ASSEMBLYSEMFILEVER)'

  - template: 'steps/PublishNuget.yml@templatesRepository' # Template reference
    parameters:
      dotNetCoreVersion: '3.1.201'
      nugetProject: 'src/LicenseManager.Client/LicenseManager.Client.csproj'
      GitVersionFullSemVer: '$(GITVERSION.FULLSEMVER)'
      GitVersionAssemblyVer: '$(GITVERSION.ASSEMBLYSEMVER)'
      GitVersionAssemblySemFileVer: '$(GITVERSION.ASSEMBLYSEMFILEVER)'
      SkipInstallDotNetCore: true


{{< / highlight >}}

 **As you can see, with steps template I decide on final build how many stage I need, in this example I’m perfectly confortable with a single stage.** The cool part of this approach is that I can mix standard steps and steps template files, giving me more flexibility in how the pipeline is constructed. Clearly this pipeline is more complex than one that use a full template file, because we need to pass parameter to every template. Running the pipeline gives you a standard run.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2020/04/image_thumb-8.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2020/04/image-8.png)

 ***Figure 1***: *Steps are expanded during execution.*

As you can verify from  **Figure 1** all steps templates are expanded in basic steps, allowing you to verify the output of every single step. Thanks to local tool feature I can simply run dotnet tool restore to have GitVersion automatically installed

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2020/04/image_thumb-9.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2020/04/image-9.png)

 ***Figure 2***: *Restoring tooling with dotnet tool restore automatically restore gitversion*

This will greatly simplify agent requirements, because all requirements are automatically restored by the pipeline.

Gian Maria.
