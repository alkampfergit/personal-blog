---
title: "Azure DevOps pipelines and Sonar Cloud gives free analysis to your OS project"
description: ""
date: 2018-10-10T21:00:37+02:00
draft: false
tags: [AzureDevOps,build]
categories: [Azure DevOps]
---
In previous post I’ve shown how [easy is to create a YAML definition](http://www.codewrecks.com/blog/index.php/2018/10/09/code-in-github-build-in-azure-devops-and-for-free/) to create a build definition to build your GitHub Open Source project in Azure DevOps, without the need to spend any money nor installing anything on you server.

Once you create a default build that compile and run tests, it would be super nice to create a free account in SonarCloud to have your project code to be analyzed automatically from the Azure Pipeline you’ve just created. I’ve [already blogged on how to setup SonarCloud analysis for OS project with VSTS build](http://www.codewrecks.com/blog/index.php/2018/03/25/run-sonarcloud-analysis-in-vsts-tfs-build/) and the very same technique can be used in YAML build.

> Once you have free YAML Azure DevOps pipeline, it makes sense to enable analysis with SonarCloud

First of all you need to register to SonarCloud, create a project, setup key and create a token to access the account.  **Once everything is in place you can simply modify YAML build to perform the analysis.** [![image](http://www.codewrecks.com/blog/wp-content/uploads/2018/10/image_thumb-13.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2018/10/image-13.png)

 ***Figure 1***: *Task to start sonar cloud analysis.*

The above task definition can be obtained simply creating a build with standard graphical editor, then press the YAML build to have the  UI generate the YAML for the task.

> Actually YAML build does not have an editor, but it is super easy to just create a fake build with standard editor, drop a task into the definition, populate properties then let the UI to generate YAML that can be copied into the definition.

 **Once the analysis task is in place, you can simply place the “Run code analysis task” after build and test tasks.** The full code of the build is the following.

{{< highlight bash "linenos=table,linenostart=1" >}}


#.NET Desktop
# Build and run tests for.NET Desktop or Windows classic desktop solutions.
# Add steps that publish symbols, save build artifacts, and more:
# https://docs.microsoft.com/azure/devops/pipelines/apps/windows/dot-net

pool:
  vmImage: 'VS2017-Win2016'

trigger:
- master
- develop
- release/*
- hotfix/*
- feature/*

variables:
  solution: 'migration/MigrationPlayground.sln'
  buildPlatform: 'Any CPU'
  buildConfiguration: 'Release'

steps:

- task: GitVersion@1
  displayName: GitVersion 
  inputs:
    BuildNamePrefix: 'MigrationCI'

- task: SonarSource.sonarqube.15B84CA1-B62F-4A2A-A403-89B77A063157.SonarQubePrepare@4
  displayName: 'Prepare analysis on SonarQube'
  inputs:
    SonarQube: 'SonarCloud'
    projectKey: xxxxxxxxxxxxxxxxxxx
    projectName: MigrationPlayground
    projectVersion: '$(AssemblyVersion)'
    extraProperties: |
     sonar.organization=alkampfergit-github
     sonar.branch.name=$(Build.SourceBranchName)

- task: NuGetToolInstaller@0

- task: NuGetCommand@2
  inputs:
    restoreSolution: '$(solution)'

- task: VSBuild@1
  inputs:
    solution: '$(solution)'
    platform: '$(buildPlatform)'
    configuration: '$(buildConfiguration)'

- task: VSTest@2
  inputs:
    platform: '$(buildPlatform)'
    configuration: '$(buildConfiguration)'

- task: SonarSource.sonarqube.6D01813A-9589-4B15-8491-8164AEB38055.SonarQubeAnalyze@4
  displayName: 'Run Code Analysis'

{{< / highlight >}}

Once you changed the build just push the code and let the build run, you should check if the build completes without error, then verify if analysis is present in SonarCloud dashboard.

A couple of suggestion are useful at this point: first of all you can encounter problem with endpoint authorization, if you have such problem [check this link](https://docs.microsoft.com/en-us/azure/devops/pipelines/process/resources?view=vsts#troubleshooting-authorization-for-a-yaml-pipeline). Another issue is that  **you should analyze master branch for the first analysis for SonarCloud to work properly**. Until you do not analyze master branch, no analysis will be shown to SonarCloud.

If everything is green you should start seeing analysis data on SonarCloud UI.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2018/10/image_thumb-14.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2018/10/image-14.png)

 ***Figure 2***: *Analysis in SonarCloud after a successful master build*

 **As you can see just a few lines of YAML and I have my code automatically analyzed in SonarCloud, thanks to Azure DevOps** pipelines that already have tasks related to SonarCube integration.

A nice finishing touch is to grab the badge link for SonarCloud analysis and add it to your github readme.md.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2018/10/image_thumb-15.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2018/10/image-15.png)

 ***Figure 3***: *SonarCloud badge added to readme.md of the project.*

Gian Maria.
