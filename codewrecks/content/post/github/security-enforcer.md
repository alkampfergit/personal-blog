---
title: "GitHub Security enforcer action"
description: "How to use GitHub Security enforcer action to automatically add Security Code Scanning to all new repositories"
date: 2021-12-10T08:00:00+02:00
draft: false
tags: ["security"]
categories: ["github"]
---

GitHub takes [security seriously](https://www.codewrecks.com/post/security/github-security-scanning/) and gives you some nice capabilities to **improve security of your code through all its lifecycle**. GitHub actions can be used to automatically run a security code analysis in your repositories, a task that should be run for **all of your repositories in your organization**.

> Security scanning should be enabled on all repositories

Some days ago in a [GitHub blog post](https://github.blog/2021-11-22-accelerate-security-adoption-in-your-organization/) a new action was announced called [Advanced-Security-Enforcer](https://github.com/marketplace/actions/advanced-security-enforcer#example-workflow) that is aimed **to automate the task of adding GitHub Workflow to perform code analysis**.

Reading the documentation, this action does the following tasks:

- A CRON job on GitHub actions triggers a nightly run of this script
- The script checks for new repositories by storing the known repositories to a file
- It then iterates over new repositories and opens a pull request for the codeql.yml file stored in this repository

Basically each day, at night, **this action will scan the account for new repositories (created day before) to make a pull request for codeql.yml file**.

This kind of actions are interesting because they can enforce best security practices in your organization. Another possibility is to have a predefined **skeleton directory for an empty project based on different type of projects**; this skeleton project usually contains already predefined Action Workflows in the .github/workflow directory.

Gian Maria.