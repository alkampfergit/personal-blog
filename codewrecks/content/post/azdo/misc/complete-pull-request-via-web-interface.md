---
title: "Azure DevOps: complete Pull Requests via web interface"
description: "To speedup closing of Pull Requests you can use the web interface to close them, without any need to use your toolchain"
date: 2022-05-31T08:00:00+02:00
draft: false
tags: ["blogging"]
categories: ["general"]
---

Pull Requests are the Heart Beat of your code, you have a request/bugfix/feature in a form of work item, the team start a branch, write code, then when the code is finished **a Pull Request is opened to ask the team for review before the code is merged into the stable branch and goes to production**. When you deploy regularly your product in an automatic way, you need to **minimize the risk that new code can break existing one** and having other members of the team to review the code increment, is an invaluable feature. Also Pull Requests can include discussion about code increment, so you can examine that discussions in the future when you wonder why a piece of code was written in that specific way, and why.

But clearly Pull Requests uses time of the team in various way, and you need to minimize dead time. I'm marking Dead Time all time spent in activities needed by the PR that **can be automated and does not need a real human brain to be done**.

Here is a typical workflow of a Pull Request:
1. I opened a pull request and linked one or more Work Items
1. Someone else review my code
1. Some feedback on the code
1. I react to the feedback
1. PR is approved
1. Usually branch is rebased on target branch
1. Fast forward from target branch
1. Complete associated Work Items

Latest part of the workflow is especially annoying, most of the time if the branch is small **rebase does not conflicts**, but to be 100% sure you should **checkout the code, perform the merge / rebase, run all tests, then proceed to close the branch**. 

In the above scenario, Azure DevOps can tremendously help in the process **automating most of the checks and actions**. As an example, it automatically checks if you have merge conflict in the branch, and if there are no conflicts, **it runs a series of pipelines as checks**.

![Pull Requests automatic check in action](../images/pr-automatic-checks.png)

***Figure 1***: *Pull Requests automatic check in action*

As you check in **Figure 1**, you can verify that we have no conflict on the branch and all test are green. Clicking on the checks you can view build details, that contains all tests runs and all logs of the pipeline.

![Details of the build associated to the PR](../images/tests-results-in-pr.png)

***Figure 2***: *Details of the build associated to the PR*

It is important to remember that the test results is referring to the code that will result **after the merge of the branch, not the code that is currently checked in**. This will guarantee that after merge the code still compiles and all tests are green. Remember that **if you does not have any merge conflict during the merge, this does not guarantee that you have a logical conflict**. The typical example is a rename of a class in the base branch, while new code is using the old name in new files. In that situation we have no conflict during merge (no file conflicts) but resulting code will not compile.

The ability to have automatic checks, are really useful, because, once you fix everything and the team approve the PR, instead of doing checks manually, you can **let the server do everything for you**. Clearly if code cannot be merged, you need to do a manual intervention.

![Conflict of PR Merge detected automatically](../images/conflict-in-pr-merge.png)

***Figure 3***: *Conflict of PR Merge detected automatically*

But once all test are green, you can simply close the PR directly from the web interface.

![You can close PR directly from the web interface](../images/pr-complete-via-web.png)

***Figure 4***: *You can close PR directly from the web interface*

This will save you the time to, fetch, checkout the branch, manually do the rebase, run all tests and all checks, and then close the branch locally. **You can also choose closing strategy, as an example I always prefer closing feature / bugfix branches with rebase.**

![Choose PR closing strategy](../images/pr-close-rebase-strategy.png)

***Figure 5***: *Choose PR closing strategy*

The only manual intervention needed if your branch has merge conflicts, but this does not happen so frequently. Just a click and I have everything ok.

![Merging pull request](../images/merging-pr.png)

***Figure 6***: *Merging pull request*

![Closed pull request](../images/merged-pr.png)

***Figure 7***: *Closed pull request*

With a single click I had my branch merged with the target branch, original branch was deleted and the corresponding bug is marked as closed, and everything **without the need to perform any operation on current computer, with the certainty that the code will compile and all tests are green**.

Gian Maria.