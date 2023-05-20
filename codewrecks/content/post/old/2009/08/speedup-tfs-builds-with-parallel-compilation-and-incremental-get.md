---
title: "Speedup Tfs builds with parallel compilation and incremental get"
description: ""
date: 2009-08-13T09:00:37+02:00
draft: false
tags: [Continuos Integration,Team Foundation Server]
categories: [Tfs]
---
For large projects, the time needed to run a build can grow considerably large, until it eventually pass the famous barrier of [10 minutes](http://www.think-box.co.uk/blog/2006/02/ten-minute-build-continuous.html). To speedup build time you can try to use some features of TFS,

 **Parallel Builds:** Msbuild can run faster in multicore environment with the use of [parallel builds](http://msdn.microsoft.com/en-us/library/bb383805.aspx), to enable this feature you can simply go to the machine where the tfs build agent is installed and you need to modify the file *tfsbuildservice.exe.config* located in *C:\Program Files\Microsoft Visual Studio 9.0\Common7\IDE\PrivateAssemblies,*and change the value for the MaxProcesses key property

{{< highlight xml "linenos=table,linenostart=1" >}}
    <!-- MaxProcesses
         Set this value to the maximum number of processes MSBuild.exe should
         use for builds started by agents hosted by this executable.
        -->
    <add key="MaxProcesses" value="1" />{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

Remember also that there are some properties of the build process that are related with parallel builds,  one is the *BuildInParallel*that can be set to false to disable Parallel Builds, then you can set *BuildConfigurationInParallel*or *BuildSolutionInParallel*to fine tuning the parallelization of the process. Both of these properties are set to true by default. These settings can be used to [solve specific problem](http://social.msdn.microsoft.com/Forums/en-US/tfsbuild/thread/db1a5098-d1f8-4df4-a894-2d175f76db80).

 **Incremental builds.** By default for each build the build agent download every file specified in the build workspace and regenerates all binary. For large project you can have better performance if you get only changed files and generate only the corresponding binaries. To achieve this you can set to true a couple of properties: *IncrementalGet*: instructs build machine to get only the files that are changed from last build, and *IncrementalBuild:* that instructs build machine to generate only binary for changed source file. To change these ones you can simply edit TFSBuild.proj

{{< highlight xml "linenos=table,linenostart=1" >}}
<PropertyGroup>
<IncrementalGet>true</IncrementalGet>
</PropertyGroup>{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

These two simple tricks can speed up build process for large projects, thus keeping your build time lower than 10 minutes.

alk.

Tags: [Team foundation Server](http://technorati.com/tag/Team%20foundation%20Server) [Continuous Integration](http://technorati.com/tag/Continuous%20Integration)
