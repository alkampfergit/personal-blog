---
title: "Code coverage in SonarCloud and GitHub Actions"
description: "How to obtain code coverage for a C# .NET Core 5 project in GitHub with actions"
date: 2021-07-08T19:00:00+02:00
draft: false
tags: ["github"]
categories: ["coding"]
--- 

First of all I want to thank my friend [Giulio Vian](http://blog.casavian.eu/page/about/) for pointing me in the right direction and for its great work in [TfsAggregator Action](https://github.com/tfsaggregator/aggregator-cli/blob/master/.github/workflows/build-and-deploy.yml).

My problem was: I used the wizard in GitHub to create a GitHub Action definition to analyze code in SonarCloud, everything runs just fine except I was not able to have Code Coverage nor unit tests result in my analysis. **With Azure DevOps actions and .NET Full Framework project there is no problem** but with GH and standard Actions no result see, seems to be uploaded.

Clearly this is not a problem of GH Actions, but **it is due to a change in Sonar Cloud analysis tool**, it happened in the past (when I had to manually convert code coverage output format for .NET core) and it seems that it happened again.

> Running dotnet test command with standard code coverage collection options generates a result that is not usable by Sonar Cloud scanner.

After some tentative, I've decided to switch to a better approach, **instead of changing GH Action Workflow, commit, then verify if the action is ok, I wrote a PowerShell script that does everything**. This is one of my preferred approach, I can write the script, test it in Visual Studio Code or PowerShell ISE and, once the script runs correctly, I can simply call the very same script from GitHub action. 

> Using script usually cuts down time needed to develop CI/CD at least in half.

You can find complete code in [this public GH repo](https://github.com/alkampfergit/DotNetCoreCryptography). As first step I've included a .NET core tool configuration file in .config/dotnet-tool.json directory, with the following content:

{{< highlight json "linenos=table,linenostart=1" >}}
{
  "version": 1,
  "isRoot": true,
  "tools": {
    "gitversion.tool": {
      "version": "5.2.4",
      "commands": [
        "dotnet-gitversion"
      ]
    },
    "dotnet-sonarscanner": {
      "version": "5",
      "commands": [
        "dotnet-sonarscanner"
      ]
    }
  }
}
{{< /highlight >}}

This file allows me to **fix the exact version of all .NET core related tool that I need to use in this repository**. As you can see I've included both GitVersion and dotnet-sonarscanner.

> Even if you are not using dotnet, you should be aware that dotnet tools have lots of general purpose tools, like gitversion.

Once I've configured my tool list I can create a PowerShell file that does everything: **restore tools, run gitversion, initialize code scanner, build test and complete code scanner**. Many thanks to Giulio Vian that pointed me in the right direction about a couple of problems:

1. You need to **have a ProjectGuid in all .csproj of your project**. This is not a requirement for .NET core so it is usually not present in csproj project files created by Visual Studio. You can add it manually or you can do this with PowerShell inside the script. Since I've not any problem in having it inside my .csproj file, I've directly modified my projects files to include a ProjectGuid.
2. You need to execute dotnet test with special parameters to have output in a format that is understandable by SonarCloud.

> Performing the whole set of steps in a PowerShell file speeds up problem solving because you can directly launch the script in your machine, debug it, and verify if everything works as expected.

This is the complete script that analyze my project. It has **sonarSecret as the only parameter, it does not need anything else**. You can use this PowerShell file to launch an analysis in your Machine without committing anything. It is not a good practice to analyze uncommitted code, but it **is really good for troubleshooting**.

Here is the complete content of the file.

{{< highlight powershell "linenos=table,linenostart=1" >}}
param(
    [string] $sonarSecret
)

Install-package BuildUtils -Confirm:$false -Scope CurrentUser -Force
Import-Module BuildUtils

$runningDirectory = Split-Path -Parent -Path $MyInvocation.MyCommand.Definition

$testOutputDir = "$runningDirectory/TestResults"

if (Test-Path $testOutputDir)
{
    Write-host "Cleaning temporary Test Output path $testOutputDir"
    Remove-Item $testOutputDir -Recurse -Force
}

$version = Invoke-Gitversion
$assemblyVer = $version.assemblyVersion

$branch = git branch --show-current
Write-Host "branch is $branch"

dotnet tool restore
dotnet tool run dotnet-sonarscanner begin `
  /k:"alkampfergit_DotNetCoreCryptography" ` # Key of the project
  /v:"$assemblyVer" `                        # Version of the assemly as calculated by gitversion
  /o:"alkampfergit-github" `                 # account
  /d:sonar.login="$sonarSecret" `            # Secret
  /d:sonar.host.url="https://sonarcloud.io" `
  /d:sonar.cs.vstest.reportsPaths=TestResults/*.trx ` # Path where I'm expecting to find test result in trx format
  /d:sonar.cs.opencover.reportsPaths=TestResults/*/coverage.opencover.xml ` # Name of the code coverage file
  /d:sonar.coverage.exclusions="**Test*.cs" `   # asembly names to be excluded from code coverage
  /d:sonar.branch.name="$branch"                # Actual branch I'm analyzing.

dotnet restore src
dotnet build src --configuration release

# Now execute tests with special attention to produce output
# that can be easily read by SonarCloud analyzer
dotnet test "./src/DotNetCoreCryptography.Tests/DotNetCoreCryptography.Tests.csproj" `
  --collect:"XPlat Code Coverage" `           # cross platform code coverage
  --results-directory TestResults/ `          # Test Result directory
  --logger "trx;LogFileName=unittests.trx" `  # Use standard trx format for logger output
  --no-build `
  --no-restore `
  --configuration release `
  -- DataCollectionRunSettings.DataCollectors.DataCollector.Configuration.Format=opencover # Special open cover data collector

dotnet tool run dotnet-sonarscanner end /d:sonar.login="$sonarSecret"
{{< /highlight >}}

Once the script works correctly, you can simply invoke it in a run task in your GH Action (or in an Azure Devops pipeline, or in any CI tool you are using). **Resulting action script is really simple, very few lines of code**.

{{< highlight yaml "linenos=table,linenostart=1" >}}
name: SonarCloud
on:
  push:
    branches:
      - master
      - develop
      - feature/*
      - hotfix/*
      - release/*
  pull_request:
    types: [opened, synchronize, reopened]
jobs:
  build:
    name: Build
    runs-on: windows-latest
    steps:
      - name: Set up JDK 11
        uses: actions/setup-java@v1
        with:
          java-version: 1.11
      - uses: actions/checkout@v2
        with:
          fetch-depth: 0  # Shallow clones should be disabled for a better relevancy of analysis

      - name: Build and analyze
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}  # Needed to get PR information, if any
          SONAR_TOKEN: ${{ secrets.SONAR_TOKEN }}
        shell: powershell
        run: |
          .\sonarcloud.ps1 -sonarSecret ${{ secrets.SONAR_TOKEN }}
{{< /highlight >}}

The only special step I'm using is the standard actions/setup-java@v1 that **automatically setup java to be used in subsequent steps of the action.** As you can verify I can **simply call sonarcloud.ps1 script and let the script doing everything"**. After a run is complete I can verify if finally code coverage appears in SonarCloud dashboard.

![Result of Sonar Cloud analysis now includes code coverage](../images/sonarcloud-analysis-gh-result.png)
***Figure 1:*** *Result of Sonar Cloud analysis now includes code coverage*

If you want to really be sure that code coverage is running inside the action, just check the log to find **importing log for code coverage as shown in Figure 2**.

![Output of scanner analyzer shows that code coverage result was found and analyzed](../images/gh-code-coverage-logs.png)
***Figure 2:*** *Output of scanner analyzer shows that code coverage result was found and analyzed*

The nice aspect of this approach is **the ability to test everything locally with the help of PowerShell IDE (ISE, VSCode)**, you can simply modify/debug your script until it does what you want and once it is done, simply invoke it from the action and commit everything.

Gian Maria.
