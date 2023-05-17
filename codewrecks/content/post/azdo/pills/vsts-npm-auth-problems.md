---
title: "Pills: npm private feeds and authentication"
description: "In this post, we explore a possible authentication error with Azure DevOps npm package feeds that usually happens after long time of the first login."
date: 2023-05-17T08:12:42+02:00
draft: false
categories: ["AzureDevOps"]
tags: ["Pills"]
---

Have you ever encountered an issue obtaining an authentication token for your Azure DevOps npm package feed? Sometimes I got this

{{< highlight text "linenos=table,linenostart=1" >}}
vsts-npm-auth v0.42.1.0
-----------------------
Couldn't get an authentication token for https://pkgs.dev.azure.com/prxm/_packaging/JarvisNpmGood/npm/registry/.
{{< / highlight >}}

Private package feeds in Azure DevOps are incredibly useful, not just for Nuget packages, but for NPM as well. However **you must follow the given instructions on the site to connect to your feed, and there will be times when you have to renew credentials.** The problem is that npm feed in Azure Devops are usually private and under authentication/authorization. For this reason you need to install a special package to allow authentication. [You can download tool here](https://www.npmjs.com/package/vsts-npm-auth).

Sometimes you will be presented with a bad error of auth failed.

![Npm authentication failed](../images/npm-auth-failed.png)

***Figure 1***: *Npm authentication failed*

If you encounter an error such as **'Couldn't get an authentication token for...' followed by the address of your packages**, usually is an expired PAT used for authenticate your account. The problem is that this kind of error happens usually after one year after the first authentication so usually you forget how to fix.

The solution to this problem is straightforward, add a -F to the tool forces the authentication. Once you force authentication, you will be presented with a UI that allows you to authenticate your Azure DevOps account again. This way, you can download your NPM packages without any hitches. The command is 

{{< highlight text "linenos=table,linenostart=1" >}}
vsts-npm-auth -F -config .nprmc
{{< / highlight >}}

Now everything should work.

Gian Maria