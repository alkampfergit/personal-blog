---
title: "Azure DevOps Pills: Integration with SonarCloud"
description: "Thanks to Azure DevOps specialized Task, integrating SonarCloud analysis in your process is a breeze"
date: 2020-08-20T08:12:42+02:00
draft: false
categories: ["AzureDevOps"]
tags: ["AzDo", "Pills"]
---

I've dealt in the past on [how to integrate SonarCloud analysis in a TFS/AzDo pipeline](http://www.codewrecks.com/blog/index.php/2018/10/10/azure-devops-pipelines-and-sonar-cloud-gives-free-analysis-to-your-os-project/) but today it is time to update that post with some interesting nice capabilities.

If you look in Figure 1 you can see that **now SonarCloud has a direct integration with Azure DevOps pull requests**, all you need to do is add a Personal Access Token with code access privilege and you are ready to go.

![Integration between SonarCloud and Azure DevOps Pull requests](../images/sonar-cloud-azdo-pr-integration.png)
***Figure 1***: *Integration between SonarCloud and Azure DevOps Pull requests*

Once you configured Sonar Cloud with a correct access token, you should install [Sonar Cloud integration from the Marketplace](https://marketplace.visualstudio.com/items?itemName=SonarSource.sonarcloud) into your Azure DevOps account.

> Thanks to Support From Sonar Cloud to Azure DevOps and vice-versa both services can interact with each other to allow you minimal effort integration.

Now you need to go to Azure DevOps team Project settings to add a new service connection of Sonar Cloud type, as you can see in Figure 2. This time **you need a Sonar Cloud access token (to access the service) and you can decide if all pipelines can automatically access that service connection or if you need to authorize each pipeline**

![Sonar Cloud service connection](../images/sonar-cloud-service.png)
***Figure 2***: *Sonar Cloud service connection*

At this point everything is ok, you only need to create a project in Sonar Cloud, configure rules, gates and everything you want and **create an Azure DevOps pipeline to perform Sonar Cloud analysis**.

{{< highlight yaml "linenos=table,hl_lines=21-28 45-53,linenostart=1" >}}
- task: UseDotNet@2
  displayName: 'Use .NET Core sdk 3.1.201'
  inputs:
    version: 3.1.201
    performMultiLevelLookup: true

- task: PowerShell@2
  displayName: "Running Gitversion to determine version for SonarCloud"
  inputs:
    targetType: inline
    script: |
      dotnet tool restore
      $gvo = dotnet tool run dotnet-gitversion /config GitVersion.yml | Out-String
      Write-Host $gvo
      $version = $gvo | ConvertFrom-Json
      Write-Host $version
      $assemblyVer = $version.AssemblySemVer
      Write-Host "Assembly semver is $assemblyVer"
      Write-Host "##vso[task.setvariable variable=assemblyVer;]$assemblyVer"
      
- task: SonarCloudPrepare@1
  inputs:
    SonarCloud: 'Sonar Cloud GitHub Gian Maria'
    organization: 'alkampfergit-github'
    scannerMode: 'MSBuild'
    projectKey: 'mysecretprojectkey'
    projectName: 'LogLibrary2020'
    projectVersion: '$(assemblyVer)'

- task: NuGetToolInstaller@1
  inputs:
    versionSpec: 5.x
    checkLatest: true

- task: NuGetCommand@2
  inputs:
    command: restore
    restoreSolution: src/LogLibrary.sln
- task: VSBuild@1
  inputs:
    solution: src/LogLibrary.sln
    configuration: debug
    restoreNugetPackages: true

- task: VSTest@2
  inputs:
    codeCoverageEnabled: true

- task: SonarCloudAnalyze@1

- task: SonarCloudPublish@1
  inputs:
    pollingTimeoutSec: '300'
{{< / highlight >}}

If you look at above code, it is really simple, I use dotnet tool gitversion to **calculate a semver from repository history** because I want to specify a correct version in SonarCloud analysis. Then you can see that we have three tasks, prepare should be run before any build and test is done, then **you should add analyze and publish tasks after you built and ran unit tests.**.

As you can see I've enabled code coverage in Visual Studio test runner, because Sonar Cloud analysis is capable of analyzing Unit Test run and **upload code coverage statistics to Sonar Cloud automatically.**

> Sonar Cloud analyzer is capable of analysis tests result to automatically upload code coverage to the server.

To complete the scenario you should go to Azure DevOps Team Project settings, go to repository settings, and **add this pipeline as required policy for develop branch.**. This will prevent anyone to push to develop, all team members should create a Pull Request to close a branch into develop. Thanks to previous policy **each time a PR is made, pipeline runs and perform a Sonar Cloud analysis on the code**.

![Policy on develop branch to run pipeline for PR validation](../images/sonar-cloud-pipelien-on-policy.png)
***Figure 3***: *Policy on develop branch to run pipeline for PR validation*

> If you analyze with Sonar Cloud each branch, you keep code quality under constant quality control.

Thanks to the pipeline, each branch is analyzed, you can now see **how many issues you are introducing into your code for each branch**. As an example I've added a fileDestination feature branch that actually is not so good :), it is not passing quality gate (no code coverage) and also it introduced three new issues (Figure 4).

![Sonar cloud branch analysis result](../images/sonar-cloud-analysis-result.png)
***Figure 4***: *Sonar cloud branch analysis result*

But the real nice feature is that: **since you've added a valid Personal Access Token in Sonar Cloud, it is actually able to automatically comments your Pull Request Code**, as you can see in Figure 5.

![Sonar cloud is able to comment Pull Request Code automatically](../images/sonar-cloud-commenting-code.png)
***Figure 5***: *Sonar cloud is able to comment Pull Request Code automatically*

This is actually a really nice feature, because now I do not even need to go to Sonar Cloud to see if my Pull Request code is introducing new issues, **because I can immediately spot comment directly in PR interface in Azure DevOps.** How cool is that.

> Automatic Code commenting is a really nice feature to immediately spot problematic code in a PR.

But you have also another cool integration you can use, visible in Figure 6: **You can add to branch policy a Sonar Cloud quality gate requirements**. This will force Pull Request code not to break Sonar Quality Gate.

![Sonar Cloud Quality Gate requirement for Pull Requests](../images/quality-gate-policy.png)
***Figure 6***: *Sonar Cloud Quality Gate requirement for Pull Requests*

At this point not only I'm doing automatic Code analysis on each Pull Request, **but if my code is so bad to fail Sonar Cloud Quality Check I cannot complete the Pull Request**. This can be a real strong requirement, but actually you are preventing **develop branch to fail code quality.**.

> Requiring code quality gate pass on Pull Request protect your develop branch automatically from bad code.

As you can see from Figure 7, my code now fail a PR required check. If you click on failed test, you are immediately redirect to Sonar Cloud analysis to see what is wrong.

![Pull Request failed quality check](../images/pr-failing-code-quality-check.png)
***Figure 7***: *Pull Request failed quality check*

It was a quite long post, but if you care about your code Quality, you can integrate Sonar Cloud in your development cycle with very few effort, I assure you that it worth the effort. **Also, you can use Azure DevOps pipeline also to build and analyze code in GitHub. In this scenario you can analyze all of your branch, but you lose Pull Request integration**.

Gian Maria.
