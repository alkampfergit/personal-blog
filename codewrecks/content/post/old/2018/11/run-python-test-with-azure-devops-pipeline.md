---
title: "Run Python test with Azure DevOps pipeline"
description: ""
date: 2018-11-12T22:00:37+02:00
draft: false
tags: [build]
categories: [Azure DevOps]
---
The beauty of Azure DevOps is it support to many technologies and all of major language.s I have a simple git repository where I’m experimenting Python code, in that repository I have several directories like 020\_xxxx 010\_yyy where I’m playing with Python code.

Each folder contains some code and some unit tests written in Pytest,  **my goal is creating an Azure Pipeline that can automatically run all pytest for me automatically each time I push some code to the repository.** > Even if Phyton is a script languages, it has several Unit Testing frameworks that can be used to verify that the code you wrote works as expected

Creating a build in Azure DevOps is really simple, just create a build that points to a yaml file in your repository that contains the definition.

{{< highlight bash "linenos=table,linenostart=1" >}}


queue:
  name: Hosted Linux Preview

trigger:
- master
- develop
- features/*
- hotfix/*
- release/*

steps:

- task: UsePythonVersion@0
  displayName: 'Use Python 3.x'

- bash: |
   pip install pytest 
   pip install pytest-cov 
   pip install pytest-xdist 
   pip install pytest-bdd 

  displayName: 'Install a bunch of pip packages.'
- bash: 'pytest --junitxml=$(Build.StagingDirectory)/010.xml' 
  workingDirectory: '010_CrackingCodeBasic'
  displayName: 'Run test 010'

- bash: 'pytest --junitxml=$(Build.StagingDirectory)/020.xml' 
  workingDirectory: '020_CrackingIntermediate'
  displayName: 'Run test 020'

- task: PublishTestResults@2
  displayName: 'Publish test result /010.xml'
  inputs:
    testResultsFiles: '$(Build.StagingDirectory)/010.xml'
    testRunTitle: 010

- task: PublishTestResults@2
  displayName: 'Publish test result /020.xml'
  inputs:
    testResultsFiles: '$(Build.StagingDirectory)/020.xml'
    testRunTitle: 020

{{< / highlight >}}

This is a real simple yaml buid definition where I’m simply requiring the usage of python 3.x, then install some packages with pip and finally a series of pytest tests run for each folder. As you can see I specified also the trigger to automatically build all branches typical of GitFlow naming convention.

 **The trick to have the result of the tests published directly in your build result is using a Pytest option to create a result file with JUNIT xml file format** ; once you have test result as a JUNIT xml files you can use standard PublishTestResults task to publish results in the build.

After the build completed you can simply looks at the output, if everything is ok the build is Green.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2018/10/image_thumb-21.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2018/10/image-21.png)

 ***Figure 1***: *Test results in my build that shows results of my python unit tests.*

 **The build will run all python tests in all of my source code folder,** thanks to Pytest that does everything for you, both discovering and run all tests in the folder.

If code does not compile, unit test will fail and you have a failing build.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2018/10/image_thumb-22.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2018/10/image-22.png)

 ***Figure 2***: *Not compiling code will lead to a failing build.*

The problem with this approach is that the build stops at the very first error, so if an error happens in 010 directory my 020 directory will not be tested because at the very first failed test the execution of the build stopped.

This condition is usually too strict, for unit testing it is usually a better approach to configure the build to continue even if run test failed.**To accomplish this, just add *continueOnError: true*after each bash task used to run tests. **With continueOnError equal to true, the build will continue and if some of the test task fails, the build is marked as Partially Failed, and from the summary you can easily check the run that generates the error.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2018/10/image_thumb-23.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2018/10/image-23.png)** Figure 3: ***Continue on error true will make the build continue on test error, in the summary you can verify what failed,*

The reason why I choose to launch a different Pytest run for each folder and upload each result with a different task is to have separate run in build result.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2018/11/image_thumb.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2018/11/image.png)

 ***Figure 4***: *Test runs are distinct for each folder.*

Even if this will force me to add two task for each folder (one for the run and the other for the publish) this approach will give me a different result for each folder so I can immediately understand where is the error.

Gian Maria.
