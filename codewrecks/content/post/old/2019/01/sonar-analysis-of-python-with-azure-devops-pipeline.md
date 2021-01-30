---
title: "Sonar Analysis of Python with Azure DevOps pipeline"
description: ""
date: 2019-01-05T11:00:37+02:00
draft: false
tags: [Azure Devops,build,Python,sonarqube]
categories: [Azure DevOps]
---
Once you have [test and Code Coverage](http://www.codewrecks.com/blog/index.php/2018/11/20/run-code-coverage-for-python-project-with-azure-devops/) for your build of Python code,  **last step for a good build is adding support for Code Analysis with Sonar/SonarCloud.** SonarCloud is the best option if your code is open source, because it is free and you should not install anything except the [free addin in Azure Devops Marketplace](https://marketplace.visualstudio.com/items?itemName=SonarSource.sonarcloud).

From original build you need only to add two steps: PrepareAnalysis onSonarCloud and Run SonarCloud analysis, in the same way you do analysis for a.NET project.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2019/01/image_thumb.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2019/01/image.png)

 ***Figure 1***: *Python build in Azure DevOps*

You do not need to configure anything for a standard analysis with default options, just follow the configuration in Figure 2.:

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2019/01/image_thumb-1.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2019/01/image-1.png)

 ***Figure 2***: *Configuration of Sonar Cloud analysis*

The only tricks I had to do is  **deleting the folder /htmlcov created by pytest for code coverage results**. Once the coverage result was uploaded to Azure Devops server I do not needs it anymore and I want to remove it from sonar analysis. Remember that if you do not configure anything special for Sonar Cloud configuration it will analyze everything in the code folder, so you will end up with errors like these:

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2019/01/image_thumb-2.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2019/01/image-2.png)

 ***Figure 3***: *Failed Sonar Cloud analysis caused by output of code coverage.*

You can clearly do a better job simply configuring Sonar Cloud Analysis to skip those folder, but in this situation a simple Delete folder task does the job.

> To avoid cluttering SonarCloud analysis with unneeded files, you need to delete any files that were generated in the directory and that you do not want to analyze, like code coverage reports.

Another important settings is the Advances section, because you should specify the file containing code coverage result as extended sonar property.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2019/01/image_thumb-5.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2019/01/image-5.png)

 ***Figure 4***: *Extra property to specify location of coverage file in the build.*

Now you can run the build and verify that the analysis was indeed sent to SonarCloud.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2019/01/image_thumb-3.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2019/01/image-3.png)

 ***Figure 5***: *After the build I can analyze code smells directly in sonar cloud.*

If you prefer, like me, YAML builds, here is the complete YAML build definition that you can adapt to your repository.

{{< highlight yaml "linenos=table,linenostart=1" >}}


queue:
  name: Hosted Ubuntu 1604

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

- task: SonarSource.sonarcloud.14d9cde6-c1da-4d55-aa01-2965cd301255.SonarCloudPrepare@1
  displayName: 'Prepare analysis on SonarCloud'
  inputs:
    SonarCloud: SonarCloud
    organization: 'alkampfergit-github'
    scannerMode: CLI
    configMode: manual
    cliProjectKey: Pytest
    cliProjectName: Pytest
    extraProperties: |
     # Additional properties that will be passed to the scanner, 
     # Put one key=value per line, example:
     # sonar.exclusions=**/*.bin
     sonar.python.coverage.reportPath=$(System.DefaultWorkingDirectory)/coverage.xml

- bash: 'pytest --junitxml=$(Build.StagingDirectory)/test.xml --cov --cov-report=xml --cov-report=html' 
  workingDirectory: '.'
  displayName: 'Run tests with code coverage'
  continueOnError: true

- task: PublishTestResults@2
  displayName: 'Publish test result /test.xml'
  inputs:
    testResultsFiles: '$(Build.StagingDirectory)/test.xml'
    testRunTitle: 010

- task: PublishCodeCoverageResults@1
  displayName: 'Publish code coverage'
  inputs:
    codeCoverageTool: Cobertura
    summaryFileLocation: '$(System.DefaultWorkingDirectory)/coverage.xml'
    reportDirectory: '$(System.DefaultWorkingDirectory)/htmlcov'
    additionalCodeCoverageFiles: '$(System.DefaultWorkingDirectory)/ **'

- task: DeleteFiles@1
  displayName: 'Delete files from $(System.DefaultWorkingDirectory)/htmlcov'
  inputs:
    SourceFolder: '$(System.DefaultWorkingDirectory)/htmlcov'
    Contents: '** '

- task: SonarSource.sonarcloud.ce096e50-6155-4de8-8800-4221aaeed4a1.SonarCloudAnalyze@1
  displayName: 'Run Sonarcloud Analysis'


{{< / highlight >}}

 **The only settings you need to adapt is the name of the SonarCloud connection (** in this example is called SonarCloud) you can add/change in Project Settings &gt; Service Connections.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2019/01/image_thumb-4.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2019/01/image-4.png)

 ***Figure 6***: *Service connection settings where you can add/change connection with Sonar Cloud Servers.*

A possible final step is adding the [Build Breaker extension](https://marketplace.visualstudio.com/items?itemName=SimondeLang.sonarcloud-buildbreaker) to your account that allows you to made your build fails whenever the Quality Gate of SonarCloud is failed.

> Thanks to Azure DevOps build system, creating a build that perform tests and analyze your Python code is extremely simple.

Happy Azure Devops.

Gian Maria
