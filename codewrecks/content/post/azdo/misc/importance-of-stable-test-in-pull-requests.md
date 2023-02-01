---
title: "Azure DevOps: importance of stable tests in pull requests"
description: "Running a full set of tests (unit/integration/UI) in Pull Requests is a really nice feature, but you need to have stable tests"
date: 2023-02-01T07:00:42+00:00
draft: false
tags: ["PullRequests", "AzureDevops"]
categories: ["git"]
---

Pull Requests are the heartbeat of a project, and **it is probably one of the reason to move to Git if you still are in a different source control**. Actually a Pull Requests introduce this enormous advantage in a team

- You know when a feature/bugfix branch is ready to be inspected by the team
- A single place of discussion
- Automatic Merge and tests run on merge result
- Etc.

Actually you have a lots of other advantages, but I want to **concentrate the attention on test run**. A good and healthy project contains Tests: Unit, Integration, Ui, etc, and usually after years running the entire suite is time consuming. **This lead to an antipattern, where developers does not run all the tests before committing**, but usually runs only a subset of tests, to verify new code.

Using trigger you can run tests at each commit in any branch, but during the years, my experience is that this way to proceed has less benefit. 

One typical problem is **developer not checking test run status on the branch he/she is working to**. This happens especially if we have erratic tests, because developers are used to have some test fails and failed to check if they have real erratic tests or regression because a tests fails constantly. Thanks to [Azure DevOps we can configure the system to automatically re-run failed tests](https://www.codewrecks.com/post/old/2018/02/new-cool-feature-of-vsts-to-limit-impact-of-erratic-tests/) this will reduce tremendously the number of erratic tests.

> First characteristic of a Good Test Suite is stability

If you have some tests that **are erratic even if you put effort to stabilize them, remove from standard test run and run them only periodically**. The great risk of having erratic tests is decreasing the confidence of the team into testing.

But in my experience, once you stabilize your test, you still got regression on Develop because **of a feature/bugfix branch closed in develop, branch has test failing, nevertheless the branch was closed**. When you ask why the usual answer is that "test needs lots of time to run or simply I forgot to check them". 

> When tests are stable, you need to make them a pre-requisite for a pull request.

The only solution in this scenario is putting a pre-requisite in Pull Requests to run a build with all the tests, **then protect develop branch to disallow people to do a direct push on develop, and be forced to pass onto a pull request**. In that scenario **it is of uttermost importance that tests are stable and are quick to run**. This usually lead to a specialized pipeline used only to run check on pull requests in fastest and stablest way possible.

As an example, we have .NET tests and Jest tests for the UI, **we run them on two different job to parallelize the execution in two agents at the same time**. Also we run all Jest and Node related tests in a dedicated linux container, because it seems that performance are a slightly better than on Windows. Focus is: **run tests as fast and stable as possible**.

At the same time, I've removed the trigger on all feature and bugfix branches, because people rarely looks at build result of a branch, if they break build or test, they will find when they open a pull request, but **if test fails, pull request cannot be closed, so they will be forced to fix the problem**.

> If you let failing test / regression to flow on develop branch, you will have hard life fixing them.

![Checks in Pull requests](../images/pr-checks-active.png)

***Figure 1***: *Checks in Pull requests*

It makes sense to avoid any operation that can use time in the build, as an example, **all builds that runs in the project are configured with GitVersion**, this is done to have a nice version number in the build. To allow for GitVersion to run we need to checkout the entire repository, a long operation for big project. In Pull Request check pipeline **I removed GitVersion because I do not need a real version number, and I decided to do a shallow clone loading only latest commit**. This will save a bunch of seconds.

![Difference in run between Linux and Windows](../images/different-node-run-time.png)

***Figure 2**: *Difference in run between Linux and Window*

In Figure 2 you can see difference in running *npm run prod* on a big Angular project, **left is linux agent, right is windows agent**. We do not really understand why such a difference, Linux Agent runs as a container in the same hardware where Windows Agent runs, I suspect that the antivirus could be the culprit, but we have not investigated further and we are happy with the time reduction. 

Another great advantage is that in the past, we have situation where develop had some failing tests, people does not investigate immediately because they believe that we have erratic tests, after we have a sequence of failed build on develop people usually starts to investigate. The whole process **needs time, while now no one can close a pull request where test are not green** so if you see an error on a pipeline that runs on Develop, it must be erratic because it surely passes on the Pull Request.

The check of npm run prod is a good example of checks that are not **unit / integration tests**, but are useful to verify that the build is correct. Dev boxes are primarily Windows box, so no one wants to spend 10 minutes to perform full angular build, but **sometimes production build break and we usually find when we try to deploy on a test environment**. Thanks to Linux agent and PR 
check, we are sure that code will not break production build.

Here is the history of develop branch main build

![History of main pipeline on develop branch](../images/develop-run-history.png)

***Figure 3**: *History of main pipeline on develop branch*

As you can see we had a failing build (agent had a problem, build was killed after 60 seconds), and an orange build **where an erratic test failed, we found the test and fixed it**. 

> A good set on test that runs automatically on Pull Requests gave more confidence to the team and helps to stabilize tests.

Gian Maria.