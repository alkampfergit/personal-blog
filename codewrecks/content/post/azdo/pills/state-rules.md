---
title: "Azure DevOps Pills: Process rules for state transition"
description: "One of the most awaited feature is now live, the ability to add rules for state transition for custom processes."
date: 2020-08-19T08:12:42+02:00
draft: false
categories: ["AzureDevOps"]
tags: ["AzDo", "Pills"]
---

One of the most requested feature for Azure DevOps is the ability to restrict state transition for custom processes. Whenever a company starts creating its own process, Work Item States is always a big area of discussions. Which state we need? Who can change state from X to Y? **Until few weeks ago, only if you have Azure DevOps server with old process model based on XML you can restrict transition between states. Now this feature is available even for cloud version.**

A common situation is triaging, if we want to force all issues to go through a triage phase, we want to restrict the transition from first state (To Do) to state triage. Thanks to state transition restriction rule you can create the rule shown in Figure 1.

![Force triaging of an issue](../images/restrict-rule-triage.png)
***Figure 1:*** *Force triaging of an issue*

As you can see, **action "restrict the transition to state" allows you to avoid that specific transition.** This means that if I restrict all transition except for state triage, I obtain what I want, force triaging.

![Force triaging of an issue](../images/force-triaging.png)
***Figure 2:*** *Force triaging of an issue*

This allows the definition of a workflow, where you can force a specific flow between states. You can also restrict statese **to specific groups or to user that does not belongs to specific groups**. As an example in Figure 3, you can see a rule that allows rejected state only for project administrator role. With such a rule only project administrators can reject an issue.

![Restrict states based on user identity](../images/restrict-state-based-on-identity.png)
***Figure 3:*** *Restrict states based on user identity*

In this version we still have a limitation that does not allow to create a rule that allows transition from state A to state B for a specific role. Actually you can restrict a state for a role, but you are not allowed to specify a starting state. A typical example is if you want only an administrator to be capable of moving an issue **from state "To Do" to "Rejected" without triaging**.  

![Restrict transition based on identity is still not possible](images/../restrict-move-based-on-role.png)
***Figure 4:*** *Restrict transition based on identity is still not possible*

This limitation could be removed in future release, for now you can check [all supported rules in official documentation](https://docs.microsoft.com/en-us/azure/devops/organizations/settings/work/apply-rules-to-workflow-states?view=azure-devops) and I strongly encourage you to test in your account to verify what you can and what you still cannot do. 

If you really need to prevent some role to perform a specific transition there is a trick you can use. Suppose you want to prevent Project Administrator from transition to ToDo to Rejected without Triage. **You starts adding a new field called ImmediateReject Reason and you made it required during that transition".

![Reject reason required for immediate reject](../images/reject-reason-trick.png)
***Figure 5:*** *Reject reason required for immediate reject*

As you can see from Figure 5 you can simply create a rule that: **When a work item change state from ToDo to Rejected make required RejectReason field.** This is a reasonable rule, because you want some user to specify why an issue was rejected without triaging. Then you can simply **make RejectReason ReadOnly for the role that should not immediately reject the issue** and the game is done. When the Issue is in ToDo state, if you are member of a role that cannot immediately reject the issue. trying to move to state Reject will make that field required, but you cannot modify because is readonly, thus you cannot perform the transition.

Even if you still have not the ability to fully customize your process, you now have a really nice set of rules that allow you to implement almost all of basic rules you need. And everything is done with a nice Web Based editor so you do not need to manually edit XML files (like you needed to do in the past with standard xml file based process).

I strongly encourage you to try to customize a process, you fill find that AzDo has a great flexibility and can be adapted to your process with little effort.

Gian Maria.
