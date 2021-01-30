---
title: "New cool feature of VSTS to limit impact of erratic tests"
description: ""
date: 2018-02-13T18:00:37+02:00
draft: false
tags: [build,UAT,VSTS]
categories: [Azure DevOps]
---
I’ve blogged some time ago about [running UAT testing](http://www.codewrecks.com/blog/index.php/2017/08/17/running-uat-tests-in-a-vsts-tfs-release/) with a mix of Build + Release in VSTS.  **Actually, UAT testing are often hard to write, because they can be erratic**. As an example, we have a software composed by 5 services that collaborates together, CQRS and Event Sourcing, so most of the tests are based on a typical pattern: Do something then wait for something to happen.

> Writing tests that interact with the UI or are based on several services interacting togheter can be difficult.

The problem is: whenever you are “wait for something to happen” you are evoking dragons. Actually we wrote a lot of extensions that helps writing tests, such as WaitForReadModel, that poll the readmodel waiting for the final result of a command, but sometimes those kind of tests are not stable because  **during a full run, some tests are slower or simply they fails because some other tests changed some precondition**.

We spent time to make test stable, but some tests tend to have erratic failure and you cannot spent tons of time to avoid this. When they fails in VS or Nunit console,  **you can simply re-run again only failed tests and usually they pass without a single error**. This is perfectly fine when you are running everything manually, you launch tests in a VM, then come back after a little bit, if some tests failed, just re-run failed test and verify if something was really broken.

 **Erratic tests are really difficult to handle in a build, because if the build was always red because of them, the team tend to ignore build output.** > When a build is often failing due to false-positive, team tend to ignore that build and it starts losing value.

Thanks to a cool new feature in VSTS, we can instruct our builds to re-run automatically those kind of tests. You can read everything about it in [the release notes](https://docs.microsoft.com/en-us/vsts/release-notes/2017/dec-11-vsts) for VSTS.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2018/02/image_thumb.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2018/02/image.png)

 ***Figure 1***: *Option to re-run failed tests*

It could seem a little feature, especially because usually your tests should not be erratic, but actually  **it is a HUGE feature for UAT testing** , when having not erratic test is simply not feasible or a really huge work. Thanks to this feature, the build can automatically re-run failed tests, completely eliminating the problem of erratic tests, and showing as failed only tests that really failed constantly for more than a given amount of runs.

 **Another situation where this feature has tremendous impact is when you want to  migrate a huge set of tests from sequential execution to parallel execution.** If your test were written assuming sequential execution, when you run them in parallel you will have many failures due to interacting tests. You can simply create a build, enable parallel execution and enable re-run failed test. This will simply helps you to spot interacting tests so you can start fixing them so they can run in parallel.

If you look at Figure 2, you can verify that all erratic tests are easily identified, because you can filter all tests that passed on rerun. This will leave your build green, but can spot erratic tests that should be investigated to make them more stable.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2018/02/image_thumb-1.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2018/02/image-1.png)

 ***Figure 2***: *Erratic test can be immediately discovered from build output.*

I think that this feature is really huge and can tremendously helps running UAT and Integration tests in build and releases.

If you do not see the option in figure 1, please be sure you are actually using the version number 2 of the test runner task as shown in Figure 3.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2018/02/image_thumb-2.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2018/02/image-2.png)

 ***Figure 3***: *Be sure to use version 2.\* of the test runner, or the option to re-run failed test is not present.*

Gian Maria.
