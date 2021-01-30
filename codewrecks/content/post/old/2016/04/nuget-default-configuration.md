---
title: "Nuget default configuration"
description: ""
date: 2016-04-12T16:00:37+02:00
draft: false
tags: [nuget]
categories: [Programming]
---
If you use [MyGet](https://www.myget.org) as package source or some other Nuget Feed and your code fail to build in a buildserver because it cannot retrieve some package, probably you have some problem in NuGet configuration.

**If you issue a *nuget.exe source list*in command line, you should be able to see all package source configured. **Actually I had a problem in a TeamCity build server, after we added a new package source to a solution and pushed code to the server the build was broken. The error is due to the inability to download packages from the new source. Running nuget.exe source list command confirmed me that the new package source was not listed, so it is clear why the package was missing.

If you have this kind of a problem, just know that** nuget has a  **[** default configuration **](https://docs.nuget.org/consume/nuget-config-defaults)** file that can be used to set all sources for all users in the machine**. In our build server this file is missing, so I simply created it listing all the package source we need and the build started working like a charm.

Gian Maria.
