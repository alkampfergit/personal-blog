---
title: "Azure DevOps: Execute GitHub code analysis in a pipeline"
description: "GitHub CodeQL is a really powerful analyzer, lets look on how to integrate in Azure DevOps pipeline"
date: 2020-12-28T08:50:42+00:00
draft: false
categories: ["AzureDevops"]
tags: ["AzDo"]
---

Ok, I know that many of you are questioning: Why using Azure DevOps to analyze code with CodeQL? Using GitHub actions is the preferred way to do so why bother with running in another CI? The scenario is simple, a company has everything on Azure DevOps, it wants to retain everything there but it **want to be able to gain advantage from GitHub CodeQL analysis**. This scenario is not so uncommon, and you [have a nice GitHub guide](https://docs.github.com/en/free-pro-team@latest/github/finding-security-vulnerabilities-and-errors-in-your-code/running-codeql-code-scanning-in-your-ci-system) on how to run CodeQL code scanning in your CI System.

> It is not uncommon to take the best of many tools mixing them in your developing pipeline.

First of all you need to have a suitable GitHub license that allows you to use CodeQL scanning, then **you need to have a mirrored repository on GitHub because the code should be on GH to allow for CodeQL scanning to run**. Luckily enough keeping the two repository in sync is not a big deal. 

To summarize, if you want to perform a CodeQL analysis the code must be on GH, so, if your code is on Azure DevOps, your pipeline **needs to push the code to a mirrored repository on GH to perform the analysis**. In the long run probably it is better to completely **switch the code over GH, and still use Azure Board and Azure Pipeline**.

First of all you need to include in your Azure DevOps pipeline a secret variable with a valid GitHub Token, because it will be used **several time in the build to access GitHub Repository.**.

![Variables holding GitHub public access token](../images/gh-token-variable-secret.png)

***Figure 1:*** *Variables holding GitHub public access token*

Once you have the secret you can do everything with PowerShell, you do not need anything else to perform the analysis. I've started including everything **directly into the build, but you can include everything in a PowerShell script included in the source control**. At the very start the script simply checkout current directory and forcefully push to related GitHub repository.

{{< highlight powershell "linenos=table,linenostart=1" >}}
$currentBranch = "$(Build.SourceBranch)".Substring("refs/heads".Length + 1)
Write-Host "Current branch to push on GitHub is $currentBranch"
git push https://$(ghtoken)@github.com/alkampfergit/fantastic-log-library.git "origin/$currentBranch`:$currentBranch" --force
{{< / highlight >}}

Very simple code, just a parsing to grab correct branch name from Build.SourceBranch variable, that **contains full name of the branch, es refs/heads/develop** so I'm going to simply remove the refs/heads starting part. To **forcefully push to GitHub you can use simple syntax that contains access token in the url, so you do not need to bother with authentication.** Do not forget to checkout the branch and do a pull, because Azure DevOps pipeline agent only checkout the commit without initializing the branch. Once you pushed your code to the GitHub repository you can proceed to perform the analysis.

> Remember that to perform CodeQL analysis your code should be on GitHub, if your code reside somewhere else, you need to push it to GH before performing the analysis.

{{< highlight powershell "linenos=table,linenostart=1" >}}
#Download and initialize CodeQL analysis
Write-Host "downloading Code QL analysis for windows"
$ProgressPreference = 'SilentlyContinue'
Invoke-WebRequest -uri https://github.com/github/codeql-action/releases/latest/download/codeql-runner-win.exe -OutFile $(Build.SourcesDirectory)\src\codeql-runner-win.exe
Write-Host "Code QL analysis for windows downloaded, now we init it"
cd $(Build.SourcesDirectory)\src
pwd 
& ./codeql-runner-win.exe init --github-url https://github.com --repository alkampfergit/fantastic-log-library --github-auth $(ghtoken) --languages csharp

cat $(Build.SourcesDirectory)\src\codeql-runner\codeql-env.sh | Invoke-Expression

#Perform a standard build of your code
dotnet restore
dotnet build

#perform CodeQL analysis
Write-Host "Analyzing with CodeQL"
& ./codeql-runner-win.exe analyze --github-url https://github.com --repository alkampfergit/fantastic-log-library --github-auth $(ghtoken) --commit $(Build.SourceVersion) --ref $(Build.SourceBranch)  
{{< / highlight >}}

Code is really simple and follows the [instruction on the official guide](https://docs.github.com/en/free-pro-team@latest/github/finding-security-vulnerabilities-and-errors-in-your-code/running-codeql-code-scanning-in-your-ci-system). Since I'm using a compiled language: C#, **I need to compile the project before launching final analysis**.

As a final touch, CodeQL scanner **produces a [SARIF file](https://docs.oasis-open.org/sarif/sarif/v2.0/csprd01/sarif-v2.0-csprd01.html) that contains the analysis and automatically uploads to GH Repository**, but if you want to have this file available also on Azure DevOps you can simply add an upload task to the pipeline.

{{< highlight yaml "linenos=table,linenostart=1" >}}
    - task: PublishBuildArtifacts@1
      inputs:
        PathtoPublish: '$(Build.SourcesDirectory)\src\codeql-runner\codeql-sarif'
        ArtifactName: 'CodeAnalysis'
        publishLocation: 'Container'
{{< / highlight >}}

Now everything I need to do is just fire the build, verify that everything is ok and looking at the results. First of all, if the build is green **I want to check that the branch is correctly pushed on GitHub** as shown in **Figure 2**.

![Mirrored branch from Azure DevOps to GitHub](../images/gh-branch-mirror.png)

***Figure 2:*** *Mirrored branch from Azure DevOps to GitHub*.

Once you verify that the code is pushed correctly, it is time to **check security tab to verify if the result of the analysis is there**.

![Results of CodeQL analysis in GitHub](../images/analysis-result-code-ql.png)

***Figure 3***: *Results of CodeQL analysis in GitHub*

As a bonus, you should **check Azure DevOps result to verify that sarif files was correctly uploaded with the artifacts**. You now can download and look at it with some Sarif Viewer.

![Sarif result file uploaded as artifact in Azure DevOps Build](../images/sarif-file-uploaded-as-artifact.png)

***Figure 4***: *Sarif result file uploaded as artifact in Azure DevOps Build*

If you want to see the whole build definition, you can directly [check it on GitHub](https://github.com/alkampfergit/fantastic-log-library/blob/master/builds/ci.yml).

Gian Maria.
