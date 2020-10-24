
---
title: "Azure DevOps pills: Avoid triggering pipelines continuous integration with commit message"
description: "When you push frequently you can avoid triggering continuous integration with a simple comment"
date: 2020-10-24T10:00:42+02:00
draft: false
categories: ["AzureDevIOps"]
tags: ["AzDo", "Pipeline"]
---

There are situation when you need to push frequently on a Git repository, a typical example is when you are **authoring a yaml pipeline and you are experimenting stuff**; in such a situation you modify the pipeline, push, test and go on. It is quite common to push really frequently and this usually saturate standard pipelines.

It is not uncommon to have a standard pipeline of build and test running for each commit and for each branch. In such a situation **if you push too often you risk to saturate all of your build agents**.

> When you push too often, agents tend to be saturated

Sometimes I heard some dirty trick to avoid this, but luckily enough, Azure DevOps pipelines have (as all other CI engines) some predetermined **tokens that stops triggering a build if presents in a comment**. For those used to TFS in the old days, this token was **\*\*\*NO_CI\*\*\***. This means that if you include \*\*\*NO_CI\*\*\* in a Git or TFVC comment, this commit (or changeset in TFVC) will not trigger any pipeline.

There was a bug in the past where \*\*\*NO_CI\*\*\* was not honored in AzureDevOps pipeline, but now, accordingly to [this issue](https://github.com/Microsoft/azure-pipelines-agent/issues/858) everything was solved, and we have also other token that we can use, like **[skyp ci]** and others.

You can [find the details on this answer to related GitHub issue](https://github.com/Microsoft/azure-pipelines-agent/issues/858#issuecomment-475768046) on pipelines agent GH repository. We have now plenty of ways to prevent pipeline to start upon commit (maybe too much :))

![All possible tokens to prevent triggering of a build](../images/no-ci-tokens.png)
***Figure 1***: *All possible tokens to prevent triggering of a build*

Gian Maria.