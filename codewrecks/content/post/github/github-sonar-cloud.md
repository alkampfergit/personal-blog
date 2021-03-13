---
title: "Sonar Cloud analysis in GitHub"
description: "How to use GitHub actions to analyze code with Sonar Cloud"
date: 2021-03-13T08:00:00+02:00
draft: false
tags: ["sonarcloud"]
categories: ["github"]
---

Well, you know me, I like to have my code analyzed by SonarCloud when possible, and since it is free for open source, I always use Azure DevOps pipeline to **automatically analyze code on each push**. Now that GitHub actions are available, a good solution is to simply **use GitHub actions to analyze code, without disturbing Azure DevOps**.

> Azure DevOps pipelines are, in my opinion, more mature than GitHub actions, but for small tasks, it is simpler to go with Actions.

Using GitHub actions avoid the need to have an Azure DevOps organization, connect to GitHub and have your pipeline in another environment. **For big projects it makes sense, but for small repositories with a bunch of open source code, using actions is the way to go**.

Thanks to great work made by Sonar Cloud, if you create a new project, **Sonar Cloud asks you location of the repository, and clearly GitHub is one of the options**

![Choose GitHub repository when you create a new Sonar Cloud project](../images/sonarcloud-new-repo.png)
***Figure 1:*** *Choose GitHub repository when you create a new Sonar Cloud project*

Once you have selected your repository, SonarCloud tries to setup automatic analysis, but it does not work for a C# project, based on compiled language. Since we need to compile the project, the wizard suggests the use of some Continuous Integration Engines, and **the first choice is GitHub Acions**.

![Sonar Cloud propose GitHub actions if automatic analysis is not possible](../images/sonarcloud-propose-actions.png)
***Figure 2:*** *Sonar Cloud propose GitHub actions if automatic analysis is not possible*

To perform analysis, we need to use a Java based tool to perform some tasks after we compiled solution code; GitHub Actions are perfect match for this kind of job.

> To analyze a project with a compiled language, you need some CI engine that automates the mundane task to configure and run Sonar Cloud analyzer-

Once you choose GitHub actions, Sonar Cloud wizard asks you to add a secret to you repository.

![A wizard walks you into setting your GitHub Action to analyze the project](../images/repository-secret.png)
***Figure 3:*** *A wizard walks you into setting your GitHub Action to analyze the project*

In the next step, Sonar Cloud **gives you a complete GitHub action file to perform the analysis**, you can start from this file and customize it for your need, or you can simply copy all needed tasks into an existing action. You can also have more than one action, so you can setup an entire new action **just to perform Sonar Cloud analysis**.

![Sample GitHub actions file to analyze the project](../images/sonarcloud-actions-file-sampe.png)
***Figure 4:*** *Sample GitHub actions file to analyze the project*

You just need to create an action file inside .github/workflows directory and complete the action **with the necessary tasks to build your code with language used**.

![Just add commands to build your code and you are ready to go](../images/sonarcloud-build-your-code.png)
***Figure 5:*** *Just add commands to build your code and you are ready to go.*

For a simple .NET core project, you can simply add an action that ensure the right version of .NET core is installed, then change the \<your build command\> section of SonarCloud sample file to add the classic dotnet restore,build,test and you are finished. 

This is the step to ensure that you have desired version of .NET core.

{{< highlight yaml "linenos=table,linenostart=1" >}}
    - name: Setup dotnet
    uses: actions/setup-dotnet@v1
    with:
        dotnet-version: 5.0.x
{{< /highlight >}}

And this one is the piece of PowerShell script you need to customize **on pre-generated action file of Sonar Cloud**.

{{< highlight yaml "linenos=table,hl_lines=4-7,linenostart=1" >}}
run: |
    .\.sonar\scanner\dotnet-sonarscanner begin /k:"alkampfergit_DotNetCoreCryptography" /o:"alkampfergit-github" /d:sonar.login="${{ secrets.SONAR_TOKEN }}" /d:sonar.host.url="https://sonarcloud.io"
    
    # Now restore packages and build everything.
    dotnet restore src/DotNetCoreCryptography.sln
    dotnet test src/DotNetCoreCryptography.sln --collect "Code Coverage"
    dotnet build src/DotNetCoreCryptography.sln --configuration release

    .\.sonar\scanner\dotnet-sonarscanner end /d:sonar.login="${{ secrets.SONAR_TOKEN }}"
{{< /highlight >}}

Push your changes to your repository and you should immediately start seeing results in Sonar Cloud.

> Thanks to tight integration between Sonar Cloud and GitHub, setting up an action to analyze your code is just a matter than no more than 5 minutes.

Even if GitHub actions are less powerful than Azure DevOps pipeline, they are optimal for standard CI work like this, especially **if you have a good integration that gives you a precise set of steps to follow to accomplish your goal**.

GitHub actions have also some nice tasks to ensure prerequisites on the machine running the action, as an example, Sonar Cloud code starts with a task to ensure JDK is installed in the machine.

{{< highlight yaml "linenos=table,linenostart=1" >}}
steps:
    - name: Set up JDK 11
    uses: actions/setup-java@v1
    with:
        java-version: 1.11
{{< /highlight >}}

> Task that automatically installs pre-requisites are the perfect solution to minimize the pain of preparing agents.

This kind of pre-made steps are a blessing **because remove the need to have preinstalled software in build machines**. In the past, preparing an agent for a build with some other tools could be not so easy, especially if you need to have agents that are capable to build different software. Both GitHub actions and Azure DevOps pipelines have some nice tasks to install prerequisites on build agent.

Gian Maria.
