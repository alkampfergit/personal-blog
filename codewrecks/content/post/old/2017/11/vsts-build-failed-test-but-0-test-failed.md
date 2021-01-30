---
title: "VSTS build failed test phase but 0 tests failed"
description: ""
date: 2017-11-18T09:00:37+02:00
draft: false
tags: [build,Testing]
categories: [Azure DevOps,Team Foundation Server]
---
I had a strange situation where I have a build that suddenly starts  **signal failing tests, but actually zero test failed**.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2017/11/image_thumb.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2017/11/image.png)

 ***Figure 1***: *No test failed, but the test phase was marked as failed*

As you can see in Figure 1, the Test step is marked failed, but actually I have not a single test failed, indeed a strange situation. To troubleshoot this problem, you need to select the failing step to verify the exact output of the task.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2017/11/image_thumb-1.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2017/11/image-1.png)

 ***Figure 2***: *The output of the Test Step action is indeed test failed*

As you can see in Figure 2, the VS component that executes the tests is reporting an error during execution, this imply that, even if no test is failing, something wrong happened during the test. This happens if  **any test adapter write to the console error during execution and it is done to signal that something went wrong.** > Failing test run if there are error in output is a best practice, because you should understand what went wrong and fix it.

To troubleshoot the error you need to scroll all the output of the task, to find exactly what happened.  **Looking in the output I was able to find the reason why the test failed.** *2017-11-17T14:43:19.6093568Z ##[error]Error: Machine Specifications Visual Studio Test Adapter – Error while executing specifications in assembly C:\A\\_work\71\s\src\Intranet\Intranet.Tests\bin\Release\Machine.TestAdapter.dll – Unable to load one or more of the requested types. Retrieve the LoaderExceptions property for more information.*

If an adapter cannot load an assembly, it will output error and the test run is marked as failed, because potentially all the tests inside that assembly were not run.  **This is a best practice, you do not want to have some test skipped due to load error and still have a green build.** Machine Specification test adapter tried to run test in Machine.TestAdapter.dll and this create a typeLoadException. Clearly **we do not need to run test in that assembly, because TestAdapter.dll is the dll of the test adapter itself and does not contains any test.** This problem indeed happens after I upgraded the nuget package of the runner, probably in the old version the TestAdapter.dll did not creates errors, but with the new version it does throw exception.

The problem lies in how the step is configured, because usually you ask to the test runner to run tests in all assemblies that contains Test in the name.  **The solution was to exclude that assembly from test run.** [![image](https://www.codewrecks.com/blog/wp-content/uploads/2017/11/image_thumb-2.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2017/11/image-2.png)

 ***Figure 3***: *How to exclude a specific dll from the test run*

And voilà, the build is now green again. The rule is, whenever the test step is failing but no test failed, most of the time is some test adapter that was not able to run.

Gian Maria.
