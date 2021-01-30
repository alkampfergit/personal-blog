---
title: "Error during dotnet restore in a VSTS Build"
description: ""
date: 2017-05-27T09:00:37+02:00
draft: false
tags: [build,VSTS]
categories: [Team Foundation Server]
---
I’ve a build that runs perfectly on some agents, but fails in others, and the error is in the  **dotnet restore** action. Here is the log of the failure:

{{< highlight bash "linenos=table,linenostart=1" >}}


2017-05-27T10:07:39.3285800Z C:\Program Files\dotnet\sdk\1.0.4\NuGet.targets(97,5): error :   The content at 'http://nuget.syncfusion.com/javascript' is not a valid JSON object. [C:\vso\_work\14\s\src\NBus.sln]
2017-05-27T10:07:39.3285800Z C:\Program Files\dotnet\sdk\1.0.4\NuGet.targets(97,5): error :   Unexpected character encountered while parsing value: &lt;. Path &#039;&#039;, line 0, position 0. [C:\vso\_work\14\s\src\NBus.sln]
2017-05-27T10:07:39.5535786Z ##[error]Error: C:\Program Files\dotnet\dotnet.exe failed with return code: 1
2017-05-27T10:07:39.5545769Z ##[error]Dotnet command failed with non-zero exit code on the following projects : C:\vso\_work\14\s\src\NBus.sln

{{< / highlight >}}

It turns out that  **those specifics agent machines have a global nuget configuration file that adds syncfusion nuget package source to the list of available nuget sources**. That nuget source probably is not valid for dotnet restore command and the result is that the build is failing because dotnet restore throws errors.

> When you have multiple build agents, you need to tests your build on all the agents, because there could be some specific machine configuration that will fail your build.

 **I’ve tried using the switch –ignore-failed-sources, but it seems that this does not work, the build is still failing** , because dotnet restore command line writes errors in the output, and VSTS infrastructure consider the task as failed if there are errors in the output.

While a perfectly viable solution is simply to have VSTS continue on errors, this is not good, because all of my builds would be partially failed due to this configuration. Another solution would be to remove completely the syncfusion source from failing agents, but this could break other builds that rely on having that source configured.

 **The perfect solution is adding a Nuget.config file inside the source of my project, and disable entirely the syncfusion source**. Here is the content of my nuget.config file.

{{< highlight xml "linenos=table,linenostart=1" >}}
<?xml version="1.0" encoding="utf-8"?>
<configuration>
  <packageRestore>
    <add key="enabled" value="True" />
    <add key="automatic" value="True" />
  </packageRestore>
  
  <disabledPackageSources>
    <add key="syncfusion" value="http://nuget.syncfusion.com/javascript" />
  </disabledPackageSources>
  
  <activePackageSource>
    <add key="nuget.org" value="https://www.nuget.org/api/v2/" />
  </activePackageSource>
  
  <packageSources>
    <add key="nuget.org" value="https://www.nuget.org/api/v2/" />
  </packageSources>
</configuration>{{< / highlight >}}

Please notice the disabledPackageSources node that allows me to completely disable the syncfusion repository. **Now I only need to configure the dotnet restore task to use that config file, and I can do this simply with this command line arguments**.

{{< highlight bash "linenos=table,linenostart=1" >}}


--ignore-failed-sources --configfile nuget.config

{{< / highlight >}}

Now I re-run the build and everything is green, hooray!, the dotnet restore task is now green.

{{< highlight bash "linenos=table,linenostart=1" >}}


2017-05-27T10:22:18.3232894Z ##[section]Starting: dotnet restore
2017-05-27T10:22:18.3232894Z ==============================================================================
2017-05-27T10:22:18.3242884Z Task         :.NET Core
2017-05-27T10:22:18.3242884Z Description  : Build, test and publish using dotnet core command-line.
2017-05-27T10:22:18.3242884Z Version      : 1.0.1
2017-05-27T10:22:18.3242884Z Author       : Microsoft Corporation
2017-05-27T10:22:18.3242884Z Help         : [More Information](https://go.microsoft.com/fwlink/?linkid=832194)
2017-05-27T10:22:18.3242884Z ==============================================================================
2017-05-27T10:22:19.2303015Z [command]"C:\Program Files\dotnet\dotnet.exe" restore C:\vso\_work\14\s\src\NBus.sln --ignore-failed-sources --configfile nuget.config
2017-05-27T10:22:22.8802882Z   Restoring packages for C:\vso\_work\14\s\src\NBus.Core\NBus.Core.csproj...
2017-05-27T10:22:22.8802882Z   Restoring packages for C:\vso\_work\14\s\src\NBus.Integration.Tests\NBus.Integration.Tests.csproj...
2017-05-27T10:22:22.8822887Z   Restoring packages for C:\vso\_work\14\s\src\NBus.Mongo\NBus.Mongo.csproj...
2017-05-27T10:22:22.8822887Z   Restoring packages for C:\vso\_work\14\s\src\NBus.TestConsole\NBus.TestConsole.csproj...
2017-05-27T10:22:22.8822887Z   Lock file has not changed. Skipping lock file write. Path: C:\vso\_work\14\s\src\NBus.Core\obj\project.assets.json
2017-05-27T10:22:22.8822887Z   Restore completed in 680,2 ms for C:\vso\_work\14\s\src\NBus.Core\NBus.Core.csproj.
2017-05-27T10:22:22.8832888Z   Restoring packages for C:\vso\_work\14\s\src\NBus.Tests\NBus.Tests.csproj...
2017-05-27T10:22:22.8832888Z   Lock file has not changed. Skipping lock file write. Path: C:\vso\_work\14\s\src\NBus.Mongo\obj\project.assets.json
2017-05-27T10:22:22.8832888Z   Restore completed in 764,02 ms for C:\vso\_work\14\s\src\NBus.Mongo\NBus.Mongo.csproj.
2017-05-27T10:22:24.0062940Z   Lock file has not changed. Skipping lock file write. Path: C:\vso\_work\14\s\src\NBus.TestConsole\obj\project.assets.json
2017-05-27T10:22:24.0062940Z   Restore completed in 1,91 sec for C:\vso\_work\14\s\src\NBus.TestConsole\NBus.TestConsole.csproj.
2017-05-27T10:22:24.0333033Z   Lock file has not changed. Skipping lock file write. Path: C:\vso\_work\14\s\src\NBus.Integration.Tests\obj\project.assets.json
2017-05-27T10:22:24.0333033Z   Restore completed in 1,94 sec for C:\vso\_work\14\s\src\NBus.Integration.Tests\NBus.Integration.Tests.csproj.
2017-05-27T10:22:24.3422928Z   Lock file has not changed. Skipping lock file write. Path: C:\vso\_work\14\s\src\NBus.Tests\obj\project.assets.json
2017-05-27T10:22:24.3442923Z   Restore completed in 1,45 sec for C:\vso\_work\14\s\src\NBus.Tests\NBus.Tests.csproj.
2017-05-27T10:22:24.3452928Z   
2017-05-27T10:22:24.3452928Z   NuGet Config files used:
2017-05-27T10:22:24.3452928Z       C:\vso\_work\14\s\src\nuget.config
2017-05-27T10:22:24.3452928Z   
2017-05-27T10:22:24.3452928Z   Feeds used:
2017-05-27T10:22:24.3452928Z       https://www.nuget.org/api/v2/
2017-05-27T10:22:24.4362914Z ##[section]Finishing: dotnet restore

{{< / highlight >}}

> When nuget is involved, it is always a good habit to create a specific.nuget configuration file, instead of relying on global configuration of the machine.

Gian Maria.
