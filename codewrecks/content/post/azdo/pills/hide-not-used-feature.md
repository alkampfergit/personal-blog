---
title: "Azure DevOps Pills: Hide not used features from Team Projects"
description: "Azure DevOps is composed by five main blocks, do you know that if a block is not used you can completely disable from a single Team Project?"
date: 2025-01-21T08:12:42+02:00
draft: false
categories: ["AzureDevOps"]
tags: ["Azdo", "Pills"]
---

Azure DevOps is a really complete set of functionalities to manage your Development Team and more. As you can see from Figure 1, it has five main Macro Set of Features that you can use. All these features are visible in the **five icons in the lower right part of the card of each Team Project**

![AzDo five main features blocks](../images/azdo-blocks.png)

***Figure 1:*** *AzDo five main features blocks*

The very same five macro Feature set is visible on the left menu when you work with the detail of the Team Project. These part are, left to right

1. Work Item Management 
2. Code Management
3. Pipeline (and release) management
4. Test Plan management
5. Artifacts management

In small team or if you have many Team Project, for small Team Project, it is possible that you do not need some of these features. **To prevent people for using such features, or simply to avoid confounding users with unused menu and functionalities, you can disable each macro feature one by one**.

You can just navigate to **Team Project Settings to find the option to disable each section**.

![Settings to completely disable basic feature blocks of Team Projects](../images/project-settings-configuration.png)

***Figure 2:*** *Settings to completely disable basic feature blocks of Team Projects*

Once a section is disable it does not appears anymore in the Team Project, nor you can access it with a direct link, the entire **Feature Set is disabled**. Data is kept and not deleted, so if you created some Work Items and then you disable the Work Item section, actually all of your WorkItem data is still there and you can find again if **you re-enable the section**.

If you have relation between items, like Work Items that point to Git commit, if you disable the Code Feature, you will be unable to see existing link. **Links are still there, and you can view again when the Code Feature is re-enabled**.

While this functionality has little use for small organized teams, I found it to be useful for big companies where you do not want some teams **to use features that are not supposed to be used**. As an example, if the company decided that Continuous Integration will be done with another product (I really like Azure DevOps but there are other products out there) it makes sense to disable Pipeline feature entirely, to avoid people using them. The risk is having **some of the pipeline in Azure DevOps while the company mandates the use of another product.

One of the feature that are disable most of the time is the test one, because few team uses it and require special licenses for some feature. In this situation **disabling it entirely will avoid teams using it**. This will not prevent using Test Case Work Items (After all they are Work Items), but it prevents the team on using Test Plan entirely.

Artifacts are another feature that sometimes gets disabled, especially if you **created a single global repository for the entire company and you want to avoid separate teams to create feeds in their Team Projects. Especially with Nuget it is not the most nice experience **managing solution that uses nuget packages from multiple repositories**. 

Since this is a simple configuration that can be always be re-enabled (as you can see it is just a click on a swith in the ui) you can disable everything you are not using right now. This sometimes lead to less confusion in novice users that have less knowledge of the product.

Gian Maria
