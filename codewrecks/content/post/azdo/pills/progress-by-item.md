---
title: "Azure DevOps Pills: View progress in backlog"
description: "Do you know that there are special columns that helps you to track progress directly in backlog view?"
date: 2020-11-29T08:12:42+02:00
draft: false
categories: ["AzureDevOps"]
tags: ["AzDo", "Pills"]
---

If you start managing your backlog with Azure Boards, you probably will end having Epics->Features->User stories breakdown and as manager you have a usual question to answer **where are we on this epics or feature and when you expect it to be finished**.

While this is not a simple question to answer looking only at the tool, you need to know that Azure Boards can give you a **quick help visualizing completed work in a dedicated column**.

![Column rollup example](../images/rollup-by-all-work-items.png)

***Figure 1:*** *Rollup by all work items example*

Now you have a new column that shows a percentage of advancement for your stories, **based on the status of child stories**. The result can be seen in **Figure 2** where you can see rollup column in action.

![Rollup by count of work items](../images/rollup-by-work-item.png)

***Figure 2:*** *Rollup by count of work items*

This type of rollup is useful if you only want to have a quick look of **how many stories are completed for a parent**, this type of rollup is based on state and does not take into account the effort. This is quite useful if you are doing pure kanban.

> If you do not estimate your story, progress by all Work Item can give you a quick look at Epics and Feature progress.

Progress by all Work Items counts all the work items and probably **a better view is choosing Progress by Product Backlog Items or Progress by User Stories (depending on team process)**, because that view does not takes into account features when you look at the epic. This other type of column simply takes into account only progress of last level of the backlog, the blue one.

If you are estimating stories upfront, even if the estimate is rough, you can use a different type o aggregation called **Progress by effort**.

![Difference between progress by count and effort](../images/progress-by-effort.png)

***Figure 3:*** *Difference between progress by count and effort*

Progress by effort is good, but only if you **give each story an effort upfront and it is more useful in Waterfall approach, where you have to estimate everything upfront**. In agile process you usually estimate only the stories you are gonna deliver in next 3 or 4 sprints so you would not get a useful data with progress by effort.

> If you estimate every story up front, progress by effort gives you a more precise idea for Epics and Features progress

You can track not only progress with rollup columns, but you can also simply rollup some values like **sum all effort for child stories on parent stories**. This is probably one of the most asked feature of the tool since it was still called TFS.

![Sum of effort in action](../images/sum-of-effort.png)

***Figure 4:*** *Sum of effort in action*.

> Apart from predefined rollup columns, you can always define your own based on your criteria

As usual I strongly suggests you to look at [official post](https://devblogs.microsoft.com/devops/track-the-progress-of-work-using-rollup-columns/) and [official documentation](https://docs.microsoft.com/en-us/azure/devops/boards/backlogs/display-rollup?view=azure-devops&tabs=agile-process) to use the feature at full potential.

Gian Maria.
