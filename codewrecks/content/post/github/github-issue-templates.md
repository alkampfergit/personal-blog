---
title: "GitHub issue templates"
description: "Migrating from Azure DevOps to GitHub can be painful, especially for the board part. Let's see how to make life easier with GitHub issue templates."
date: 2022-01-22T08:00:00+02:00
draft: false
tags: ["GitHub"]
categories: ["GitHub"]
---

After Microsoft acquisition of GitHub there is some bit of confusion on what to use: Azure DevOps or GitHub for your new projects? Actually the answer **is somewhat complex, but the most honest response is to use whatever of the two you find more adherent on how you work**.

The most different part is the issue/board part, because they are very different on the two products, with very different capabilities and very different basic concepts. While Azure DevOps enforce a complex tracking with **explicit WorkItem types and custom fields**, GitHub does use a **flat approach to the problem using only Issues with labels and few fields**. 

> GitHub has its roots on open source software, thus privileges a simple issue tracking while Azure DevOps was born in enterprise where more control is needed.

Nevertheless it is clear that Microsoft is pushing on GitHub, after all GitHub is actually **the place where the software is developed** while Azure DevOps, even if it is in my opinion more complete than GitHub as of today, is less used, especially publicly. This means that having a look at GitHub is a must.

## Use Azure DevOps Board for your GitHub Project

If you really do not like GitHub issue tracking, you can still use Azure Board part [connected to your GitHub repository](https://docs.microsoft.com/en-us/azure/devops/boards/github/?view=azure-devops). With the integration you can manage all of your Work Items in Azure Boards, but you can use [AB#workitemnumber to automatically link GitHub commits](https://docs.microsoft.com/en-us/azure/devops/boards/github/link-to-from-github?view=azure-devops) to Work Items. The automation allows you to use keywords like *Fixed, Fixes** and others to trigger transition to Work Items directly from GitHub commits.

> Azure Boards integration lets you use familiar Azure Board while keeping code, Pull Requests and other stuff in GitHub.

## Use GitHub issue templates 

GitHub does not have hierarchically structured issue tracking, but with issues template you can handle standard agile decomposition well. Just go to project settings / features to configure them.

![Configure Issue Templates in GitHub](../images/issue-template.png)

***Figure 1:*** *Configure Issue Templates in GitHub*

Issue templates are simple, you just create a placeholder for the content, **automatically assign a label and suggests how you want the content to be organized**. You can create labels for **Initiatives, Epics, User Stories and Tasks, write what you expect to be written inside each one and you are halfway done**. 

Once the templates are created, you can choose between one of them when you create a new issue.

![Create issue when templates are in place](../images/create-issue-templates.png)

***Figure 2:*** *Create issue when templates are in place*
 
Once you choose a template you are presented with template name and description (helps you to understand what are you doing) as well as the **template of the issue the team is expecting**. As you can see in **Figure 3** to simulate a work breakdown, since we do not have Parent / Child relationship in GitHub we ask to the user to link all children issues to this one and suggests that children of initiative are Epics.

![Templates help you in writing correct issues](../images/new-issue-template.png)

***Figure 3:*** *Templates help you in writing correct issues*

The annoying part of this process is that you need to have **child created before you can link to the parent issue, but usually I open a new browser tab, create all children and then link to the parent**. To simplify the process you can use GitHub cli. Suppose you have an Initiative and you want quickly create some children, just type gh issue create --title "TITLE", then the cli let you choose the type and open notepad to write the content.

![Edit content in notepad](../images/gh-new-issue-notepad.png)

***Figure 4:*** *Edit content in notepad*

## The result

If you do not need all Azure Board functionalities, you can live well with simple GitHub issue and **thanks to template you can simulate word breakdown** as you can see in **figure 5 that represents an initiative with children**.

![Initiative and epics children](../images/breakdown-epic.png)

***Figure 5:*** *Initiative and epics children*

For simple agile decomposition this is usually enough to get your sprint planned and done. You can always use other GitHub features like **[GitHub Projects (still in beta)](https://docs.github.com/en/issues/trying-out-the-new-projects-experience/about-projects) to track progress.

Using [GitHub emoji](https://gist.github.com/rxaviers/7360908) allows you to use various symbols that immediately can convey some basic concepts, like :top: to identify User Stories with high impact on the project. 

Remember that thanks to [GitHub projects](https://github.blog/changelog/2021-06-23-whats-new-with-github-issues/) you can now add **custom fields to your issues**, that actually is the major gap moving from Azure DevOps to GitHub.

Gian Maria.
