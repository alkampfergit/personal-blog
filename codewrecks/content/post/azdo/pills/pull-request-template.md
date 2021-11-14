---
title: "Azure DevOps Pills: Pull request template"
description: "Enhance your pull request experience with templates?"
date: 2021-11-14T08:12:42+02:00
draft: false
categories: ["AzureDevOps"]
tags: ["Git", "Pills"]
---

Azure DevOps is a really big product and sometimes there are really useful features that are poorly publicized and goes under the radar. One of these is [Pull Request Templates](https://docs.microsoft.com/en-us/azure/devops/repos/git/pull-request-templates?view=azure-devops), a really useful feature that allows you **to specify markdown template for your pull requests**.

I do not want to go into technical details, you can find [all instructions in official documentation](https://docs.microsoft.com/en-us/azure/devops/repos/git/pull-request-templates?view=azure-devops) but I'd like to point out why this feature is so useful.

First of all you can **specify different template for different branches, and also you can specify template that can be used by PR creator**. This allow you to have a great flexibility on configuration and create an uniform experience for your Pull Requests. PR are in fact the fundamental block of your developing process, in a PR **all developers can comment new code before it reaches stable branches** and having a uniform way to describe a PR is really useful.

Since the template supports full markdown syntax, it is the **perfect place to put a checklist**. Checklists are really awesome, they allows people not to forget things when they perform common tasks. In a PR a checklist is really useful because **it remember to PR creator all the tasks that he should have performed before opening the PR**. As a typical example, in our PR template we have in checklist some common tasks like:

- [ ] I compiled Release notes
- [x] I linked all related Work Items to the code
- [x] I ran all unit test locally before asking for PR

And many others. This will allow some PR reject reason like "release notes missing", "no unit test", etc.

The ability to create templates that can be inserted **on demands by the user** allows the team to standardize PR for typical situations. As an example, if I'm doing a PR **for a feature branch where I've created another feature of my software**, I choose template for "new feature" that contains a special checklist, with specific entries like "have you put the feature under feature flag?". If I'm doing a PR that closes a Bug, in the checklist I have entries like "Have you checked if you can put a unit / integration test that can prevent regression?". This will help PR creator to avoid wasting time of other teams member forgetting some basic stuff.

> PR checklist are also a really good part of "definition of done". 

Since PR checklists specify what **the team expect to find in code in a Pull Request**, they are clearly **part of the definition of done**.

When you starts using PR heavily you will find that you need more time to close branches. Sure, the code quality becomes higher, but you need to have PR process **goes out as smooth as possible**. This the process is usually performed with this steps: **request PR, got feedback, fix feedback (repeat as needed), and finally got approval and close**. All this process is asynchronous, so you need to have less cycles as possible; the goal is opening a PR and got it approved on the first try. This goal is hard to accomplish for all PR, **but having a clear checklist of what the team is expecting to find in the code reduces unnecessary cycles**.

If you care about code quality, you cannot avoid doing Pull Requests and templates with checklists are your way to clearly set the bar for desired quality.

Gian Maria.
