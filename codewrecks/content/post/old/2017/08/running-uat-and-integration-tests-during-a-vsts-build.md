---
title: "Running UAT and integration tests during a VSTS Build"
description: ""
date: 2017-08-05T07:00:37+02:00
draft: false
tags: [build,Testing,UAT,VSTS]
categories: [Azure DevOps,Visual Studio ALM]
---
There are a lots of small suggestions I’ve learned from experience when it is time to create a suite of integration / UAT test for your project.  **A UAT or integration test is a test that exercise the entire application, sometimes composed by several services that are collaborating to create the final result.** The difference from UAT tests and Integration test, in my personal terminology, is that the UAT uses direct automation of User Interface, while an integration tests can skip the UI and exercise the system directly from public API (REST, MSMQ Commands, etc).

## The typical problem

When it is time to create a solid set of such kind of tests, having them to run in in an automated build is a must, because it is really difficult for a developer to run them constantly as you do for standard Unit Tests.

 **Such tests are usually slow** , developers cannot waste time waiting for them to run before each commit, we need to have an automated server to execute them constantly while the developer continue to work.

 **Those tests are UI invasive** , while the UAT test runs for a web project, browser windows continues to open and close, making virtually impossible for a developer to run an entire UAT suite while continue working.

 **Integration tests are resource intensive** , when you have 5 services, MongoDB, ElasticSearch and a test engine that fully exercise the system, there is little more resource available for doing other work, even if you have a real powerful machine.

> Large sets of Integration / UAT tests are usually really difficult to run for a developer, we need to find a way to automate everything.

Creating a build to run everything in a remote machine can be done with VSTS / TFS, and here is an example.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2017/08/image_thumb-2.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2017/08/image-2.png)

 ***Figure 1***: *A complete build to run integration and UAT tests.*

The build is simple, the purpose is having a dedicated Virtual Machine with everything needed to run the software already in place. Then  **the build will copy the new version of the software in that machine, with all the integration test assemblies and finally run the tests on the remote machine**.

> Running Integration and UAT test is a task that is usually done in a different machine from that one running the build. This happens because that machine should be carefully prepared to run test and simplify deployment of the new version.

## 

## Phase 1 – Building everything

First of all I have the phase 1, where I compile everything. In this example we have a solution that contains all.NET code, then a project with Angular 2, so we first build the solution, then npm restore all the packages and compile the application with NG Cli, finally I publish a couple of Web Site. Those two web sites are part of the original solution, but I publish them separately with MSBuild command to have a full control on publish parameters.

 **In this phase I need to build every component, every service, every piece of the UI needed to run the tests. Also I need to build all the test assemblies.** ## Phase 2 – Pack release

In the second phase I need to pack the release, a task usually accomplished by a dedicated PowerShell script included in source code. That script knows where to look for dll, configuration files, modify configuration files etc, copying everything in a couple of folders: masters and configuration. In the masters directory we have everything is needed to run everything.

To simplify everything,  **the remote machine that will run the tests, is prepared to accept an XCopy deployment**. This means that the remote machine is already configured to run the software in a specific folder. Every prerequisite, everything is needed by every service is prepared to run everything from a specific folder.

This phase finish with a couple of Windows File Machine copy to copy this version on the target computer.

## Phase 3 – Pack UAT testing

This is really similar to Phase 2, but  **in this phase the pack PowerShell scripts creates a folder with all the dll of UAT and integration tests** , then copy all test adapters (we use NUnit for UnitTesting). Once pack script finished, another Windows File Machine Copy task will copy all integration tests on the remote machine used for testing.

## Phase 4 – Running the tests

This is a simple phase, where you use Deploy Test Agent on test machine followed by a Run Functional Test tasks. Please be sure always place a Deploy Test Agent task before EACH Run Functional Test task as described in [this post that explain how to Deploy Test Agent and run Functional Tests](http://www.codewrecks.com/blog/index.php/2017/07/14/deploy-test-agent-and-run-functional-test-tasks/)

## Conclusions

For a complex software, creating an automated build that runs UAT and integration test is not always an easy task and in my experience  **the most annoying problem is setting up WinRm to allow remote communication between agent machine and Test Machine.** If you are in a Domain everything is usually simpler, but if for some reason the Test Machine is not in the domain, prepare yourself to have some problem before you can make the two machine talk togheter.

In a next post I’ll show you how to automate the run of UAT and Integration test in a more robust and more productive way.

Gian Maria.
