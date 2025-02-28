---
title: "SonarCloud analysis in GitHub Actions"
description: "Build, run test against a database and analyze everything with Sonar Cloud is easy with GitHub action for a dotnet project. Let's see how."
date: 2025-02-08T06:00:00+02:00
draft: true
tags: ["GitHub"]
categories: ["coding"]
--- 

Running Sonar Cloud analysis on your open source project is usually a good thing, it is free, it **gives you tons of useful information** and you can automate everything for free with **GitHub Actions**.

I've dealt with this ckind of functinoality before in my blog, today I want just to show how to create a GH action that works in linux, because usually if you **take the original action from SonarCloud site it will use a windows machine for building**.

What is wrong with Windows machine for Analysis? Usually nothing, unless you want to run tests where you have **integration tests that depends on external databases or external services.** In such a scenario the usual question is: how can I run test against a SQL Server database if my tests runs in a GH action agent machine, where there is a series of tools preinstalled but clearly we could not have any type of database? The answer is simple: docker.

First of all I disabled the automatic analysis, since my account of Sonar Cloud is connected to my GitHub account, Sonar Cloud is able to perform automatic Analysis. Believe me, automatic analysis is good, but if you have your test suite it is good to run during a sonar analysis to have some nice metrics, like code coverage for example. If you need to have some external service to run integratino tests, you need to do a custom analysis, because the automatic one ill not be able to do anything .

![Disable automatic analysis if you are going to analyze the project with GitHub Actions](../images/first-detailed-prompt.png)***

***Figure 1:*** *SDisable automatic analysis if you are going to analyze the project with GitHub Actions*

With docker you can add a section in your GH Action that simply identify a required services taht is needed to run the action.

{{< highlight markdown "linenos=table,linenostart=1" >}}
jobs:
  build:
    name: Build
    runs-on: ubuntu-latest

    services:
      sqlserver:
        image: mcr.microsoft.com/mssql/server:latest
        env:
          ACCEPT_EULA: Y
          SA_PASSWORD: PPAssw00rrd
        ports:
          - 1433:1433
{{< /highlight >}}

As you can see, in the jobs sectino you can spèecify a section called **services that contains all the services that are needed to run the build.** Then I usually have a build.ps1 or a **single file build** that can be launched to fully build the solution, run test, prepare nuget packages, everything. This helps creating Continuous Integration tools, because you can simply launch the script and letting it doing everything.

For Sonar Coud you can also create a script that includes also the Sonar Cloud analysis, this allows you **to run analysis locally** but this approach sometimes is annoying, because you risk to pollute project statistics with too much analysis, made in developers machines, in branches you do not want to analyze, etc. This bring  me to the conclusion that I prefer letting sonar cloud analysis happens on the CI script and nowhere else.

Luckly enough the Web interface of Sonar Cloud gives you a nice interface that allows you to download a Github action preconfigured, and you just need to modify for your need. In my situation I have some SQL code to run, and to have a predefined set of data to perform the anlysi ohn I hse the northwind database.

{{< highlight markdown "linenos=table,linenostart=1" >}}
 steps:
      - name: Set up JDK 11
        uses: actions/setup-java@v1
        with:
          java-version: 1.11
      - uses: actions/checkout@v2
        with:
          fetch-depth: 0  # Shallow clones should be disabled for a better relevancy of analysis

      - name: Setup dotnet 9
        uses: actions/setup-dotnet@v1
        with:
          dotnet-version: 9.x

      - name: Download Northwind Script
        run: |
          curl -o instnwnd.sql https://raw.githubusercontent.com/microsoft/sql-server-samples/master/samples/databases/northwind-pubs/instnwnd.sql

      - name: Install SQL Tools
        run: |
          curl https://packages.microsoft.com/keys/microsoft.asc | sudo apt-key add -
          curl https://packages.microsoft.com/config/ubuntu/20.04/prod.list | sudo tee /etc/apt/sources.list.d/msprod.list
          sudo apt-get update
          sudo apt-get install mssql-tools unixodbc-dev -y

      - name: Initialize Northwind Database
        run: |
          /opt/mssql-tools/bin/sqlcmd -S localhost,1433 -U sa -P PPAssw00rrd -Q "CREATE DATABASE Northwind"
          /opt/mssql-tools/bin/sqlcmd -S localhost,1433 -U sa -P PPAssw00rrd -d Northwind -i instnwnd.sql

{{< /highlight >}}

As you can see, after installation of JDK 11 (step created by the wizard of Sonar Cloud) I've added the installation of DotNet 9 and then some bash scripts to download the configuration file for northwind and then run them against my Sql Server instance running in the container. Actually the creation of these steps were made by Visual Studio Codce copilot, using Sonnet 3.7, a really nice experience, and they worked on the first try :).

Once you got the setup you just need to configure everything else. As usual please check all the standard action of GitHub if they have some new version, in this example I needed to updat e the version of the cache actino to versino4, because the original script was using version 2 that is becoming obsolete. Then as you can see I just run my build script with pwsh ./build.ps1 and the game is done.

{{< highlight markdown "linenos=table,linenostart=1" >}}
     - name: Cache SonarCloud packages
        uses: actions/cache@v4
        with:
          path: ~\sonar\cache
          key: ${{ runner.os }}-sonar
          restore-keys: ${{ runner.os }}-sonar
      - name: Install SonarCloud scanners
        run: |
          dotnet tool install --global dotnet-sonarscanner
      - name: Build and analyze
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}  # Needed to get PR information, if any
          SONAR_TOKEN: ${{ secrets.SONAR_TOKEN }}
          SQL_SERVER_TEST_CONNECTION: 'Server=localhost,1433;Database=Northwind;User Id=sa;Password=PPAssw00rrd;Encrypt=True;TrustServerCertificate=True'
        run: |
          dotnet-sonarscanner begin /k:"alkampfergit_SemanticKernel.Orchestration" /o:"alkampfergit-github" /d:sonar.token="${{ secrets.SONAR_TOKEN }}" /d:sonar.host.url="https://sonarcloud.io" /d:sonar.cs.vstest.reportsPaths=TestResults/*.trx /d:sonar.cs.opencover.reportsPaths=TestResults/*/coverage.opencover.xml /d:sonar.coverage.exclusions="**Test*.cs"
          pwsh ./build.ps1

      - name: Finalize SonarCloud analysis
        env:
          SONAR_TOKEN: ${{ secrets.SONAR_TOKEN }}
        if: always()
        run: |
          dotnet-sonarscanner end /d:sonar.token="${{ secrets.SONAR_TOKEN }}"
{{< /highlight >}}

As usual check my previous post xxxxx on how to enable code coverage analysis.


Gian Maria.
