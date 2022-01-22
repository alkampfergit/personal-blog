---
title: "CodeQL Scanning in GitHub"
description: "GitHub code scanning can spot security problem in your code automatically, a really nice feature"
date: 2021-03-14T08:00:00+02:00
draft: false
tags: ["GitHub"]
categories: ["security"]
---

As you can read directly from [GitHub blog post](https://github.blog/2020-09-30-code-scanning-is-now-available/) GitHub code scanning is now available and ready to use for your repositories.

I've blogged in the past [about code security scanning in GitHub](https://www.codewrecks.com/post/github/code-scanning/) but in that post I didn't show what happens when **analysis engine found some possible security problem in your code**. When something is not ok, you can go on your Security GitHub tab to look for alerts.

![CodeQL alert results in your repository](../images/codeql-alert-result.png)
***Figure 1:*** *CodeQL alert results in your repository*

In **Figure 1** you can look at alerts page of CodeQL analysis, where you can see a possible vulnerability in my application, encryption using ECB *mode of operation*. If you do not know why ECB is bad, you can simply go **to the detail of the alert**.

![Detail of the alert, position, description and CVE reference](../images/ecb-warning.png)
***Figure 2:*** *Detail of the alert, position, description and CVE reference*

The code **CWE-327** indicate a Common Weakness Enumeration, that indicates some **faulty code that is not secure**, in this situation number 327 indicates weak Mode of operation used in some Cryptographic operation. **If you want more detail on the subject, you can look at [CWE database](https://cwe.mitre.org/data/definitions/327.html) to have more details on why the code is bad**. 

If you scroll down on GitHub alert you can find all the link you need, but also when the vulnerability was introduced in the code (**Commit and branch**) so you can immediately start a review to understand **why vulnerable code is slipped in your master branch**.

![Detail of the alert, when was introduced as well as some useful links](../images/codeql-vuln-detail.png)
***Figure 3:*** *Detail of the alert, when was introduced as well as some useful links*

When you got a security flaw in your code you should review, understand why the code is there and, finally, **change the code or dismiss the problem**. In GitHub you can give three reasons why you want to dismiss the alert, as you can see in Figure 4

![Dismiss the alert with a valid reason](../images/codeql-dismissing-alert.png)
***Figure 4:*** *Dismiss the alert with a valid reason*

The third reason, won't fix, is used only when you cannot fix the code, you should **have a very valid reason, but it is always possible that you cannot remove the vulnerable code**. One possible reason could be that it is in some controlled part of the code, never called from external source.

There are also a couple of other situation to dismiss the alert, **the obvious one is false positive**. Analysis tools are great, but not always they spot the right problem. After a through analysis you can decide that the alert is not true so you can dismiss. In this specific situation I got the middle option, **This is code written for a unit test, and since it is not production code, you can safely dismiss related alert**.

Once you dismissed an alert, you can always look at it searching for closed alert, and, clearly, you can reopen whenever you want.

Overall experience is great, I misses only the **ability to have a discussion directly under the alert**, a feature that can be easily bypassed manually opening an issue with a link to the alert. Apart this minor missing feature, in my opinion the feature is great, you can setup a GitHub action for CodeQL analysis with few clicks and **if you mix CodeQl with standard security analysis of Sonar Cloud you can have a good security scan of your code**.

![Create issue with a link to the original alert](../images/create-issue-with-codeql-alert.png)
***Figure 5:*** *Create issue with a link to the original alert*

It is not a perfect solution, but it works perfectly, if the alert is not obviously in a test (like in this example) **you probably want to start a discussion around it**.

Gian Maria.
