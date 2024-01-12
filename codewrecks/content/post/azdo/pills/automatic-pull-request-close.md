---
title: "Pill: Enhancing DevOps with Automated Pull Requests"
description: "Exploring automated pull request workflows in Azure DevOps for efficient code integration."
date: 2024-01-12T08:10:42+02:00
draft: false
categories: ["AzureDevOps"]
tags: ["Automation", "Pull Requests"]
---

Pull requests are a cornerstone of collaborative software development, particularly with distributed version control systems like Git and platforms such as GitHub or Azure DevOps. However, managing pull requests can become cumbersome, particularly for **branches undergoing extensive modifications and receiving frequent feedback.** This complexity is evident when preparing a pull request only to find it needs additional changes due to peer review, necessitating a complete retest of the code.

Such workflows highlight the challenges in finalizing a branch. Developers often find themselves continuously switching to the branch in question to **change the code based on other members feedback**, re test everything, signal to other members that the PR is updated then move to another branch and repeat. This is where a **comprehensive suite of automated tests, including end-to-end tests, becomes invaluable.** These tests should cover the entire spectrum of the development process: building the solution, packaging artifacts, deploying to a test server, and conducting basic functionality checks.

> Having a good test pyramid implemented can make your life easier especially for pull request process.

When this automated testing framework is in place, you can configure your DevOps workflow to auto-complete pull requests. This means that **when all conditions are met, Azure DevOps will automatically close the Pull Request for you**, without any manual intervention. Usually checks consists of explicit member approval, or team approval (where any member of the team can approve) and also all related check should pass. Here is what the system present you as options for automatic completion of PR.

![Configuration Options for Automatic Pull Request completion](../images/automatic-pr.close.png)

***Figure 1***: *Configuration Options for Automatic Pull Request completion*

As shown in **Figure 1**, you can choose from different strategies for merging the code. For instance, **using a rebase strategy, as depicted in the figure, ensures a linear commit history.** With this feature, all the commit of the PR branch will be rebased on the target branch so you have a clear and linear history.

Alternatives to rebasing include the **rebase-and-squash method, where all commits in a branch are condensed into a single commit upon pull request closure.** This maintains not only a linear history but also a shorter history where each feature branch will be contained in a single commit that reflects all changes made in that branch. **This solution can be avoided if you absolutely need to maintain identity of people for each commit in the branch**, a feature that is usually not needed (if you absolutely need it you have other problems).

**Figure 1** also presents options that needs to be done after the code is merged. These include automatic deletion of source branch and completing associated work items. With these options when the Pull request will be closed you will have the **source branch deleted** and the **work item associated with the pull request closed**. 

For branches with additional checks, such as build validations, the interface **allows for specifying which of the prerequisites you want to wait before automatic completion takes place**. 

Note: It's critical to configure your pipelines to **fail completely if any test fails, because partial failures (where the build completes but reports failing tests) will not prevent branch closure.** 

> For pipeline used in Pull Request check, you need to configure your build to fail if one test fails.

This approach also accounts for tests that are known to fail intermittently or are scheduled for future fixes. Such tests should be excluded from the pipeline or not used for verifying pull requests.

For those preferring a more traditional merge strategy without rebasing or squashing, Azure DevOps offers classic merge options, as illustrated in Figure 2.

![Options to automatically close the pull request with merge strategy](../images/close-pr-with-merge.png)

***Figure 2***: *Options to automatically close the pull request with merge strategy*

For this automated process to be really effective you need to cover **the most functionality you can with the automatic tests, especially end-to-end tests** to validate the core functionality of your application. This ensures that **when the pull request is automatically merged, you can be confident that nothing is broken.** This is true not only for automatic approval but also for standard approval.

Gian Maria.
