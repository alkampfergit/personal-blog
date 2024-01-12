---
title: "Resolving .NET8 SDK Resolver Failure in Azure DevOps Pipelines"
description: "A guide to fixing .NET8 SDK resolver failure in Azure DevOps pipelines."
date: 2024-01-05T07:10:42+02:00
draft: false
categories: ["AzureDevOps"]
tags: ["Pills"]
---

I encountered a problem with a simple pipeline designed for building a .NET Core project, which I had recently updated to .NET8. After updating the pipeline file to use the new version of the SDK, I faced an unexpected issue: **all builds started failing with this error**.

```text
##[error]src\Intranet\Jarvis.Common.Shared\Jarvis.Common.Shared.csproj(0,0): Error MSB4242: SDK Resolver Failure: "The SDK resolver 'Microsoft.DotNet.MSBuildSdkResolver' failed while attempting to resolve the SDK 'Microsoft.NET.Sdk'. Exception: 'Microsoft.NET.Sdk.WorkloadManifestReader.WorkloadManifestCompositionException: Manifest provider Microsoft.NET.Sdk.WorkloadManifestReader.SdkDirectoryWorkloadManifestProvider returned a duplicate manifest ID '16.4.8968-net8-rc2'.
```

I was really puzzled because I had the same SDK directory on my computer, and it was workgin without any issues, **but failing on that build server**.

Then I checked and I found a similar error due to **having preview version of a previous SDK installed in the system**. True to this theory, the build machine I was using had an old preview version of .NET Core 7 installed. Then I removed preview version and subsequently, the pipeline started functioning correctly again. Therefore, if you're facing a similar error in your pipeline, I strongly recommend inspecting your build agent to remove any SDK previews through the control panel that might be installed on your system.

Gian Maria
