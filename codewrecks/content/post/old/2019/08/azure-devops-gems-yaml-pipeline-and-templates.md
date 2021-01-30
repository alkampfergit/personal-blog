---
title: "Azure DevOps gems YAML Pipeline and Templates"
description: ""
date: 2019-08-18T05:00:37+02:00
draft: false
tags: [Azure Pipelines,build,Continuos Integration]
categories: [Azure DevOps]
---
If you read my blog you already know that I’m a great fan of YAML Pipeline instead of using Graphic editor in the Web UI, there are lots of reasons why you should use YAML; one for  **all the ability to branch Pipeline definition with code, but there is another really important feature:** [**templates**](https://docs.microsoft.com/en-us/azure/devops/pipelines/process/templates?view=azure-devops).

There is a really detailed documentation on [MSDN](https://docs.microsoft.com/en-us/azure/devops/pipelines/process/templates?view=azure-devops) on how to use this feature, but I want to give you a complete walkthrough on how to start to effectively use templates. **Thanks to templates you can create a standard build definition with steps or jobs and steps in a template file, then reference that file from real build, just adding parameters.** >  **The ability to capture a sequence of steps in a common template file and reuse it over and over again in real pipeline is probably one of the top reason for moving to YAML template.** One of the most common scenario for me is: account with lots of utilities projects (multitargeted for full framework and dotnetstandard), each one with its git repository and the need for a standard CI definition to:

1) Build the solution  
2) Run tests  
3) Pack a Nuget Package with semantic versioning  
4) Publish Nuget Package inside an Azure DevOps private package repository

If you work on big project you usually have lots of these small projects: Utilities for Castle, Serilog, Security, General etc. In this scenario it is really annoying to define a pipeline for each project with Graphical editor, so it is pretty natural moving to YAML.  **You can start from a standard file, copy it in the repository and then adapt for the specific project, but when a task is updated, you need to re-update all the project to update all the reference.** With this approach the main problem is: after some time the builds are not anymore in sync and each project start to behave differently.

I start defining my template once, in a dedicated repository, then I can reuse it in any project. When the template changes, I want to be able to manually update all pipelines to reference the new version or, even better, decide which project will be updated automatically.

 **Lets start with the real build file, that is included in the real repository and lets check how to reference a template stored** [**in another repository**](https://docs.microsoft.com/en-us/azure/devops/pipelines/process/templates?view=azure-devops#using-other-repositories) **.** The only limit is that the repository should be in the same organization or in GitHub. Here is full content of the file.

{{< highlight jscript "linenos=table,linenostart=1" >}}


trigger:
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
      ref: refs/heads/hotfix/0.1.1

jobs:

- template: 'NetStandardTestAndNuget.yaml@templatesRepository'
  parameters:
    buildName: 'JarvisAuthCi'
    solution: 'src/Jarvis.Auth.sln'
    nugetProject: 'src/Jarvis.Auth.Client/Jarvis.Auth.Client.csproj'
    nugetProjectDir: 'src/Jarvis.Auth.Client'

{{< / highlight >}}

The file is really simple, it starts with the triggers (as for a standard YAML build), then it comes a [resources](https://docs.microsoft.com/en-us/azure/devops/pipelines/process/resources?view=azure-devops) section, that allows you to references objects that lives outside the pipeline; in this specific example I’m declaring that this pipeline is using a resource called  **templateRepository,** an external git repository (in the same organization)  called BuildScripts and contained in Team Project called Jarvis;  **finally the ref property allows me to choose the branch or the tag to use with standard refs git syntax (refs/heads/master, refs/heads/develop, refs/tags/xxxx, etc).** In this specific example I’m freezing the version of the build script to the tag 0.1.0, if the repository will be upgraded this build will always reference version 0.1.0. This imply that, if I change BuildScripts repository, I need to manually update this build to reference newer version. If I want this definition to automatically use new versions  I can simply reference master or develop branch.

> The real advantage to have the template versioned in another repository is that it can use GitFlow so, every pipeline that uses the template, can choose to use specific version, or latest stable or even latest development.

 **Finally I start to define Jobs, but instead of defining them inside this YAML file I’m declaring that this pipeline will use a template called NetStandardTestAndNuget.yaml contained in the resource templatesRepository.** Following template reference I specify all the parameters needed by the template to run. In this specific example I have four parameters:

 **buildName** : *The name of the build, I use a custom Task based on gitversion that will rename each build using this parameter followed by semversion.* **solution** : *Path of solution file to build* **nugetProject** : *Path of the csproject that contains the package to be published* **nugetProjectDir** : *Directory of csproject to publish*

The last parameter could be determined by the third, but I want to keep YAML simple, so I require the user of the template to explicitly pass directory of the project that will be used as workingDirectory parameter for dotnet pack command.

 **Now the real fun starts, lets examine template file contained in the other repository.** Usually a template file starts with a parameters section where it declares the parameters it is expecting.

{{< highlight yaml "linenos=table,linenostart=1" >}}


parameters:
  buildName: 'Specify name'
  solution: ''
  buildPlatform: 'ANY CPU'
  buildConfiguration: 'Release'
  nugetProject: ''
  nugetProjectDir: ''
  dotNetCoreVersion: '2.2.301'

{{< / highlight >}}

As you can see the syntax is really simple,  **just specify name of the parameter followed by the default value.** In this example I really need four parameters, described in the previous part.

Following parameters section a template file can specify steps or event entire jobs, in this example I want to define two distinct jobs, one for build and run test and the other for nuget packaging and publishing

{{< highlight yaml "linenos=table,linenostart=1" >}}


jobs:

- job: 'Build_and_Test'
  pool:
    name: Default

  steps:
  - task: DotNetCoreInstaller@0
    displayName: 'Use.NET Core sdk ${{parameters.dotNetCoreVersion}}'
    inputs:
      version: ${{parameters.dotNetCoreVersion}}

{{< / highlight >}}

 **As you can see I’m simply writing a standard jobs section, that starts with the job Build\_and\_test that will be run on Default Pool.** The jobs starts with a DotNetCoreInstaller steps where you can see that to reference a parameter you need to use special syntax ${{parameters.parametername}}. The beautiful aspect of templates is that they are absolutely like a standard pipeline definition, just use ${{}} syntax to reference parameters.

Job Build\_and\_test prosecute with standard build test tasks and it determines (with gitversion) semantic version for the package. Since this value will be use in other jobs, I need to made it available with a specific PowerShell task.

{{< highlight bash "linenos=table,linenostart=1" >}}


  - powershell: echo "##vso[task.setvariable variable=NugetVersion;isOutput=true]$(NugetVersion)"
    name: 'SetNugetVersion'

{{< / highlight >}}

 **This task simply set variable $(NugetVersion) as variable NugetVersion but with isOutput=true to made it available to other jobs in the pipeline.** Now I can define the other job of the template to pack and publish nuget package.

{{< highlight bash "linenos=table,linenostart=1" >}}


- job: 'Pack_Nuget'
  dependsOn: 'Build_and_Test'

  pool:
    name: Default

  variables:
    NugetVersion: $[dependencies.Build_and_Test.outputs['SetNugetVersion.NugetVersion']]

{{< / highlight >}}

The only difference from previous job is the declaration of variable NugetVersion with a special syntax that allows to [reference it from a previous job](https://docs.microsoft.com/en-us/azure/devops/pipelines/process/variables?view=azure-devops&amp;tabs=yaml%2Cbatch#set-in-script). Now I simply trigger the build from the original project and everything run just fine.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2019/08/image_thumb.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2019/08/image.png)

 ***Figure 1***: *Standard build for library project, where I use the whole definition in a template file.*

 **As you can see, thanks to Templates, the real pipeline definition for my project is 23 lines long** and I can simply copy and paste to every utility repository, change 4 lines of codes (template parameters) and everything runs just fine.

> Using templates lower the barrier for Continuous integration, every member of the team can start a new Utility Project and just setup a standard pipeline even if he/she is not so expert.

Using templates brings a lots of advantage in the team, to add to standard advantages of using plain YAML syntax.

First: you can create standards for all pipeline definitions, instead of having a different pipeline structure for each project,  **templates allows you to define a set of standard pipeline and reuse for multiple projects.** Second: you have automatic updates: thanks to the ability to reference templates from other repository  **it is possible to just update the template and have all the pipelines that reference that template to automatically use new version (reference a branch).** You keep the ability to pin a specific version to use if needed (reference a tag or a specific commit).

Third: you lower the barrier for creating pipelines for all team members that does not have a good knowledge of Azure Pipelines, they can simply copy the build, change parameters and they are ready to go.

If you still have pipelines defined with graphical editor, it is the time to start upgrading to YAML syntax right now.

Happy Azure Devops.
