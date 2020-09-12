---
title: "Azure DevOps Pills: Update java in agent machines if you use SonarCloud integration"
description: "Sonar cloud analyzer task is going to drop support for JDK 8, you need to update your agents to avoid build stops working"
date: 2020-09-12T12:12:42+02:00
draft: false
categories: ["AzureDevOps"]
tags: ["AzDo", "Pills"]
---

If you have Azure DevOps pipelines that uses SonarCloud analyzer, you should update java version for your agents if you are using version 8 because support is going to drop.

![Warning message for old java version installed](../images/java-out-to-datepng.png)
***Figure 1***: *Warning message for old java version installed*

You have not many days left to solve this issue before your builds **starts failing because Sonar Cloud analyzer will no longer work**. The solution is simple, you can simply download an updated version of Open JDK in all agent machines. To check actual java version used you can simply check the JAVA_HOME capability directly in agent administration page.

If you like me just unzip new SDK into a new directory and update JAVA_HOME accordingly, you can find that **the agent still have java capability pointing to the old jdk**.

![Agent java capabilities](../images/agent-jdk.png)
***Figure 2:*** *Agent java capabilities*

If you still have the warning it usually happens because you **did not update JAVA_HOME variable accordingly pointing to new version of Java JDK** or because the agent task still uses the old version. For Sonar Cloud setting JAVA_HOME is enough. To check if everything is ok you can look at pipeline run log to verify exact version used.

![Check java version used by Sonar Cloud analyzer task](../images/java-version-used-by-sonar-cloud.png)
***Figure 3:*** *Check java version used by Sonar Cloud analyzer task*

As you can see in Figure 3 actually the agent is using correct version.

If you do not want to update JAVA_HOME for the entire machine, you can **set JAVA_HOME only for Azure DevOps agent** if the agent is not run as a service. In this scenario you can simply edit run.cmd file to set JAVA_HOME to correct version.

{{< highlight cmd "linenos=table,hl_lines=5,linenostart=1" >}}
@echo off

...

SET JAVA_HOME=C:\Program Files\Java\jdk-14.0.2

if /i "%~1" equ "localRun" (
    rem ********************************************************************************

...

{{< / highlight >}}

When you manually starts your agent, JAVA_HOME points to JDK 14.

Gian Maria.