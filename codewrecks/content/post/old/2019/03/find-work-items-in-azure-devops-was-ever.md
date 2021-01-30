---
title: "Find work Items in Azure DevOps was ever operator"
description: ""
date: 2019-03-07T12:00:37+02:00
draft: false
tags: [Azure DevOps]
categories: [Azure DevOps]
---
Query language in Azure DevOps is really rich and sometimes people really misses its power, struggling to find and manage all work item with the standard boards.  **There are a lot of times in a complex project when you are not able to find a specific Work Item and you feel lost because you know that it is in the system, but you just does not know how to find id.** >  **When you have thousands or more Work Items in a TFS or AzDO instance, finding a specific Work Item can become difficult if you do not remember perfectly its title, but you remember only some general characteristics.** One not so common criteria is is: “I **remember a certain work item that was assigned to me, but I cannot find anymore in my assigned work Items**.”. This  can happens because it was reassigned to another member so you are not able to find it because you remember the general topic of the Work Item but you forgot the title.

[![SNAGHTMLd6d1f5](https://www.codewrecks.com/blog/wp-content/uploads/2019/03/SNAGHTMLd6d1f5_thumb.png "SNAGHTMLd6d1f5")](https://www.codewrecks.com/blog/wp-content/uploads/2019/03/SNAGHTMLd6d1f5.png)

 ***Figure 1***: *Was ever operation in action.*

If you look at  **Figure 1** ,  **if you remember that you were assigned to a certain work item, you can use the operator “Was Ever” that searches for a value in a field in the history of Work Items**. Such a query will return all Work Items you were assigned to, even if now they are assigned to a different person. Sorting for Changed Date or Created By can helps you to further refine the search and find the Work Item you are looking for.

 **The Was Ever operator is not available for all fields, but it is a nice, not well known feature, that can save you lots of time when you need it.** Gian Maria.
