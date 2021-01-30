---
title: "SonarQube UTF-8 error after upgrading"
description: ""
date: 2016-12-09T12:00:37+02:00
draft: false
tags: [sonarqube]
categories: [Experiences]
---
I’ve upgraded a SonarQube instance, and then, suddently I realyze that some builds start failing due to to a  **strange error in the SonarQube complete analysis task**.

{{< highlight bash "linenos=table,linenostart=1" >}}


2016-12-09T11:41:00.8695497Z ##[error]WARN:
 Invalid character encountered in file C:\vso\_work\3\s\src\Jarvis.ConfigurationService.Client.CastleIntegration\Properties\AssemblyInfo.cs at line 25 for encoding UTF-8.
 Please fix file content or configure the encoding to be used using property 'sonar.sourceEncoding'.

{{< / highlight >}}

Thiserror in turns made the entire task execution failing with a really strange error

{{< highlight bash "linenos=table,linenostart=1" >}}


2016-12-09T11:41:03.5135467Z ##[error]ERROR: Error during SonarQube Scanner execution
2016-12-09T11:41:03.5145430Z ##[error]java.lang.IllegalArgumentException: 5 is not a valid line offset for pointer. File [moduleKey=Jarvis.ConfigurationService:Jarvis.ConfigurationService:893ED554-3D86-47C8-B529-965329DB32AF, relative=Properties/AssemblyInfo.cs, basedir=C:\vso\_work\3\s\src\Jarvis.ConfigurationService.Client.CastleIntegration] has 1 character(s) at line 2
2016-12-09T11:41:03.5145430Z ##[error]at org.sonar.api.internal.google.common.base.Preconditions.checkArgument(Preconditions.java:145)
2016-12-09T11:41:03.5145430Z ##[error]at org.sonar.api.batch.fs.internal.DefaultInputFile.checkValid(DefaultInputFile.java:215)
2016-12-09T11:41:03.5145430Z ##[error]at org.sonar.api.batch.fs.internal.DefaultInputFile.newPointer(DefaultInputFile.java:206)

{{< / highlight >}}

This is really annoying, but actually I start investigating the error logging to the build server and checking the file that generates the error. When you have strange encoding erorr  **I strongly suggested you to visualize the file with some Hex editor, and not a standard editor.** I immediately realized that the error is due to my GitVersion task script, because it manipulates assemblyinfo.cs files to change version numbers and save back the assemblyinfo.cs in UTF-16 encoding. If you do not know Byte Order Mark I strongly suggest you to take a look in [wikipedia](https://en.wikipedia.org/wiki/Byte_order_mark), because this is an important concepts for Unicode files.

 **I immediately checked with an hex editor, and verified that the original assemblyinfo.cs has a BOM for UTF-8 but the PowerShell script modified it converting to UTF-16 but the BOM is correct.** The annoying stuff is that the build worked perfectly until I updated SonarQube (server + analyzers) this means that for some reason, the most recent version of Sonar somewhat does not check the BOM to understand file encoding.

I’ve solved the problem simply changing the Set-Content call to force UTF8 and the problem is gone.

{{< highlight powershell "linenos=table,linenostart=1" >}}


Set-Content -Encoding UTF8 -Path $file.FullName -Force

{{< / highlight >}}

I really like SonarQube, but you should always verify that everything works after every upgrade.

Gian Maria.
