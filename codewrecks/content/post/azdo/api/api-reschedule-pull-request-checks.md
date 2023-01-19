---
title: "Find pull requests with expired checks and re-schedule them"
description: "Having Builds and other checks in Pull Requests is the heart of a good Pull Request process. In Azure DevOps you can configure Pull Requests check to expire on update of target branch, but checks are not re-scheduled automatically. Learn how to find pull requests with expired checks and re-schedule them automatically."
date: 2023-01-18T07:12:42+02:00
draft: false
categories: ["AzureDevOps"]
tags: ["Api"]
---

You have a nice pipeline that **validate your Pull Request code, and you configure it to protect your base branch ex develop**. In a standard PR lifecycle, you have your checks green, then **someone else on the team change target branch** usually closing another PR, and your previous checks are not valid anymore, because target branch is changed. From configuration you can ask Azure DevOps to automatically expire checks.

