---
title: "Azure DevOps: run test in PowerShell and publish results"
description: "If you create a build in PowerShell you can publish in an Azure DevOps pipeline with a special task, let see how."
date: 2022-01-01T07:00:42+00:00
draft: false
categories: ["AzureDevops"]
tags: ["AzDo"]
---

Creating full build in PowerShell has [lots of advantages](https://www.codewrecks.com/post/azdo/pipeline/powershell-build/) because you can simply **launch the script and having the build run in any environment**. This simplifies tremendously debugging build scripts and moving Continuous Integration from one engine to other (Ex from Azure DevOps to GitHub actions).

Clearly you need to thing in advance how to integrate **with your current CI engine** because usually you will need to communicate information to the engine. 

Every CI engine has different capabilities, as an example, Azure DevOps has a nice interface **to show you test results and it is a waste not using it only because you are doing everything in a PowerShell build and not using the VSTest native task**. The trick is configuring your build to communicate with the environment, in the most general way possible.

For Tests you can simply output test results in a well known format in the artifacts output directory. It is duty of the CI engine to **look in the artifacts directory to scan for every output of the build and find interesting stuff**.

As an example the following PowerShell piece of code **locates every C# project with a special format in the name (contains tests) and then run tests on it**. This is done to generate a single trx output file for each test project, a nice way to have a full report for each one of the distinct test project file.

{{< highlight powershell "linenos=table,linenostart=1" >}}
$testProject = Get-ChildItem $runningDirectory -Recurse -Filter "*.tests.csproj"
foreach ($file in $testProject) 
{
    $fileName = $file.Name
    Write-Host "Run test for $($file.FullName) to file result $publishDirectory/$fileName.trx"
    dotnet test $file.FullName --no-build --configuration $Configuration --logger "trx;LogFileName=$publishDirectory/$fileName.trx" /p:PackageVersion=$nugetVersion /p:AssemblyVersion=$assemblyVersion /p:FileVersion=$assemblyFileVersion /p:InformationalVersion=$assemblyInformationalVersion
}
{{< / highlight >}}

When you run the script locally you can immediately verify what the script produces the correct output files in desired directory. 

![Test output result in output directory](../images/build-test-output.png)

***Figure 1:*** *Test output result in output directory*

With this model it is super easy to **load test results in CI engine like Azure DevOps that have a nice interface to show you test results**. If you use GitHub actions that does not have a dedicated interface you can simply publish test results as build attachment. This is the piece of Azure DevOps pipeline that **publishes test results in the build result page**.

{{< highlight yaml "linenos=table,hl_lines=5,linenostart=1" >}}
- task: PublishTestResults@2
  displayName: "Publish test results"
  inputs:
    testResultsFiles: $(Build.ArtifactStagingDirectory)/*.trx
    testRunTitle: "Jarvis Store Test Run"
{{< / highlight >}}

In GitHub actions you can instead use this piece of code to **simply upload .trx files to build artifacts**. If you need to look at test result you can download trx files and open with Visual Studio (or you can use a different output format like NUNIT).

{{< highlight yaml "linenos=table,hl_lines=5,linenostart=1" >}}
- uses: actions/upload-artifact@v2
  with:
    name: my-artifact
    path: |
      ${{ github.workspace }}/**/*.trx
{{< / highlight >}}

The trick when you create your build scripts in PowerShell is trying to be as most generic as possible, while, at the same time, prepare for integrate with your current CI engine, and **plan that integration to be as generic as possible to minimize the change to adapt to a new CI engine**. This is especially true these days, because with the acquisition of GitHub by Microsoft, switching from Azure DevOps to GitHub is a move that it is possible to perform in the next years. Do not forget that you can move to GitHub, but still use Azure DevOps as a CI engine. Azure DevOps pipelines integrate with lots of systems, so it is perfectly **safe to move your code and planning capabilities to GitHub or other provider, while retaining all of your build in Azure DevOps.**

Gian Maria.
