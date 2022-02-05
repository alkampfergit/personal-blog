---
title: "Symbol server made easy with Azure DevOps"
description: "If you have a library you reuse internally in your organization, you need to use a symbol server to easy debugging experience of your developers"
date: 2022-02-05T08:13:30+00:00
draft: false
tags: ["programming", "dotnet"]
categories: ["programming"]
---

I've blogged in the past about [symbol server](https://www.codewrecks.com/post/old/2013/07/manage-symbol-server-on-azure-or-on-premise-vm-and-tf-service/), to recap here is the scenario.

In your organization you have some sort of **common .NET code that is shared between projects**, but you have to face and resolve some problems.

1. How to compile dlls
1. How to distribute dlls
1. How to make debugging easier for the user of the dll.

We have clearly some standard solution for all the parts. 

## Compiling dll

> You MUST compile dll in a build server.

The first point is clear, **you MUST create a continuous integration pipeline that build dlls** so you can have reproducible builds. I usually use [Azure Pipelines](https://docs.microsoft.com/en-us/azure/devops/pipelines/get-started/what-is-azure-pipelines?view=azure-devops) for this purpose.

I've started doing this almost 12 years ago, starting with TFVC, and I've been using it for a while.

## Distributing dll

You should use Nuget, but, you can simply tells developer **to look at pipeline output and grab compiled dll directly from the artifact of a build**. Clearly nuget has a better experience, but **it does not adds any magic, it just makes locating and using dll easy**. 

![Pipeline output includes artifacts](../images/artifacts-pipeline.png)

***Figure 1***: *Pipeline output includes artifacts*

By default a pipeline will publish all dll and pdb files to the build server, so you can **download from the build output**.

![Download the dll from pipeline artifacts detail](../images/artifacts-details-pipeline.png)

***Figure 2***: *Download the dll from pipeline artifacts detail*

Now you can simply **download that dll, reference from your project and debug**.

## Debugging dll

If you create a standard pipeline for TFVC (I know, Git is better :D but this is a revamp of old code), it **will include for you a nice debug experience because it will index for you the pdb files**.

![Default pipeline will publish everything for you](../images/publish-artifacts.png)

***Figure 3***: *Default pipeline will publish everything for you*

This is a classic Azure DevOps pipeline (I know, you should use YAML :D but this is a revamp of 10 years old code). The interesting part is point (1), where **indexing and publishing of symbols takes place**. This is really important, you can publish symbols to network share, or you can publish with IIS but, frankly, **Azure DevOps has an integrated symbol server that makes everything easier**. Just go to Visual Studio debugging options, and configure your Azure DevOps accounts as symbol server, that is everything you need to do.

![Configure Visual Studio to use Azure DevOps as symbol server](../images/configure-symbols-in-vs.png)

***Figure 4***: *Configure Visual Studio to use Azure DevOps as symbol server*

## How everything works.

I'm simply downloading the dll from the build artifacts output and references from a project

{{< highlight xml "linenos=table,linenostart=1" >}}
<Project Sdk="Microsoft.NET.Sdk">

  <PropertyGroup>
    <OutputType>Exe</OutputType>
    <TargetFramework>net48</TargetFramework>
  </PropertyGroup>

  <ItemGroup>
    <PackageReference Include="ProximoUtilities" Version="0.6.0-dateoperators0013" />
  </ItemGroup>

  <ItemGroup>
    <Reference Include="LogLibrary">
      <HintPath>R:\Downloads\LogLibrary.dll</HintPath>
    </Reference>
  </ItemGroup>

</Project>
{{< /highlight >}}

Nothing fancy, and **I've not downloaded the LogLibrary.pdb files from artifacts, I've downloaded only the .dll file**. Now I can simply start debugging and I'm able to look at the code of the library **even if I have only the dll**.

![I'm debugging LogLibrary code, only referencing the .dll file](../images/debugging-library.png)

***Figure 5***: *I'm debugging LogLibrary code, only referencing the .dll file*

> Fore some people it seems like magic, just reference a Dll and I'm able to debug the code?????

There is no magic, here is what happens **thanks to Azure DevOps pipeline**. During the execution of the pipeline, Azure DevOps does two main things in the Publish Symbols path step.

1. It modifies the .pdb files including information on **the exact version of the code used to compile the dll, this is the TFVC changeset and TFVC file path**
2. Upload those modified .pdf files inside Azure DevOps **symbol server**.

Since you have configured Visual Studio to use Azure DevOps as symbol server (**Figure 4**), When Visual Studio Loads the .dll during debugging, it uses an unique identifier **of the dll to ask to symbol server to download the corresponding .pdb file**. If you open that .pdb file you can see, even if it is binary, that some part are textual **and contains information on where to locate the source**

![Indexed .pdb file](../images/pdb-indexed.png)

***Figure 6***: *Indexed .pdb file*

Normally in .pdb files the compiler writes local path of the files that produces that symbol, indeed in **Figure 6 you can see that the file is s:\a\_work ... that is the path of my build server**, but then, after that part a special section **starting with \*VSTFSSERVER\* starts containing TFVC path of the file as well as the exact changeset**.

> This means that during debugging, Visual Studio can query Azure DevOps to get **THE EXACT VERSION OF THE FILE USED TO GENERATE THAT SPECIFIC DLL** giving you the **ultimate debugging experience**.

Even if library developers will modify the code, publishing other version of the LogLibrary.dll, your Visual Studio can **Determine the exact version of the code used to compile it and grab the exact version from Azure DevOps so you can debug original code even if the dll is 10 years old**.

And everything comes for free, Thanks to Azure DevOps pipeline and support for Symbol server.

Gian Maria.

