---
title: "Test error but build green when test are re-run"
description: "If you got a green pipeline result but you have Test Error in summary, this is probably caused by re-run of flaky tests."
date: 2020-04-23T19:12:42+02:00
draft: false
categories: ["AzureDevops"]
tags: ["AzDo", "Pipeline"]
---

Suppose you have a result of an Azure DevOps Pipeline that contains this strange result: you have a clear indication that test run failed (1), but the overall build is green, both the entire build (2) and the single stage (3).

![Confusing result of a build](../images/re-run-result.png)

***Figure 1:*** *Confusing result of a build*

In such a situation you wonder what happened, the overall build is green, but **the clear indication that test run failed gives you some bad feeling that something was not really ok.** In this situation the problem is that, if you click on Test Run Failed error message you will be redirected to a clear log that states that test run failed.

![Test failure detail](../images/detail-test-failed.png)

***Figure 2:*** *Even more confusing information for build detail*

As you can see from **Figure 2** the step is green (1)(2), but in the log you have a clear error that states that Test run Failed.

> When you have such confusing indication you got lost, because you do not know if you can trust the result or not.

The key point is that, whenever something bad happens related to test in Azure DevOps pipeline, you should troubleshoot by the appropriate test result page of build result. **From that page you are able to have detailed information on what is the overall outcome of the tests**.

![Flaky test](../images/flacky-tests.png)

***Figure 3:*** *Test detail results*

From detail result you can see that you have an annotation *"Passed on rerun (1)" (1)*. This feature is a really nice one of AzDo Pipelines that **allows you to re-execute all the tests that failed on the first run.** This feature is really cool, because if you have some flaky tests that sometimes pass sometimes not, re-executing them will generate a more stable build.

If you look at **Figure 3** you can in fact check that indeed one the test was re-executed (1) and **if you filter all re-executed tests you can find the details that all tests that failed on the first run (2).**

> The ability to re-run failed test is really nice and gives you stable build even with erratic tests.

Clearly you should be alerted when some tests failed the first run, because you should fix your test removing the erratic behavior, but instead of clearly raise a warning or error in the summary telling you : "Some of the tests failed on the first run, check test result page for details", you only got a **Test run failed that gives you the sensation that something went wrong**.

If you continue scrolling in detailed log result, you can find that indeed there was a second test run to re-run the test that failed in the first run.

![Log of re runned tests](../images/re-run-log-test.png)

***Figure 4:*** *Re-run log in Run test task output*

From **Figure 4** you can indeed verify that failed test of the first run got re-executed in a second run, where it is the only test executed. This second run is ok so the build was really green, **the only problem is that you have an erratic test**. When this happen you have also some inconsistencies on the summary number as you can verify in **Figure 5**.

![Inconsistencies in the summary](../images/test-result-inconsitencies.png)

***Figure 4:*** *Inconsistencies in the summary*

The real number is the big one to the left (544 total tests) but the summary is wrong because **it reports only the result of the second run, where only the flaky test was run.**

As a take-away from this post **I strongly suggest you to first look at Tests tab in detail page before going checking raw logs to troubleshoot test related errors**. Test summary page will give you a more compact and correct vision of test result, a much better alternative than looking to raw logs, especially if tests got re-executed due to flaky tests, because logs are more complex to read.

Gian Maria.
