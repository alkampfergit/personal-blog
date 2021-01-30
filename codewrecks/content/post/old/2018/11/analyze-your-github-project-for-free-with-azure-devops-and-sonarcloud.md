---
title: "Analyze your GitHub project for free with Azure DevOps and SonarCloud"
description: ""
date: 2018-11-04T09:00:37+02:00
draft: false
tags: [Azure Devops,build]
categories: [Azure DevOps,Visual Studio ALM]
---
I’ve blogged some weeks ago on how to [analyze OS code with SonarCloud](http://www.codewrecks.com/blog/index.php/2018/10/10/azure-devops-pipelines-and-sonar-cloud-gives-free-analysis-to-your-os-project/), but it is time to update the post, because  **if you want to use SonarCloud you have a dedicated extension in the marketplace**.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2018/10/image_thumb-17.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2018/10/image-17.png)

 ***Figure 1***: *Official SonarCloud extension in the marketplace.*

One of the great feature of Azure DevOps is its extendibility, that allows people external to Microsoft to create extensions to expand the possibility of the tool. Once you’ve added the SonarCloud extension to your account,  **you have a whole bunch new build templates you can use** :

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2018/10/image_thumb-18.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2018/10/image-18.png)

 ***Figure 2***: *Build template based on Sonar Cloud*

Having a template make super easy to create a build, you just choose.NET Desktop with SonarCloud and you are ready to go. As you can see in  **Figure 2** you can also use Azure DevOps pipeline to build with Gradle, maven or.NET core, so you are not confined to microsoft tooling.

In  **Figure 3** there is the build created by.NET desktop project template (remember that this template can be used also for web application, and for every.NET application).

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2018/10/image_thumb-19.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2018/10/image-19.png)

 ***Figure 3***: *.NET Sonar Cloud analysis template.*

 **The only task you need to configure for Sonar Cloud analysis is the Prepare analysis on Sonar Cloud**. As you can see in  **Figure 4** , you should first create an endpoint that connect Azure DevOps to your SonarCloud account.

[![SNAGHTML1d1ca3](https://www.codewrecks.com/blog/wp-content/uploads/2018/10/SNAGHTML1d1ca3_thumb.png "SNAGHTML1d1ca3")](https://www.codewrecks.com/blog/wp-content/uploads/2018/10/SNAGHTML1d1ca3.png)

 ***Figure 4***: *In task configuration you have a nice button to create the connection to your SonarCloud account*

Configuring the connection is really simple, just give a name to the connection and specify the access token (you should first generate a token in SonarCloud). Then, as shown in  **Figure 5** , press Verify Connection to check that everything is ok.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2018/10/image_thumb-20.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2018/10/image-20.png)

 ***Figure 5***: *Configuration and test of the connection between Azure DevOps and SonarCloud.*

> Thanks to the concept of external services, you can configure one or more connection to SonarCloud and having it available in the build without disclosing tokens.

Once you’ve selected the connection, just specify name and key of the project, and other optional parameters if you need to do a custom analysis.  **In less than a couple of minutes you have a build up and running**. Just configure the agent to use Hosted VS2017 pipeline and queue a first build to verify that everything is ok.

> Once you have configured the build with the visual web designer, you can convert to Yaml build with few steps.

Clearly I prefer to have a YAML build for a lot of reasons, once the build is up and running simply press the YAML button in the build definition to have your build converted to YAML.

{{< highlight css "linenos=table,linenostart=1" >}}


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

- task: SonarSource.sonarcloud.14d9cde6-c1da-4d55-aa01-2965cd301255.SonarCloudPrepare@1
  displayName: 'Prepare analysis on SonarCloud'
  inputs:
    SonarCloud: 'SonarCloud'
    organization: 'alkampfergit-github'
    projectKey: MigrationPlayground
    projectName: MigrationPlayground
    projectVersion: '$(AssemblyVersion)'

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

- task: SonarSource.sonarcloud.ce096e50-6155-4de8-8800-4221aaeed4a1.SonarCloudAnalyze@1
  displayName: 'Run Code Analysis'

- task: SonarSource.sonarcloud.38b27399-a642-40af-bb7d-9971f69712e8.SonarCloudPublish@1
  displayName: 'Publish Quality Gate Result'

{{< / highlight >}}

Finally, if you still have not installed Azure Devops Pipeline in your GitHub account, I strongly suggest you to do so, just follow [the instruction of this article](https://www.linkedin.com/pulse/using-azure-pipelines-github-open-source-project-mike-douglas/), it is free and gives you free hosted pipelines to run your build for free.

Gian Maria
