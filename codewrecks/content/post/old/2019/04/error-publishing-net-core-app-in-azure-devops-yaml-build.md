---
title: "Error publishing NET core app in Azure Devops YAML Build"
description: ""
date: 2019-04-30T11:00:37+02:00
draft: false
tags: [build]
categories: [Azure DevOps]
---
Short story, I’ve created a simple YAML build for a.NET core project where one of the task will publish a simple.NET core console application. After running the build I’ve a strange error in the output

> No web project was found in the repository. Web projects are identified by presence of either a web.config file or wwwroot folder in the directory.

This is extremely strange, because the project is not a web project, it is a standard console application written for.NET core 2.2 so I do not understand why it is searching a web.config file.

 **Then I decided to create a standard non YAML build, and when I dropped the task on the build I immediately understood the problem.** This happens because dotnet core task with command publish is assuming by default that a web application is going to be published.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2019/04/image_thumb-16.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2019/04/image-16.png)

 ***Figure 1***: *Default value for the dotnet publish command is to publish Web Project*

Since I’ve no Web Project to publish I**immediately change  my YAML definition to explicitly set to False the *publishWebProjects*property**.

{{< highlight python "linenos=table,linenostart=1" >}}


  - task: DotNetCoreCLI@2
    displayName:.NET Core Publish
    inputs:
      command: publish
      projects: '$(serviceProject)'
      arguments: '--output $(Build.ArtifactStagingDirectory)'
      configuration: $(BuildConfiguration)
      workingDirectory: $(serviceProjectDir)
      publishWebProjects: False
      zipAfterPublish: true

{{< / highlight >}}

And the build was fixed.

Gian Maria.
