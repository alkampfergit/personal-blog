---
title: "Pills: Visual Studio lost access to authenticated Nuget feed"
description: "Sometimes Visual Studio seems not to work anymore with authenticated nuget feed, here are some suggestions to avoid being stuck."
date: 2022-09-26T08:12:42+02:00
draft: false
categories: ["Visual Studio"]
tags: ["Pills"]
---

The symptom is simple, you have a solution **that uses some authenticated Nuget feed**, like those hosted on Azure DevOps, suddenly Visual Studio stops authenticating and get a 401 error, or simply does not show any version of packages.

This is a problem that happens to some person recently and today was my turn. I have a build that published **another version of a package to a private Azure DevOps feed** and after publishing a new version, I start searching for that new version Visual Studio "manage nuget packages" but have no result. The thing that makes you understand that you have a major problem is that VS **does not list any version except the one installed**

Another typical problem is that, someone add a new package from a private feed, and when you get that version, VS is unable to restore packages showing 401 errors in logs. **This happens because VS is unable to login to private feed**.

> Authentication problems to Nuget Feeds in Visual Studio can stop you working with the solution.

You have two distinct solution to try, first one open **Windows Credentials Manager and delete every credentials that point to the server**. This is not perfect solution, because you need to reauthenticate and also, sometimes, it is just a temporary solution.

Another solution is open Nuget Package Manager settings, then **Clear All Nuget Cache(s)**. This will for re-download all packages that are in cache, but in my situation it usually works better. 

![Clear Nuget Cache directly from Visual Studio](../images/nuget-clear-cache.png)

***Figure 1***: *Clear Nuget Cache directly from Visual Studio*

Once you cleared the cache, just close Visual Studio then issue a 

{{< highlight cmd >}}
dotnet restore --interactive
{{< / highlight >}}

from solution folder, this will **restore against your packages, and if the credentials are stale or invalid, it will prompt for other credentials.** This technique has the drawbacks of re-downloading all packages, so it will use lots of bandwidth on the first restore.

This should work, but if you still are unable to interact with Nuget Feed from Visual Studio, you can just **open Account Settings (top right VS status bar), and then Sign out from everything and then Sign In Again**. Usually when you clear all nuget cache, you are automatically logged out from your account so this step is not needed.

![Manage logged credentials in Visual Studio](../images/credentials-visualstudio.png)

***Figure 2***: *Manage logged credentials in Visual Studio*

Clearing up nuget cache just solved my problem.

Gian Maria.


