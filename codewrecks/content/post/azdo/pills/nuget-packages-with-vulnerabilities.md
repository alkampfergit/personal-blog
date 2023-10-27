---
title: "Pills: Identify nuget packages with vulnerabilities"
description: "Keep your feeds size at bay with automatic retention policy in Azure DevOps."
date: 2023-10-27T08:10:42+02:00
draft: false
categories: ["GitHub"]
tags: ["Pills"]
---

Managing references is easy with Nuget, however, **from a security standpoint, it's not straightforward to ensure your project's security by upgrading vulnerable references**. GitHub Dependabot does an excellent job flagging vulnerable references, and the entire GitHub ecosystem has a strong emphasis on security. This empowers developers to handle security in the packages they produce.

Recently, **Visual Studio introduced a feature that immediately warns you if a package in your solution is insecure**. You can also filter your installed packages to display only those with vulnerabilities.

![Visual Studio allows you to filter only for vulnerable packages in project references](../images/vulnerability-detection.png)

***Figure 1***: *Visual Studio allows you to filter only for vulnerable packages in project references*

When you list version of packages all vulnerable version are immediately highlighted.

![Visual Studio clearly mark vulnerable package in the UI](../images/vulnerability-listed.png)

***Figure 1***: *Visual Studio clearly mark vulnerable package in the UI*

When you integrate this with GitHub's Dependabot, there's minimal risk of developers overlooking vulnerabilities in their dependencies. 

Visual Studio ensures the security of the project you're working on by immediately alerting you to vulnerable packages. GitHub Dependabot notifies you if a project, not under active development, relies on a vulnerable package. As a result, you might need to revisit the code, make minor adjustments, upgrade your packages, and ensure everything is compatible with the new package version.

Gian Maria.