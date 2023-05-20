---
title: "Work Item query by category"
description: ""
date: 2015-07-21T21:00:37+02:00
draft: false
tags: [Tfs]
categories: [Tfs]
---
This is a really old functionality of TFS, but it turns out that sometimes some people missed it. When you create a query, you can add a condition on Work Item Type.

[![This image shows combo box rendered by the ui when you are using the equal operator](https://www.codewrecks.com/blog/wp-content/uploads/2015/07/image_thumb6.png "Equal operator in Work Item Query")](https://www.codewrecks.com/blog/wp-content/uploads/2015/07/image6.png)

 ***Figure 1***: *Add condition to Work Item Type*

As you can see, you can require the Work Item Type to be equal to specific value, and the  **UI renders a nice combo box with all permitted values** to help the user choose right value.

You can also use the in operator, to specify a comma separated list of allowed types.

[![In operator in Work Item Query allow to specify a comma separated query of values](https://www.codewrecks.com/blog/wp-content/uploads/2015/07/image_thumb7.png "In operator")](https://www.codewrecks.com/blog/wp-content/uploads/2015/07/image7.png)

 ***Figure 2***: *The in operator in Work Item Query*

Finally TFS has a nice concepts called  **Work Item Category to group togheter all Work Item Types that shared some common behavior**. As an example, all types that represents a concept of requirement are shown on the Backload Board, while Work Items that represents a Task are represented in the Task Board. If you choose the  **in operator** to specify a condition on Work Item Type, you can choose from Work Item Categories.

[![If you choose In Group operator you can choose between Work Item Categories instead of types](https://www.codewrecks.com/blog/wp-content/uploads/2015/07/image_thumb8.png "In Group Operator")](https://www.codewrecks.com/blog/wp-content/uploads/2015/07/image8.png)

 ***Figure 3***: *Query with the “in group” operator  allows you yo choose between Work Item Categories*

There are many use case for this functionality, Microsoft Test Manager used Requirement category to create a generic query that lists “requirements” and is valid for all template. You can use this feature if you need to create **query that spans multiple project with different project template**.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2015/07/image_thumb9.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2015/07/image9.png)

 ***Figure 4***: *Query for requirements on multiple Team Project*

In  **Figure 4** I represented a simple query to list all requirements associated to me for every Team Project. As you can see from the result, I got Work Item Type “Requirement” from a CMMI Project and “Product Backlog Item” from a Scrum project.

Gian Maria.
