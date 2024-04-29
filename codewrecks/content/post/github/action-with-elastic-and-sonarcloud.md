---
title: "GitHub action with ElasticSearch integration tests and SonarCloud"
description: "Being able to run integration tests in GitHub actions is a great feature, thanks to services you can run whatever docker image you need to run your integration scripts."
date: 2024-04-23T08:00:00+02:00
draft: false
tags: ["GitHub", "GitHub Actions"]
categories: ["continuous integration"]
---

I blogged in the past on how you can Analyze you code with SonarCloud [in a GitHub action](https://www.codewrecks.com/post/github/github-sonarcloud-codecoverage/). Things changed a little in the latest year but in this post I want to examine a different aspect **running tests that rely on external service, like ElasticSearch**. Running integration test in GH action is a little more complex than running unit tests, because you need to **setup the environment but thanks to docker usually this can be done with a little effort**.

Lets examine how we can create a GH action to run integration tests that relies on ElasticSearch. 

{{< highlight yaml "linenos=table,hl_lines=7-12,linenostart=1" >}}
jobs:
  build:
    name: Build
    runs-on: ubuntu-latest
    timeout-minutes: 5

    services:
      elasticsearch:
        image: docker.elastic.co/elasticsearch/elasticsearch:8.13.0
        ports:
          - 9800:9200
        options: --health-cmd="curl http://localhost:9200/_cluster/health" -e "discovery.type=single-node" -e "xpack.security.enabled=false"
{{< /highlight >}}

As you can see, before starting to declare **job steps, I've added a services section where I can specify services that are needed to run this action**. In this example I have only one service, called elasticsearch: that is **based on the official docker image of ElasticSearch.** I've also specified that I want to map port 9200 of the container to port 9800 of the host, and I've also specified some options to the container.

Thanks to services, I can specify containers that needs to run before my jobs starts. Then you usually need **to add some steps that wait for the service to be available**. This happens because when the docker instance started, elasticsearch needs some time to become operational. Generic service node has no way to know if its internal service is operative. The result is using a simple step **that uses PowerShell core code to wait for the base ElasticSearch url to answer a successful code**. This is a matter of few lines of PowerShell code. **Since this is powershell code (shell: pwsh) it runs perfectly even on ubuntu machines.**

{{< highlight yaml "linenos=table,linenostart=1" >}}
      - name: Wait for Elasticsearch to be ready
        shell: pwsh
        run: |
          $uri = "http://localhost:9800"
          $timeoutSeconds = 120
          $intervalSeconds = 5
          $sw = [Diagnostics.Stopwatch]::StartNew()
          while ($sw.elapsed.totalseconds -lt $timeoutSeconds) {
              try {
                  $response = Invoke-WebRequest -Uri $uri -Method Get -ErrorAction Stop
                  if ($response.StatusCode -eq 200) {
                      Write-Host "Successfully connected to $uri"
                      Write-Host "Response content: $($response.Content)"
                      $sw.Stop()
                      return
                  }
              }
              catch {
                  Write-Host "Failed to connect to $uri. Retrying in $intervalSeconds second(s)..."
                  Start-Sleep -Seconds $intervalSeconds
              }
          }
          $sw.Stop()
          throw "Could not connect to $uri within $timeoutSeconds second(s)."
{{< /highlight >}}

This is what you see when your action runs. As you can see you can also verify basic information about the version of elasticsearch that got deployed. Action runners are quite fast, so I usually do not see wait cycles, but it happened **and this simple step makes sure that the service is up and running before running the tests**.

![Wait for Elasticsearch action screenshot](../images/wait-for-elastic-action.png)
***Figure 1:*** *Wait for Elasticsearch action screenshot*

Now after this action complete, elasticsearch is up and operational, so I can run my PowerShell core script that builds the solution, executes the tests, collect code coverage and so on. 

{{< highlight yaml "linenos=table,linenostart=1" >}}

      - name: Cache SonarCloud packages
        uses: actions/cache@v3
        with:
          path: ~\sonar\cache
          key: ${{ runner.os }}-sonar
          restore-keys: ${{ runner.os }}-sonar

      - name: Cache SonarCloud scanner
        id: cache-sonar-scanner
        uses: actions/cache@v3
        with:
          path: .\.sonar\scanner
          key: ${{ runner.os }}-sonar-scanner
          restore-keys: ${{ runner.os }}-sonar-scanner

      - name: Build and analyze
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}  # Needed to get PR information, if any
          SONAR_TOKEN: ${{ secrets.SONAR_TOKEN }}
        shell: pwsh
        run: |
          dotnet tool run dotnet-sonarscanner begin /k:"alkampfergit_KernelMemory.Elasticsearch" /o:"alkampfergit-github" /d:sonar.token="${{ secrets.SONAR_TOKEN }}" /d:sonar.host.url="https://sonarcloud.io" /d:sonar.cs.vstest.reportsPaths=TestResults/*.trx /d:sonar.cs.opencover.reportsPaths=TestResults/*/coverage.opencover.xml /d:sonar.coverage.exclusions="**Test*.cs"
          
          ./build.ps1
          
          dotnet tool run dotnet-sonarscanner end /d:sonar.token="${{ secrets.SONAR_TOKEN }}"
{{< /highlight >}}

In previous action snippet I have three steps that runs sonarcloud scanning. **First two are used to setup everything while the third actually performs the analysis.** As you can see all the build is done with a build.ps1 script, where I simply run all dotnet command line tool to build solution and to run the test with the appropriate code coverage. Having everything in a **single script tremendously simplify the build process because I can test locally and I can reuse the very same script in other GitHub actions**.

Running test in the Build script needs to take care of code coverage if you want to add code coverage to the analysis.

{{< highlight powershell "linenos=table,linenostart=1" >}}
dotnet test "src/KernelMemory.ElasticSearch.FunctionalTests/KernelMemory.ElasticSearch.FunctionalTests.csproj" `
    --collect:"XPlat Code Coverage" `
    --results-directory TestResults/ `
    --logger "trx;LogFileName=unittests.trx" `
    --no-restore `
    -- DataCollectionRunSettings.DataCollectors.DataCollector.Configuration.Format=opencover
{{< /highlight >}}

This shows you how flexible GitHub actions are, thanks to **services you can run whatever docker image you need to run your integration scripts**, just by specifying images and configuration. This is a real lifesaver when you need to run **integration tests that rely on databases or external services**.

Gian Maria.
