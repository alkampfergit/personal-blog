---
title: "GitHub actions templates"
description: "The ability of re-use pieces of actions in various repositories is an invaluable addition to Actions capabilities"
date: 2022-01-07T08:00:00+02:00
draft: false
tags: ["GitHub", "Actions"]
categories: ["GitHub"]
---

GitHub Actions are closing the gap with Azure DevOps pipelines day by day, one of the features introduces months ago was **Action templates, the ability to re-use actions definitions between repositories**. You can read all the detail in [Official GitHub documentation](https://docs.github.com/en/actions/learn-github-actions/creating-starter-workflows-for-your-organization).

Templates are really useful because usually, in one organization, you tend to **use a restricted set of technologies with the very same set of actions to perform to build and release the code**. You already know that I'm a fan of build in PowerShell or other scripting engine, but for simple project, you can simply rely on GitHub actions without resorting to any scripting language.

The scenario is: in these days it is common to have many little repositories, each one implementing a microservice or **a library that will be reused inside the organization**. Lets focus on the second, instead of having a big dll full of utilities, in .NET it is better to create several repositories, focues on special kind of helpers and **publish each set of utilities in a public or private NuGet feed**. If you have lots of utilities, you tend to copy and paste GitHub workflow betweed repositories, because the sequence of steps is almost identical between the various repositories.

A better approach is creating one single template repository and then reuse that repository as **action template in other repositories**.

> Usually many repositories will use the same set of action to build and publish the code, reusing a common workflow is the key of success.

As an example, you can check a simple template workflow that build a dot-net library [in my account](https://github.com/alkampfergit/Workflows/blob/master/.github/workflows/dotnet-library.yml). This specific workflow is really simple, because it is based on a **pre-existing build.ps1 PowerShell file in the root directory**. This example is deliberately really simple becuase its only purpose is showing how you can re-use a workflow in more than one repository.

The workflow is really similar to **a standard GitHub Action, but at the very starts it defined its input and secrets requirements**.

{{< highlight yml "linenos=table,linenostart=1" >}}
on:
  workflow_call:
    inputs:
      coverage_info_dir:
        required: true
        type: string
    secrets:
      NUGET_API_KEY:
        required: true
      AZURE_CLIENT_ID:
        required: true
      AZURE_CLIENT_SECRET:
        required: true
      AZURE_TENANT_ID:
        required: true
{{< /highlight >}}

As you can see this workflow declares some inputs, a standard one that is the directory **where the script will generates code coverage results**, followed by a series of needed secrets, a valid API Key to publish the nuget repository, and a series of **azure secrets needed to run integration tests against azure components**. The beauty of templates is that they explicitly declares what is needed for them to run.

After paramters declaration the workflow proceed with a simple job that contains all the steps needed to build the project. The nice part is in the caller repository

{{< highlight yml "linenos=table,hl_lines=14,linenostart=1" >}}
name: BuildAndPublish_template
on:
  push:
    branches:
      - master
      - develop
      - feature/*
      - hotfix/*
      - release/*
  pull_request: 

jobs:
  call-build-and-publish:
    uses: alkampfergit/workflows/.github/workflows/dotnet-library.yml@master
    with:
      coverage_info_dir: ./src/DotNetCoreCryptography.Tests/TestResults/coverage.info 
    secrets:
      NUGET_API_KEY: ${{ secrets.NUGET_API_KEY }}
      AZURE_CLIENT_ID: ${{ secrets.AZURE_CLIENT_ID }}
      AZURE_CLIENT_SECRET: ${{ secrets.AZURE_CLIENT_SECRET }}
      AZURE_TENANT_ID: ${{ secrets.AZURE_TENANT_ID }}
{{< /highlight >}}

The interesting part is the **uses: instruction that allows you to completely reuse jobs declared in the workflow template in other repositories**. This allows you not only to choose the template to use, but also to specify the branch of template repository to use. This technique gives you lots of advantages.

First of all you can write common jobs in only one place, then **other repositories will only need to use them with uses:**, simple and definitive. Being able to specify branch name, allows you to use to point to branch develop with some canary repositories, while the vast majority will use master. If you need **to change a common workflow in your organization, you can change template file in develop directory, verify that canary repositories still builds fine, then promote the template to master.**

> Being able to choose template branch, allows for canary repository to easy the upgrade of common templates.

The logic of the action is centralized, you can let **members of the teams that are skilled in GitHub Action author template file, while the rest of the teams can simply use pre-made templates with few lines of yaml**.

IF you are using GitHub Actions and still did not explored templates, I strongly suggest you to have a look at them.

Gian Maria.