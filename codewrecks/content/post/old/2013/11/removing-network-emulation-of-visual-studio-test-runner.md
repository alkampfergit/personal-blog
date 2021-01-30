---
title: "Removing Network Emulation of Visual Studio Test Runner"
description: ""
date: 2013-11-02T10:00:37+02:00
draft: false
tags: [Visual Studio]
categories: [Visual Studio]
---
 **Visual Studio has the ability to simulate network speeds during test executio** n. This feature is nice especially for Load Test, because it permits to really simulate users that have different configuration speed. This ability is granted from a network component that gots installed in your TCP/IP stack and one of the question that usually arise is

*I’ve enabled it in my machine, but now I want to remove because I’ve installed only to try to run a load test.*

The solution is opening an Administrator Developer Command Prompt and issue the command *vstestconfig NetworkEmulation /Uninstall*

{{< highlight bash "linenos=table,linenostart=1" >}}


C:\WINDOWS\system32>vstestconfig NetworkEmulation /Uninstall
 Microsoft (R) VSTestConfig Version 12.0.0.0
for Microsoft Visual Studio v11.0
 Copyright (c) Microsoft Corporation.  All rights reserved.
Network Emulation Configuration:
                Removed network emulation driver successfully.

{{< / highlight >}}

This will remove completely the emulation Driver. The same command has an /Install option to install it again if you want to run Web Performance test simulating different network speed as well as a  **/Repair option useful if the component is installed, but Visual Studio complains that he is not able to use it**.

Gian Maria.
