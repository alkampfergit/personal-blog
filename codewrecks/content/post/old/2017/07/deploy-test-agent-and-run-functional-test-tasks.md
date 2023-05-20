---
title: "Deploy test agent and run functional test tasks"
description: ""
date: 2017-07-14T19:00:37+02:00
draft: false
tags: [build,VSTS]
categories: [Tfs]
---
In VSTS / TFS Build there are a couple of tasks that are really useful to execute UAT or Functional tests during a build.  **The first one deploy the test agent remotely on a target machine while the second one runs a set of tests on that machine using the agent.** If you use multiple Run Functional Test task, please  **be sure that before each task there is a corresponding Deploy test agent tasks or you will get an error.** Actually I have a build that run some functional tests, then I’ve added another Run Functional Test task to run a second sets of functional tests. The result is that the first run does not have a problem, while the secondo one fails with a strange error

{{< highlight bash "linenos=table,linenostart=1" >}}


2017-07-13T17:59:51.1964581Z DistributedTests: build location: c:\uatTest\bus
2017-07-13T17:59:51.1964581Z DistributedTests: build id: 4797
2017-07-13T17:59:51.1964581Z DistributedTests: test configuration mapping: 
2017-07-13T17:59:52.4924710Z DistributedTests: Test Run with Id 1697 Queued
2017-07-13T17:59:52.7134843Z DistributedTests: Test run '1697' is in 'InProgress' state.
2017-07-13T18:00:02.9198747Z DistributedTests: Test run '1697' is in 'Aborted' state.
2017-07-13T18:00:12.9219883Z ##[warning]DistributedTests: Test run is aborted. Logging details of the run logs.
2017-07-13T18:00:13.1270663Z ##[warning]DistributedTests: New test run created.
2017-07-13T18:00:13.1280661Z Test Run queued for Project Collection Build Service (prxm).
2017-07-13T18:00:13.1280661Z 
2017-07-13T18:00:13.1280661Z ##[warning]DistributedTests: Test discovery started.
2017-07-13T18:00:13.1280661Z ##[warning]DistributedTests: UnExpected error occured during test execution. Try again.
2017-07-13T18:00:13.1280661Z ##[warning]DistributedTests: Error : Some tests could not run because all test agents of this testrun were unreachable for long time. Ensure that all testagents are able to communicate with the server and retry again.

{{< / highlight >}}

This happens because the remote test runner cannot be used to perform a second runs if a previous run just finished. The solution is simple, add another Deploy Test Agent task.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2017/07/image_thumb-5.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2017/07/image-5.png)

 ***Figure 1***: *Add a Deploy Test Agent before any Run Functional Tests task*

This solved the problem and now the build runs perfectly.

Gian Maria.
