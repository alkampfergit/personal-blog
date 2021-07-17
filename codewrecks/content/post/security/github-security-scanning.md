---
title: "GitHub security scan - an example" 
description: "GiHub security can can spot programming error automatically and the analyzer is good!"
date: 2021-07-17T15:10:00+02:00
draft: false
tags: ["security", "programming"]
categories: ["security"]
---

I've already blogged [on the security scanning capability offered by GitHub](https://www.codewrecks.com/post/github/code-scanning-result/) and in this post I want to give you another example on a possible output. In previous example I've shown a result that is quite simple **the library identified a usage of ECB in AES encryption and flagged it as a wrong usage of crypto api**. It is interesting but less impressive, after all it simply spotted the usage of an enum value related to a vulnerable CypherMode, something that it easy to spot.

In the same repository I got another interesting warning, represented in Figure1.

![Security report spotted credentials in source code](../images/security-report-1.png)
***Figure 1***: *Security report spotted credentials in source code.*

The question is "how CodeQL scan found that this is indeed an **hard coded credentials.**? It is a simple string, but if you read the message it claims that: **The hard-coded value "another-password" flows to the  parameter in  object creation of type Rfc2898DeriveBytes**.

> What CodeQL does is inspecting flow of the code, it is not a simple scan of isolated files.

Clicking on the link in the message, you can find the source code of the function that creates the Rfc2898DeriveBytes object, **and indeed it is using hardcoded value "another-password"**.

![The function that creates the Rfc2898DeriveBytes object uses hardcoded value "another-password".](../images/code-scanning-2.png)
***Figure 2***: *The function that creates the Rfc2898DeriveBytes object uses hardcoded value "another-password".*

To accomplish this result CodeQL scanner is actually checking the flow of the parameter through the code, **and you can see from Figure3 that it followed 9 level of function calls to indeed verify that the hardcoded value is used to create an instance of Rfc2898DeriveBytes**.

![CodeQL follows code flow to verify that there is a path where hard-coded credentials are used in a crypto primitive.](../images/code-scanning-flow.png)
***Figure 3***: *CodeQL follows code flow to verify that there is a path where hard-coded credentials are used in a crypto primitive.*

This simple example shows you the power of CodeQL, it can spot hardcoded credentials, but it can also spot more complex issues, like the use of **hardcoded values** in **parameters** of **methods**.

When you write code that deal with Cryptography, having an automated scan helps you to spot errors and potential security issues during **early stage of development reducing the risk of bad code flowing in production**.

As usual, since this is code written in a test function I can simply close the issue and move on, but **if such an error was written in production code, I could have removed it before closing the branch.**

Gian Maria.