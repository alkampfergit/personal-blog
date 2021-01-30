---
title: "Integrating GitVersion and Gitflow in your vNext Build"
description: ""
date: 2015-10-17T09:00:37+02:00
draft: false
tags: [build,nuget]
categories: [Azure DevOps]
---
In previous article I’ve showed how to create a VSO build vNext to automatically publish a nuget package to Myget (or nuget) during a build. [\[Publishing a Nuget package to Nuget/Myget with VSO Build vNext\]](http://www.codewrecks.com/blog/index.php/2015/09/26/publishing-a-nuget-package-to-nugetmyget-with-vso-build-vnext/). Now it is time to create a  **more interesting build that automatically version your assemblies and nuget packages based on** [**GitFlow**](http://nvie.com/posts/a-successful-git-branching-model/).

## GitFlow and GitVersion

 **GitFlow is a simple convention to manage your branches** in your Git repository to support a production branch, a developement branch and Feature/Support/Release/hotfix branches. If you are completely new on the subject you can find information at the following locations:

- – [A successful Git Branching Model](http://nvie.com/posts/a-successful-git-branching-model/)
- – [GitFlow CheatSheet](http://danielkummer.github.io/git-flow-cheatsheet/)

You can find also a nice plugin for Visual Studio that will support GitFlow directly from Visual Studio IDE and  **also install GitFlow for your command line environment in one simple click.** [[VS 2015 version](https://visualstudiogallery.msdn.microsoft.com/f5ae0a1d-005f-4a09-a19c-3f46ff30400a)] [[VS 2013 version](https://visualstudiogallery.msdn.microsoft.com/27f6d087-9b6f-46b0-b236-d72907b54683)]. Once you get accustomed with GitFlow, next step is having a look at [**Semantic Versioning**](http://semver.org/) **,  a simple versioning scheme to manage your packages and assemblies**.

The really good news, is that a free tool called [GitVersion](https://github.com/GitTools/GitVersion) exists to do semantic versioning simply examining your git history, branches and tags. I strongly suggest you to read documentation for GitVersion online, but if you want a quick start, in this blog post I’ll show you how you can integrate with a vNext VSO build.

> Thanks to GitVersion tool you can easily manage SemVer in a build vNext with little effort.

## 

## How GitVersion works at a basic level

GitVersion can be downloaded in the root folder of your repository; once it is there invokeing directly from command line with /ShowConfig parameter will generate a default configuration file.

{{< highlight bash "linenos=table,linenostart=1" >}}


GitVersion /ShowConfig &gt; GitVersionConfig.yaml

{{< / highlight >}}

This will create a default configuration file for GitVersion in the root directory called GitVersionConfig.yaml.  **Having a configuration file is completely optional, because GitVersion can work with default options, but it is really useful to explicit default parameter to know how Semantic Versioning is handled by the tool**.

I’m not going throught the various options of the tool, you can [read the doc online](http://gitversion.readthedocs.org/en/latest/)  and I’ll blog in future post about a couple of options I usually change from default.

For the scope of this article, everything I need to know is that,  **invoking gitversion.exe without parameters in a folder where you have a git repository with gitflow enabled will return you a Json data.** Here is a possible example:

{{< highlight bash "linenos=table,linenostart=1" >}}


{
  "Major":1,
  "Minor":5,
  "Patch":"0",
  "PreReleaseTag":"unstable.9",
  "PreReleaseTagWithDash":"-unstable.9",
  "BuildMetaData":"",
  "BuildMetaDataPadded":"",
  "FullBuildMetaData":"Branch.develop.Sha.8ecde89ef5b97eabcf6e0035119643334ba40c4e",
  "MajorMinorPatch":"1.5.0",
  "SemVer":"1.5.0-unstable.9",
  "LegacySemVer":"1.5.0-unstable9",
  "LegacySemVerPadded":"1.5.0-unstable0009",
  "AssemblySemVer":"1.5.0.0",
  "FullSemVer":"1.5.0-unstable.9",
  "InformationalVersion":"1.5.0-unstable.9+Branch.develop.Sha.8ecde89ef5b97eabcf6e0035119643334ba40c4e",
  "BranchName":"develop",
  "Sha":"8ecde89ef5b97eabcf6e0035119643334ba40c4e",
  "NuGetVersionV2":"1.5.0-unstable0009",
  "NuGetVersion":"1.5.0-unstable0009",
  "CommitDate":"2015-10-17"
}

{{< / highlight >}}

This is the result of invoking GitVersion in develop branch; and now it is time to understand how these version numbers are determined.   **My Master Branch is actually tagged 1.4.1 and since develop will be the next version, GitVersion automatically increments Minor versioning number** (this is the default and can be configured). FullSemVer number contains the suffix unstable.9 because develop branch is usually unstable, and it is 9 commits behind the master. **This will immediately gives me an idea on how much work is accumulating.** Now if I start a release 1.5.0 using command *git flow release start 1.5.0*a new release/1.5.0 branch is created, and running GitVersion in that branch returns a FullSemVer of 1.5.0.0-beta0.  **The suffix is beta, because a release branch is something that will be released (so it is a beta) and 0 means that it is 0 commits behind develop branch**. If you continue to push on release branch, the last number continues to increment.

Finally when you finish the release, the release branch is merged with master, master will be tagged 1.5.0 and finally release branch is merged back to develop. Now running GitVersion on develop returns version 1.6.0-unstable.xxx because now master is on 1.5.x version and develop will be the next version.

## How you can use GitVersion on build vNext

You can read about how to integrate GitVersion with build vNext directly on [GitVersion documentation](http://gitversion.readthedocs.org/en/latest/more-info/build-server-setup/tfs-build-vnext/), but I want to show you a slightly different approach in this article.  **The way I use GitVersion is, directly invoking in a Powershell build file that takes care of everything about versioning**.

The main reason I choose this approach is: GitVersion can store all the information about versioning in environment variables, but in build vNext environment variables are not maintained by default between various steps. The second reason is: I **already have a bulid that publish on nuget with build number specified as build variable, so I’d like to grab version numbers in my script and use it to change variable value of my build**.

Thanks to PowerShell, parsing Json output is super easy, here is the simple instructions I use to invoke GitVersion and parse all json output directly into a PowerShell variable.

{{< highlight powershell "linenos=table,linenostart=1" >}}


$Output = &amp;..\GitVersion\Gitversion.exe /nofetch | Out-String
$version = $output | ConvertFrom-Json

{{< / highlight >}}

> Parsing output of GitVersion inside a PowerShell variable gives you great flexibility on how to use all resulting numbers from GitVersion

Then I want to version my assemblies with versions returned by GitVersion. I starts creating some Powershell variables with all the number I need.

{{< highlight powershell "linenos=table,linenostart=1" >}}


$assemblyVersion = $version.AssemblySemver
$assemblyFileVersion = $version.AssemblySemver
$assemblyInformationalVersion = ($version.SemVer + "/" + $version.Sha)

{{< / highlight >}}

I’ll use the same PowerShell script I’ve described in [this post to version assemblies](http://www.codewrecks.com/blog/index.php/2014/01/11/customize-tfs-2013-build-with-powershell-scripts/), but this time all the versioning burden is taken by GitVersion. As you can see  **I’m using also the AssemblyInformationalVersion attribute that can be set as any string you want**. This will give me a nice file version visible from Windows.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2015/10/image_thumb17.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2015/10/image17.png)

 ***Figure 1***: *Versioning of the file visible in windows.*

This immediately tells me: this is a beta version and gives me also the SHA1 of the commit used to create the DLL, maximum traceability with minimum effort. Now is time to use some build vNext commands to version nuget.

## 

## How Build vNext can accepts command from powershell

Build vNext infrastructure can accept commands from PowerShell script looking at the output of the script, [as described in this page](https://github.com/Microsoft/vso-agent-tasks/blob/master/docs/authoring/commands.md).

> One of the coolest feature of build vNext is the ability to accept commands from console output of any script language

Write-Output in powershell is all that I need to send commands to build vNext engine. Here is how I change some build variables:

{{< highlight powershell "linenos=table,linenostart=1" >}}


Write-Output ("##vso[task.setvariable variable=NugetVersion;]" + $version.NugetVersionV2)
Write-Output ("##vso[task.setvariable variable=AssemblyVersion;]" + $assemblyVersion)
Write-Output ("##vso[task.setvariable variable=FileInfoVersion;]" + $assemblyFileVersion)
Write-Output ("##vso[task.setvariable variable=AssemblyInformationalVersion;]" + $assemblyInformationalVersion)

{{< / highlight >}}

If you remember my [previous post](http://www.codewrecks.com/blog/index.php/2015/09/26/publishing-a-nuget-package-to-nugetmyget-with-vso-build-vnext/) on publishing Nuget Packages, you can see that I’ve used the NugetVersion variable in Build Definition to specify version number of nuget package.  **With the first line of previous snippet I’m automatically changing that number to the NugetVersionV2 returned by GitVersion.exe**. This is everything I need to version my package with SemVer.

Finally I can use one of these two instructions to change the name of the build.

{{< highlight powershell "linenos=table,linenostart=1" >}}


Write-Output ("##vso[task.setvariable variable=build.buildnumber;]" + $version.FullSemVer)
Write-Output ("##vso[build.updatebuildnumber]" + $version.FullSemVer)

{{< / highlight >}}

The result of these two instructions is quite the same, the first one change build number and change also the variable build.buildnumber, while the second one only changes the number of the build, without changing the value of build.buildnumber variable.

## 

## Final result

My favourite result is: my build numbers now have a real meaning for me, instead of simply representing a date and an incremental build like 20150101.2.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2015/10/image_thumb18.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2015/10/image18.png)

 ***Figure 2***: *Resulting builds with SemVer script*

Now each build name immediately tells me the branch used to create the build, and the version of the code used. As you can see,  **release and master branches are in continuous deployment, because at each push the build is triggered and nuget package is automatically  published**. For Develop branch the build is manual, and is done only when I want to publish a package with unstable version.

I can verify that everything is ok on MyGet/Nuget side, packages were published with the correct numbers.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2015/10/image_thumb19.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2015/10/image19.png)

 ***Figure 3***: *SemVer is correctly applied on NuGet packages*

> Thanks to GitVersion I can automatically version: build number, all the assemblies and NuGet package version with few lines of powershell.

## 

## Conclusions

Thanks to build vNext easy of configuration plus powershell scripts and simple command model with script output, with few lines of code you are able to use Semantic Versioning in your builds.

This example shows you some of the many advantages you have with the new build system in VSO/TFS.

Gian Maria.
