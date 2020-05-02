---
title: "Execute multiple build to create a complex release"
description: "Sometimes you have legacy projects with many solutions that compose a single proudct. In this scenario you want to build each solution separately but having a full release to release everything at the same point in time"
date: 2020-04-23T19:12:42+02:00
draft: true
categories: ["AzureDevops"]
tags: ["AzDo", "Pipeline"]
---

## Situation

We have a legacy project, born when Asp.Net WebForm was still a thing and Asp.NET MVC was still not released. This project grow during the years, in more that one subversion and git repositories. It was finally time to start setting some best practice in action and, to avoid complexity, we end with a single Git Repositories with Six subfolders with Six different solution, each one that contains a part of the final product.

### Build only project that changes

We are still on the path of standardizing all the builds, but since some projects are full Framework, some other are in .NET Core, we end having six different YAML definition, each one that builds a specific project. 

Thanks to trigger branch filtering, we were able to implement continuous integration, but only if someone change some code that is inside a specific project.

{{< highlight yaml "linenos=table,hl_lines=9-11,linenostart=1" >}}
trigger:
  branches:
    include:
      - master
      - develop
      - release/*
      - hotfix/*
      - feature/*
  paths:
    include:
      - src/Connector

{{< / highlight >}}

As you can verify from the above code, we impose a continous integration on standard GitFlow branches, but since **this is the build of Connector project, I've setup a path filter to include only changes in src/Connetor subfolder**. This means that if someone change other solution in the very same repository, this build does not start. This is really important, because having six different project and six different build, we reduce load on build agent to one sixth if we only build the project that is really changed.

### PowerShell build 

Each build can be done with a different script, but generally speaking every build will produce one or more artifacts and each artifacts is a 7zip archive containing everything needed to release that specific project and it has a name that comes from GitVersion.

To simplify everything, we created for all .NET CORE project a simple powershell file that uses standard dotnet command line tooling to build / test / publish the project, this allows each developer to run locally build.ps1 script and have the very same result that you can have from Azure DevOps pipeline.

What we really need is the abiilty to generate GitVersion SemVer number independently from the build system.

{{< highlight powershell "linenos=table,linenostart=1" >}}
Write-Host "restoring tooling for gitversion"
dotnet tool restore

Write-Host "Running gitversion to determine version"
$version = dotnet tool run dotnet-gitversion /config GitVersion.yml | Out-String | ConvertFrom-Json
Write-Output $version

$assemblyVer = $version.AssemblySemVer
$assemblyFileVer = $version.AssemblySemFileVer
$nugetVersion = $version.NuGetVersionV2
$assemblyInformationalVersion = $version.FullSemVer + "." + $version.Sha
$fullSemver = $version.FullSemVer

{{< / highlight >}}

Using dotnet Core local tools strategy, we can simply use a [dotnet restore](https://docs.microsoft.com/en-us/dotnet/core/tools/dotnet-tool-restore) to have gitversion tool restore so we can simply run with *dotnet tool run dotnet-giversion* and piping all the result to ConvertFrom-Json to be able to extract everything.

### Code to be executed only when we run in Azure Devops Pipeline

Clearly we want some code to be executed only if the build.ps1 script is executed inside a Azure Devops Build. Actually we want to change the name of the build (using GitVersion to adhere to semversion notation) and uploading a simple dump of every environment variable (needed to troubleshoot test and other stuff that uses environment variables to work)

{{< highlight powershell "linenos=table,linenostart=1" >}}
$buildId = $env:BUILD_BUILDID
Write-Host "Build id variable is $buildId"
$runInBuild = $false
if (![System.String]::IsNullOrEmpty($buildId)) 
{
    $runInBuild = $true
    Write-Host "Running in an Azure Devops Build"

    Write-Host "##vso[build.updatebuildnumber]James OpcUA Simulator - $fullSemver"
    Write-Host "##vso[task.setvariable variable=currentVersion;]$nugetVersion"

    Write-Host "Dumping all environment variable of the build"
    $var = (gci env:*).GetEnumerator() | Sort-Object Name
    $out = ""
    Foreach ($v in $var) {$out = $out + "`t{0,-28} = {1,-28}`n" -f $v.Name, $v.Value}

    write-output "dump variables on $outFolder\test.md"
    $fileName = "$outFolder\test.md"
    set-content $fileName $out

    write-output "##vso[task.addattachment type=Distributedtask.Core.Summary;name=Environment Variables;]$fileName"
}

{{< / highlight >}}

Verifying if you are running in Azdo pipeline is easy, just check if the environment variable BUILD_BUILDID is not empty. If contains some value we are running inside Azure DevOps pipline, so we need to update build number and dump all variables.

### Creating artifacts

Once test runs successfully we simply need to use dotnet publish command to publish needed projects, we use Semantic versioning and finally I have some simple function that download if needed 7za.exe tool from internet and compress everyting with 7zip

{{< highlight powershell "linenos=table,linenostart=1" >}}

dotnet publish James.Connector\James.Connector.csproj --configuration $configuration -o "$outFolder\Service" /p:PackageVersion=$nugetVersion /p:AssemblyVersion=$assemblyVer /p:FileVersion=$assemblyFileVer /p:InformationalVersion=$assemblyInformationalVersion

Write-Output "Compress everything"
$sevenZipExe = Get-7ZipLocation
Write-Output "Exe 7zip used is $sevenZipExe"

set-alias sz $sevenZipExe
$Source = "$outFolder\Service\*.*"
$Target = "$outFolder\Compressed\Connector-$nugetVersion.7z"
Write-Output "Zipping folder $Source in file $Target"
sz a -mx=9 -r -mmt=on $compressionOptions $Target $Source

{{< / highlight >}}

Nothing really complex here, just publish and then 7zipping everything in an archive that contains the version as returned from GitVersion.

### Creating YAML Build

Once a complete build.ps1 script is in place, we can create AzDo pipeline composed by only four tasks.

1. Install if needed .NET core with desired version
1. Run script build.ps1
1. Upload test results
1. Upload artifacs

This is the sequence of steps, really simple and coincise.

{{< highlight yaml "linenos=table,linenostart=1" >}}
  - task: UseDotNet@2
    displayName: 'Use .NET Core sdk $(DotNetCoreVersion)'
    inputs:
      version: $(DotNetCoreVersion)
      performMultiLevelLookup: true

  - task: PowerShell@2
    displayName: "Execute build file to create release"
    inputs:
      targetType: filePath
      filePath: $(Build.SourcesDirectory)/src/Connector/build.ps1
      workingDirectory: $(Build.SourcesDirectory)/src/Connector
      arguments: -outFolder  $(Build.ArtifactStagingDirectory) -configuration ${{parameters.configuration}}
      failOnStderr: true

  - task: PublishTestResults@2
    inputs:
      testResultsFormat: 'VSTest'
      testResultsFiles: '*.trx'
      searchFolder: '$(Build.ArtifactStagingDirectory)'
      testRunTitle: 'Test'
    condition: succeededOrFailed()

  - task: PublishBuildArtifacts@1
    displayName: 'Publish Service Artifacts'
    inputs:
      PathtoPublish: '$(Build.ArtifactStagingDirectory)\Compressed'
      ArtifactName: Connector

{{< / highlight >}}

Once this build runs it will produce a nice results, with all tests and artifacts.

![Connector artifacts](../images/Connector-build-result-artifacts.png)

***Figure 1:*** *Artifacts produced by Connector pipeline"

As you can see artifacts name is simply called "Connector" and it contains a single file, the 7ip files that contains everything needed to be released, as packed by build.ps1 script. Zipped file name contains the version of the software, so we can immediately spot version.

### Going for a single build with a full release

This process is good, if a developer push a change on one of the six project only the corresponding pipeline gets executed, it runs the test and everything is good.

Now we face another small problem, when it is time to do a release, we wish to run all the pipeline on the very same Git commit, creating all the packages at the same point in time. This is required because

1. We can be sure that all released code comes from the same point in time
1. Every assembly has the very same name

Suppose the connector was never changed from version 6.2 to 6.3, we could create a 6.3 release using the latest connector build marked 6.2. This will generate confusion and we want to avoid it.

The obvious solution is to create another pipeline that is automatically triggering all the other pipeline and finally group every artifacts toughener for a full release. While this is a simple approach it is annoying because you have one piepeline that triggers other pipeline and you have no single point to verify all the logs of the various pipeline.

Thanks to MultiStage pipeline and templates, there is a better solution. Instead of creating a YAML file with the pipeline definition for each project, we create one template for each project. Since everything is defined inside a template, final builds are really simple.

{{< highlight yaml "linenos=table,linenostart=1" >}}
  trigger:
  branches:
    include:
      - master
      - develop
      - release/*
      - hotfix/*
      - feature/*
  paths:
    include:
      - src/Connector

variables:
  Configuration: release

jobs:

- job: build_test_release

  pool:
    name: '$(Pool)'
    demands:
      - vstest
      - msbuild
      - visualstudio

  steps:
  - template: BuildConnectorTemplate.yaml
    parameters:
      configuration: $(Configuration)
{{< / highlight >}}

This is really simple, everything is defined in BuildConnectorTemplate.yaml and the real pipeline defines only the triggers, variables and the pool where to execute the sequence of steps. Template file is only composed by the steps that define the pipeline

{{< highlight yaml "linenos=table,linenostart=1" >}}
parameters:
  configuration: release

steps:
  
  - task: UseDotNet@2
    displayName: 'Use .NET Core sdk $(DotNetCoreVersion)'
    inputs:
      version: $(DotNetCoreVersion)
      performMultiLevelLookup: true
      ...
{{< / highlight >}}

Once every single build is converted to template I can simply create a single multi staged build that trigger all the templates one after another.

{{< highlight yaml "linenos=table,linenostart=1" >}}
trigger:
  branches:
    include:
      - master

variables:
  Configuration: release

stages:
  - stage: Excute_all_other_pipelines
  
    jobs:
      - job: "trigger_connector"
        pool: 
          name: $(pool)
        steps:
        - template: BuildConnectorTemplate.yaml
          parameters:
            configuration: $(Configuration)

      - job: "trigger_OpcSimulator"
        pool: 
          name: $(pool)
          ...
{{< / highlight >}}

Nothing simpler, release definition is a series of jobs and each job simply run steps defined in corresponding template. The result is a nice build where I can verify each single run and I can also re-run failed pipeline if I have some erratic build.

When I want to release the software, I just run this multi stage pipeline with the branch I want and here is the result.

![Multi stage pipeline result](../images/multi-stage-release-pipeline-results.png)

***Figure 2:*** *Multi stage pipeline result*

The nice part is that, each one of the template is uploading its own artifacts. When the pipeline is completed, all the artifacts and logs are in one single place.
