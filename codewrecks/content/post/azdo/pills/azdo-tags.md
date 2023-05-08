---
title: "Pills: Maximizing the Power of Tags in Azure DevOps"
description: "Get the maximum from your Azure DevOps board using tags."
date: 2023-05-08T08:10:42+02:00
draft: false
categories: ["AzureDevOps"]
tags: ["Pills"]
---

In Azure DevOps, **using tags allows you to easily classify work items**. Rather than using additional process fields, tags offer a high level of classification ease because any team member can add a label to a work item.

In effect, the result **is the ability to create a horizontal taxonomy that's common to all work items and likely common to all team projects**, enabling efficient filtering and categorization of Work Items.

In DevOps, you can filter by tags in many views. For example, in the default view, there's a first-level filter for tags that allows **filtering among the tags in 'AND' or 'OR' mode**, thereby filtering our workout items with tag taxonomy effortlessly.

![Filtering by tags in azure devops](../images/or-filtering.png)

***Figure 1***: *Filtering by tags in azure devops*

The same filter is **present in the backlog view, making it easy to immediately use the tag filter when performing backlog grooming.** Even if you work in Kanban, you'll see that it's possible to filter all Work Items with tags on the board, using the same filtering control.

Of course, **you can include tag filters in the Query editor as well**. When we need to create more complex queries for our work items, we always have the option to add a tag filter.

![Using tag filtering in query](../images/use-tags-in-query.png)

***Figure 2***: *Using tag filtering in query*

As you can see, tags are a powerful, easy-to-use tool that helps us classify and improve our searches within Azure DevOps.

However, one risk of using tags is the **proliferation of the tags themselves**. Often, Team Projects end up with dozens or even hundreds of different tags, which significantly limits the advantage of tags themselves. Many don't know that at the Team Project permissions level, it's possible to set/remove a specific permission called 'create tag definition', allowing team members to create new tag definitions.

> Permission to "create tags" is added to all contributors by default, thereby allowing any member of the team to create new tags.

This doesn't prevent a team member from adding a tag to a Work Item, but it does **prevent adding a new tag to a Work Item**.

In Azure DevOps, there isn't a dedicated tag management system (i.e., a menu or setting where an administrator can set the list of allowed tags), but you can still restrict tag creation permissions to administrators. **When an administrator wants to introduce a new tag, they simply add the tag to an existing item, perhaps a dummy Work Item created for this **purpose**.

While there's no dedicated tag administration page in the product, several extensions are available in the marketplace that allow you to perform mass editing and other bulk operations on your team project's tags.

- **Tag Admin**: [Tag Admin](https://marketplace.visualstudio.com/items?itemName=ms-devlabs.vsts-tag-admin-extension)
- **Tag Explorer**: [Tag Explorer](https://marketplace.visualstudio.com/items?itemName=ms-devlabs.vsts-tag-explorer-extension)
- **Tag Manager**: [Tag Manager](https://marketplace.visualstudio.com/items?itemName=ms-devlabs.vsts-tag-manager-extension)

Remember, wise use of tags in your team project allows for a highly efficient and powerful product experience.

Gian Maria
