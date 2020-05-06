---
title: "How to run x86 Unit Test in a .NET core application"
description: Strange errors happened if you try to test dotnetcore project compiled for x86 architecture
date: 2020-05-067T21:45:18+02:00
draft: false
tags: ["UnitTesting"]
categories: ["developing"]
---

We have a standard .NET standard solution with some projects and some Unit Tests, **everything runs perfectly until we have the need to force compilation of one of the project in x86**. This can be done with RuntimeIdentifier tag in project file.

{{< highlight xml >}}
<Project Sdk="Microsoft.NET.Sdk">

  <PropertyGroup>
    <TargetFramework>netcoreapp3.1</TargetFramework>
    <RuntimeIdentifier>win-x86</RuntimeIdentifier>
  </PropertyGroup>

{{</ highlight>}}

After this modification **tests started to fail with an error** that is clearly directly related to the change in runtime, but was highly unexpected.

```
System.BadImageFormatException : 
Could not load file or assembly 'xxxxx, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null'. 
An attempt was made to load a program with an incorrect format.
```

This is an error that happens when a **project running in x64 is trying to load a program that was explicitly compiled to run only in x86 version (32 bit)**. The very same error happened if we run *dotnet test* in command line. We tried using the same RuntimeIdentifier on test project, but the situation is even worse, tests disappeared from test runner, test adapter was not even capable of scanning the assembly looking for tests. It seems that Visual Studio was not able to run tests compiled in x86.

After some investigation it turns out that if you want to run test for an assembly that target x86 architecture, **you should use x86 version of dotnet.exe tool.** To verify this assumption we tried to run test with commandline dontnet.exe tool using standard --runtime option

```shell
dotnet test --runtime win-x86
```

Tests become green again, confirming us that this is indeed the right solution. Now the remaining problem is: **how to configure Visual Studio to run test in x86 mode.** The only obvious solution is to use a runsettings file, a type of file that was present in Visual Studio for a really long time, whose purpose is to configure test environment.

> Whenever you need to customize how Visual Studio is running tests, you probably need a .runsettings file.

We created a test.runsettings file at the root of the solution (We have more than one test projects) with this simple content.

{{< highlight xml >}}
<?xml version="1.0" encoding="utf-8"?>
<RunSettings>
  <!-- Configurations that affect the Test Framework -->
  <RunConfiguration>

    <!-- x86 or x64 -->
    <!-- You can also change it from the Test menu; choose "Processor Architecture for AnyCPU Projects" -->
    <TargetPlatform>x86</TargetPlatform>

  </RunConfiguration>
</RunSettings>
{{</ highlight>}}

The only special settings is the TargetPlatform that forces running test in x86. To simplify configuration, instead of requiring all developers to choose that settings before running tests, **we use a little know feature (I've discovered today) that allows you to specify runsettings file directly inside a project file.**

{{< highlight xml "linenos=table,hl_lines=6,linenostart=1" >}}
<Project Sdk="Microsoft.NET.Sdk">

  <PropertyGroup>
    <TargetFramework>netcoreapp3.1</TargetFramework>
    <IsPackable>false</IsPackable>
    <RunSettingsFilePath>$(MSBuildProjectDirectory)\..\..\..\test.runsettings</RunSettingsFilePath>
  </PropertyGroup>
{{</ highlight>}}

Thanks to RunSettingsFilePath we could specify that for that specific test project, we want test runner to use specified runsettings file (line 6). Using relative path respect project directory will allow using a single runsettings file for all tests project. Once test projects are modified, a simple rebuild should fix all the tests.

All tests are now green again.

Gian Maria.
