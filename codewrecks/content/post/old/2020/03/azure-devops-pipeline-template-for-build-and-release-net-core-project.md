---
title: "Azure DevOps pipeline template for build and release NET core project"
description: ""
date: 2020-03-29T09:00:37+02:00
draft: false
tags: [Azure DevOps,GitHub]
categories: [Azure DevOps,GitHub]
---
Some days ago I’ve blogged on how to release projects on GitHub with actions, now it is time to understand  **how to do a similar thing in Azure DevOps to build / test / publish a.NET core library with nuget**. The purpose is to create a generic template that can be reused on every general that needs to build an utility dll, run test and publish to a Nuget feed.

> The ability to create template pipeline in Azure DevOps is a great opportunity to define a standard way to build / test /  deploy projects in your organization

Everything starts with a **dedicated repository where I store a single build template file to create a MultiStage pipeline,** where the first stage is a.NET core build test, and the second stage is publishing with nuget. Such simple build could be done with a single stage, but creating it with MultiStage gives me the opportunity to explain some interesting aspect of Azure DevOps pipelines.

Everything starts with parameters declaration.

{{< highlight yaml "linenos=table,linenostart=1" >}}


parameters:
  buildName: 'Specify name'
  solution: ''
  buildPlatform: 'ANY CPU'
  buildConfiguration: 'Release'
  nugetProject: ''
  nugetProjectDir: ''
  dotNetCoreVersion: '2.2.301'
  pool: 'Default'
  nugetPublish: true

{{< / highlight >}}

 **Every single parameter can have a default option, and can be overridden** , after parameter first stage starts, build and test.NET core project.

{{< highlight yaml "linenos=table,linenostart=1" >}}


jobs:

- job: 'Build_and_Test'
  pool:
    name: ${{parameters.pool}}

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
      arguments: 'update GitVersion.Tool --tool-path $(Agent.ToolsDirectory)/gitversion/5.1.3 --version 5.1.3'
  - script: |
      $(Agent.ToolsDirectory)/gitversion/5.1.3/dotnet-gitversion $(Build.Repository.LocalPath) /output buildserver

  - powershell: |
      Write-Host "##vso[build.updatebuildnumber]${{parameters.buildName}}-$env:GITVERSION_FULLSEMVER"

      $var = (gci env:*).GetEnumerator() | Sort-Object Name
      $out = ""
      Foreach ($v in $var) {$out = $out + "`t{0,-28} = {1,-28}`n" -f $v.Name, $v.Value}

      write-output "dump variables on $env:BUILD_ARTIFACTSTAGINGDIRECTORY\test.md"
      $fileName = "$env:BUILD_ARTIFACTSTAGINGDIRECTORY\test.md"
      set-content $fileName $out

      write-output "##vso[task.addattachment type=Distributedtask.Core.Summary;name=Environment Variables;]$fileName"

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
      configuration: '$(BuildConfiguration)'
      arguments: /p:AssemblyVersion=$(GITVERSION.ASSEMBLYSEMVER) /p:FileVersion=$(GITVERSION.ASSEMBLYSEMFILEVER) /p:InformationalVersion=$(GITVERSION.SHA)

  - task: DotNetCoreCLI@2
    displayName: 'dotnet test'
    inputs:
      command: test
      nobuild: true
      projects: '${{parameters.solution}}'
    continueOnError: true

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

You can recognize in this script many of the techniques already discussed [in previous GitHub Action post](http://www.codewrecks.com/blog/index.php/2020/03/22/github-actions-plus-gitversion/), it is just declined for Azure DevOps. The main difference is that  **Actions are directed toward a simple way to execute a “script” composed by a series of commandline istruction and tasks while Pipelines are more structured to create a workflow** , but everything is really similar.

Since this pipeline will run on Windows, I can simply use PowerShell task to execute inline script. The most peculiar part of the script is the last PowerShell script, that contains a series of Pipeline commands echoing ##vso in the output stream.  **The purpose of that step is to save some variable values to reuse in subsequent stages.** This is a killer feature, in this example I runs GitVersion on first stage only, then pass all the output to be reused by subsequent Stages.

> The ability to pass variable values between stages opens a wide range of opportunities, where you can run special tools on special agents, then reuse output in all other stages.

This is really handy if you need to execute subsequent stages, in different operating system / environment and you want to simply reuse some variable values that was calculate in some previous stage.  **Suppose you have a tool that runs only on windows, you can run in a stage, then reuse output in subsequent stages that runs in linux.** Publish stage is really simple, the only really interesting part is the declaration.

{{< highlight csharp "linenos=table,linenostart=1" >}}


- job: 'Pack_Nuget'
  dependsOn: 'Build_and_Test'
  condition: eq(${{parameters.nugetPublish}}, true)

  pool:
    name: ${{parameters.pool}}

  variables:
    GITVERSION_ASSEMBLYSEMVER: $[dependencies.Build_and_Test.outputs['SetGitVersionVariables.GITVERSION_ASSEMBLYSEMVER']]
    GITVERSION_ASSEMBLYSEMFILEVER: $[dependencies.Build_and_Test.outputs['SetGitVersionVariables.GITVERSION_ASSEMBLYSEMFILEVER']]
    GITVERSION_SHA: $[dependencies.Build_and_Test.outputs['SetGitVersionVariables.GITVERSION_SHA']]
    GITVERSION_FULLSEMVER: $[dependencies.Build_and_Test.outputs['SetGitVersionVariables.GITVERSION_FULLSEMVER']]

{{< / highlight >}}

 **The stage starts with a name and a dependency declaration on previous Build\_and\_test stage, this implies that this stage can run only if the previous stage run successfully.** The execution is also dependent on a parameter called nugetPublish, that should be true for this stage to execute. This allows the pipeline that uses this template to choose if publish stage should run.

> The ability to conditionally execute stages allows for complex workflow execution, where each stage can decide on following stages execution.

Following the declaration we can find a variables section, where I actually load variable from previous stage in this stage.  **In this specific example I’m retrieving all GitVersion output value that I need to build NugetPackage.** The stage ends with standard pack and publish of NugetPackage, using SemVer numbers that were passsed from previous stage.

{{< highlight yaml "linenos=table,linenostart=1" >}}


steps:

  - task: DotNetCoreInstaller@2
    displayName: 'Use.NET Core sdk ${{parameters.dotNetCoreVersion}}'
    inputs:
      version: ${{parameters.dotNetCoreVersion}}

  - powershell: |
      echo "GITVERSION_ASSEMBLYSEMVER $(GITVERSION_ASSEMBLYSEMVER)"
      echo "GITVERSION_ASSEMBLYSEMFILEVER $(GITVERSION_ASSEMBLYSEMFILEVER)"
      echo "GITVERSION_SHA $(GITVERSION_SHA)"
      echo "GITVERSION_FULLSEMVER $(GITVERSION_FULLSEMVER)"
    name: 'Dumpvariables'

  - task: DotNetCoreCLI@2
    displayName: NuGet Pack
    inputs:
      command: custom
      custom: pack
      projects: ${{parameters.nugetProject}}
      arguments: -o "$(Build.ArtifactStagingDirectory)\NuGet" -c ${{parameters.BuildConfiguration}} /p:PackageVersion=$(GITVERSION_FULLSEMVER) /p:AssemblyVersion=$(GITVERSION_ASSEMBLYSEMVER) /p:FileVersion=$(GITVERSION_ASSEMBLYSEMFILEVER) /p:InformationalVersion=$(GITVERSION_SHA)

  - task: NuGetCommand@2
    displayName: NuGet Push
    inputs:
      command: push
      packagesToPush: '$(Build.ArtifactStagingDirectory)\NuGet\*.nupkg'
      nuGetFeedType: internal
      publishVstsFeed: '95a01998-aa90-433c-8077-41da981289aa'
    continueOnError: true

{{< / highlight >}}

 **Once this template file is checked in in AzureDevOps repository, you can refer it from another project in the same Organization**. This is the real power of templates, I wrote the definition one time in a dedicated repository and every other project that needs to declare a pipeline to build / test / publish can simply refers to this template. With a few lines of YAML you can create a pipeline for your new project.

{{< highlight yaml "linenos=table,linenostart=1" >}}


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

- template: 'NetStandardTestAndNuget.yaml@templatesRepository'
  parameters:
    buildName: 'LicenseManager'
    solution: 'src/LicenseManager.sln'
    pool: '$(pool)'
    dotNetCoreVersion: '3.1.100'
    nugetPublish: true
    nugetProject: 'src/LicenseManager.Core/LicenseManager.Core.csproj'

{{< / highlight >}}

Look at how simple it is,  **just define triggers, add repository that contains the build script in the resources section, and simple populate the parameters, and, BAM, your project has a pipeline for build / test / publish.** The ref parameter of reference section allows  **you to choose which branch use to grab script template** , in this project I want the latest trunk version, so I’ve choose develop, other project can stay on master to have a better stable version.

The template once uses an old version of task of mine to perform GitVersion, that is become really obsolete and it is not useful to maintain anymore. I’ve decided to upgrade the template to use dotnet-gitversion command line tool, I’ve upgraded the template in a feature branch, using a project as test, then I’ve merged in develop and  **when I’ll finally close it on master, every project that uses this template, will use the new definition, without any user intervention.** >  **Thanks to template I can upgrade the template in dedicated branch, test with actual project, then promote the upgrade through standard develop, release and master branch to automatically upgrade pipeline of all projects that uses this template.**  **How cool is that.** It is actually superfluous telling you how important  is to have an automatic build / test pipeline, **as an example it seems that yesterday night I’ve broke the test ![Smile](http://www.codewrecks.com/blog/wp-content/uploads/2020/03/wlEmoticon-smile.png), shame on me**.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2020/03/image_thumb-25.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2020/03/image-25.png)

 ***Figure 1***: *Build results showing me that some test fails*

 **The nice aspect of Azure DevOps pipeline is that they have a dedicated section to examine test failures,** that gives me immediate insight on what went wrong. It seems that I’ve messed something in exception handling.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2020/03/image_thumb-26.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2020/03/image-26.png)

 ***Figure 2***: *Dedicated pane to view test result.*

Actually Azure DevOps pipelines are more complex than GitHub actions, but they can also solve more complex problems and are (at date of today) probably better suited for an enterprise, especially with the ability to define template to make a standard in how to build projects of the company. Another key value is the ability to immediately explore failed tests and code coverage for your build, not to mention multi stage pipeline to create complex build / release workflows.

> Actually we have a superposition between Azure DevOps and GitHub pipelines, both of them now owned by Microsoft. My advice is just look at what are the capabilities as today and choose what better suites you.

 **Remember also that you can easily use Azure DevOps pipeline to build a GitHub project, just point the build to a GitHub repository after you connected your GitHub organization  / account to Azure DevOps.** The only limitation is that build template file should still reside on AzureDevOps account (a limitation that probably will expire soon).

> Remember that you can freely use Azure DevOps pipeline to build GitHub projects without any problem, just choose the product that better suites your need.

Gian Maria.
