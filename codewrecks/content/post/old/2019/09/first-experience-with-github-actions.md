---
title: "First Experience with GitHub Actions"
description: ""
date: 2019-09-26T15:00:37+02:00
draft: false
tags: [Github,GitHub Actions]
categories: [GitHub]
---
GitHub [actions](https://github.com/features/actions)  **is the new CI/CD system created by GitHub that allows you to build and release your software with a simple workflow defined in YAML file**. Actually it is in beta, but you can simply request to be enlisted and your account will be enabled so you can try it in preview.

Actions engine is based on a yaml definition that is stored directly in code, there are lots of predefined actions made by GitHub team as well as custom actions that can be developed by the community.The real power rely on the fact that you can use simply use command line and docker commands, making the creation of a release a simple and smooth process.

Adding a new workflow is really simple, just open the Actions tab of the repository, then ask to create a new worfklow:

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2019/09/image_thumb-26.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2019/09/image-26.png)

 ***Figure 1***: *Create new workflow for GitHub action directly from repository page.*

This will simply create a new yml file in a directory called.github and you can immediately start editing the build. The syntax is really simple and it aims to simplicity rather than complexity. The vast majority of tasks can be simple accomplished inserting command line arguments.

> My first impression is that the strongest point of GitHub actions is simplicity and easy to use.

Here is the first part of workflow definition:

{{< highlight bash "linenos=table,linenostart=1" >}}


name: NStore CI

on: [push]

jobs:
  build:
    runs-on: ${{ matrix.os }}
    strategy:
      matrix:
        dotnet: ['2.2.401', '3.0.100-preview9-014004'] 
        os: ['ubuntu-latest']
    name: Build for.NET ${{ matrix.dotnet }}
    steps:

{{< / highlight >}}

You can find complete workflow syntax [at this page](https://help.github.com/en/articles/workflow-syntax-for-github-actions), but here is the explanation of my workflow.  **First of all on: [push] directive asks for continuous integration (run action for each push), then a list of jobs follows**.

First and only job for this example is called build and it could run on different operating system. This is a nice feature of actions called matrix:  **you can define array of values and use those arrays in workflow definition to have it run multiple time, once for each parameter combination.** Array of values are defined inside the strategy.matrix section, where I defined two distinct set of parameters, dotnet (version of dotnet core used to build) and os (type of machine where my action should be run). For this example I’m going to use only framework version as matrix value.

Runs-on step define OS, for this example I’m using ubuntu-latest. Finally I give a name to the job:  **Build for.NET following the actual version of matrix.dotnet value**. When I push the code I can verify that two distinct jobs are scheduled.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2019/09/image_thumb-27.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2019/09/image-27.png)

 ***Figure 2***: *Two distinct job where scheduled, one for each matrix version.*

This is a really nice feature because  **we can specify a single workflow and have GitHub action engine run it with different configuration**.

> Thanks to Matrix configuration a single job can be run for many different combination of input parameters.

A job is simply composed by different steps, for my solution, I wants only to build my solution and run some tests agains Microsoft Sql Server and MongoDb

{{< highlight bash "linenos=table,linenostart=1" >}}


steps:     
    - uses: actions/checkout@v1
    - name: Setup.NET Core
      uses: actions/setup-dotnet@v1
      with:
        dotnet-version: ${{ matrix.dotnet }}
    - name: Build with dotnet
      run: dotnet build src/NStore.sln --configuration Release
    - name: Start Docker for MSSSql
      run: docker run -e 'ACCEPT_EULA=Y' -e 'SA_PASSWORD=sqlPw3$secure' -e 'MSSQL_PID=Developer' -p 1433:1433 --name msssql -d mcr.microsoft.com/mssql/server:2017-latest-ubuntu
    - name: Start Docker for Mongodb
      run: docker run -d -p 27017:27017 mongo
    - name: Dump mssql docker logs
      run: docker logs msssql
    - name: Run Tests - Core
      run: dotnet test src/NStore.Core.Tests/NStore.Core.Tests.csproj --configuration Release --no-build

    - name: Run Tests - Domain
      run: dotnet test src/NStore.Domain.Tests/NStore.Domain.Tests.csproj --configuration Release --no-build
    - name: Run Tests - MongoDb
      env:
        NSTORE_MONGODB: mongodb://localhost/nstore
      run: dotnet test src/NStore.Persistence.Mongo.Tests/NStore.Persistence.Mongo.Tests.csproj --configuration Release --no-build
    - name: Run Tests - MsSql
      env:
        NSTORE_MSSQL: Server=localhost;user id=sa;password=sqlPw3$secure
      run: dotnet test src/NStore.Persistence.MsSql.Tests/NStore.Persistence.MsSql.Tests.csproj --configuration Release --no-build
    - name: Dump mssql docker logs after tests
      run: docker logs msssql
    - name: Run Tests - Sql Lite
      run: dotnet test src/NStore.Persistence.Sqlite.Tests/NStore.Persistence.Sqlite.Tests.csproj --configuration Release --no-build 

{{< / highlight >}}

Workflows starts with [actions/checkout@v1](mailto:actions/checkout@v1) a really standard action that simply clone and checkout the code, it is followed by another action that ensure that a specific version of.NET core SDK is installed and configured in the system. **It is declared with the syntax *[uses: actions/setup-dotnet@v1](https://github.com/actions/setup-dotnet)* and allows me to use a specific version of.NET core; this action supports parameters, and is followed by a with: section used to pass parameters. **This is another strong point of GitHub actions, it is really simple to declare and use actions, there is no need to install or reference anything, just reference the action in the right repository and the game is done.

The rest of the repository is a series of steps composed only by a name and a command line instruction. This allows me to simply issue dotnet command to restore, build, test my solution.

Another cool aspect of Actions is that Docker is available inside the machine, this allows me to run a couple of containers: SQL Server and MongoDb, to run my tests during a build. This is super cool, because it allows me to use Docker to create all prerequisites that I need for my build.

> Having Docker inside the machine that runs actions is a real blessing because it allows to run integration tests.** My first impression is quite positive, with just a bunch of Yaml code I was able to create a workflow to build and run tests for my project  **(I spent a quite good amount of time to have MsSql container work, but this is another story).

Another good aspect of Actions is the ability to see real-time log of your run directly from a browser, without the need of installing anything.

A final real nice aspect of Actions is that they are defined by conventions inside a special folder.github/workflows;** I’ve developed this build in a fork of the original project, then I issued a pull request and when the pull request was accepted, this new workflows appears in the original repository. **[![image](https://www.codewrecks.com/blog/wp-content/uploads/2019/09/image_thumb-28.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2019/09/image-28.png)** Figure 3: ***After pull request was merged, immediately the workflow is up and running on target repository..*

Clearly this is still a beta and there are still part that should be improved. First of all, if a test run fails, the build is marked as failed and you need to look at test logs to understand which tests failed.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2019/09/image_thumb-29.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2019/09/image-29.png)

 ***Figure 3***: *Build failed, but to understand why it failed you need to check the logs.*

This is the reason why I included a distinct test step for each test assembly, instead of a simple dotnet run on the entire solution. Using this little trick I can at least understand which test run failed.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2019/09/image_thumb-30.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2019/09/image-30.png)

 ***Figure 4***: *Action run result, each failed step is marked with a red cross*

Clicking on failed step, you can find the output log of the step, needed to understand which tests failed and why. For those of you used to Azure DevOps pipeline, you will surely miss the nice Test Result page, but I’m expecting GitHub actions to close the gap in this area.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2019/09/image_thumb-31.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2019/09/image-31.png)

 ***Figure 5***: *Action step run detail.*

Another problem I found (but I need to investigate more) is that docker seems not to be available on MacOS Machine. If I run previous build on MacOS I got a docker command not found.

You only need to enlist in beta and start playing with Actions, you will surely find a good use for them.

Gian Maria.
