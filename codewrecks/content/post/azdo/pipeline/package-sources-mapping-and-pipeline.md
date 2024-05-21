---
title: "Azure DevOps: Package source mapping in pipeline"
description: "Package source mapping enabled solutions that point to more than one package sources can build perfectly locally but failed to build when script is run from a pipeline. Let's understand why."
date: 2024-05-21T07:00:42+00:00
draft: false
categories: ["AzureDevops"]
tags: ["AzDo"]
---

If you use more than one Nuget Feed in your solution and especially if you are using central package versioning, you probably got a warning telling you to use **Package Source Mapping**. The process is straightforward, it consist in modifying your nuget.config file **to specify for each package the source feed where nuget can find the package**.

Here is an example for a solution I'm working:

{{< highlight powershell "linenos=table,linenostart=1" >}}
<?xml version="1.0" encoding="utf-8"?>
<configuration>
    <packageRestore>
        <add key="enabled" value="True" />
        <add key="automatic" value="True" />
    </packageRestore>
    <activePackageSource>
        <add key="nuget.org" value="https://api.nuget.org/v3/index.json" />
        <add key="ProximoAzDo" value="https://pkgs.dev.azure.com/xxx/_packaging/yyy@Local/nuget/v3/index.json" />
    </activePackageSource>
    <packageSources>
        <add key="nuget.org" value="https://api.nuget.org/v3/index.json" />
        <add key="ProximoAzDo" value="https://pkgs.dev.azure.com/xxx/_packaging/yyy@Local/nuget/v3/index.json" />
    </packageSources>

    <packageSourceMapping>
        <packageSource key="nuget.org">
            <package pattern="*" />
        </packageSource>
        <packageSource key="ProximoAzDo">
            <package pattern="Jarvis*" />
            <package pattern="Proximo*" />
        </packageSource>
    </packageSourceMapping>
</configuration>
{{< / highlight >}}

As you can see I have **two different feed, one is nuget.org and the other is a private feed hosted in Azure DevOps**. In the ProximoAzdo I can simply specify with wildcard the name of the packages that are to be taken from that specific feed, while the nuget.org has the generic * and is used for anyhing else.

Everything works perfectly locally, but it failed to compile in Azure DevOps Pipeline with the following error

> error NU1100: Unable to resolve 'Jarvis.Proxy.Shared (>= 0.18.1)' for 'net8.0'. PackageSourceMapping is enabled, the following source(s) were not considered: feed-ProximoAzDo, nuget.org. [C:\fast\_work\443\s\src\Jarvis.IntegrationTest.sln]

This is rather annoying, because it is impossible to **replicate the error locally so it is due to some different form of execution of dotnet restore command in a pipeline**. The think that puzzled me is that the name of the two feeds are ***feed-ProximoAzdo*** and ***nuget.org***, but in the file my private feed is called ProximoAzdo not feed-ProximoAzdo.

So I changed the nuget.config file in this way

{{< highlight powershell "linenos=table,hl_lines=20,linenostart=1" >}}
<?xml version="1.0" encoding="utf-8"?>
<configuration>
    <packageRestore>
        <add key="enabled" value="True" />
        <add key="automatic" value="True" />
    </packageRestore>
    <activePackageSource>
        <add key="nuget.org" value="https://api.nuget.org/v3/index.json" />
        <add key="ProximoAzDo" value="https://pkgs.dev.azure.com/xxx/_packaging/yyy@Local/nuget/v3/index.json" />
    </activePackageSource>
    <packageSources>
        <add key="nuget.org" value="https://api.nuget.org/v3/index.json" />
        <add key="ProximoAzDo" value="https://pkgs.dev.azure.com/xxx/_packaging/yyy@Local/nuget/v3/index.json" />
    </packageSources>

    <packageSourceMapping>
        <packageSource key="nuget.org">
            <package pattern="*" />
        </packageSource>
        <packageSource key="feed-ProximoAzDo">
            <package pattern="Jarvis*" />
            <package pattern="Proximo*" />
        </packageSource>
    </packageSourceMapping>
</configuration>
{{< / highlight >}}

As you can see the only change is the key of package source where I prefixed the name of the feed with the feed- prefix. Now the **pipeline runs correctly**. Actually this error is also described in the very end of the [official documentation page](https://learn.microsoft.com/en-us/nuget/consume-packages/package-source-mapping) (this is a memento to always read ALL the documentation :D).

Reason is here [#15542](https://github.com/microsoft/azure-pipelines-tasks/issues/15542)

![Workaround of source mapping in nuget.config to have it work in Azure DevOps pipeline](../images/nuget-workaround-feed.jpg)

***Figure 1***: *Workaround of source mapping in nuget.config to have it work in Azure DevOps pipeline*

Gian Maria.
