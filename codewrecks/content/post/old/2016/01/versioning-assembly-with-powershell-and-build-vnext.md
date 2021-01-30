---
title: "Versioning assembly with powershell and build vNext"
description: ""
date: 2016-01-29T16:00:37+02:00
draft: false
tags: [build,VSTS]
categories: [Team Foundation Server]
---
In an old blog post I explained how to [version  assembly  during TFS 2013 build with Powershell Scripts](http://www.codewrecks.com/blog/index.php/2014/01/11/customize-tfs-2013-build-with-powershell-scripts/). The goal is  **modifying assemblyinfo.cs and assemblyinfo.vb with PowerShell in a TFS 2013 build** for a project based on TFVC. If you are interested in Git I’ve [other post on the subject](http://www.codewrecks.com/blog/index.php/2015/10/17/integrating-gitversion-and-gitflow-in-your-vnext-build/).

Now that the build system is changed in Visual Studio Team Services and in TFS 2015, people asked me to  **update that scripts to work with the new build system**. It turns out that the work needed to update the scripts is only one line of code, because an environment variable is changed between the two build system, but all the rest remains equal.

> If you use PowerShell scripts to customize the build, you are less dependant on build infrastructure and you have an easiest path on moving to new build systems.

You can download a zip with the script from [this address](https://onedrive.live.com/redir?resid=288FBF38C031D5F3!201986&amp;authkey=!AKmPDREJryfnwZc&amp;ithint=file%2czip), and the usage is straightforward **. Just check-in the scripts under a directory of your project, or in a common directory in TFVC. Once you’ve checked in the file, you can simply add a PowerShell script task before the actual build**.

[![image_thumb\[2\]](https://www.codewrecks.com/blog/wp-content/uploads/2016/01/image_thumb2_thumb.png "image_thumb[2]")](https://www.codewrecks.com/blog/wp-content/uploads/2016/01/image_thumb21.png)

 ***Figure 1***: *Add PowerShell script before the build stage*

Then I simply specify where the script is located in my source control and specify the list of arguments it needs.

[![image_thumb\[5\]](https://www.codewrecks.com/blog/wp-content/uploads/2016/01/image_thumb5_thumb.png "image_thumb[5]")](https://www.codewrecks.com/blog/wp-content/uploads/2016/01/image_thumb51.png)

 ***Figure 2***: *Configure the script to run*

This script needs a bunch of parameters to run:

{{< highlight csharp "linenos=table,linenostart=1" >}}
-srcPath $(Build.SourcesDirectory)\src -assemblyVersion 2.5.0.0 -fileAssemblyVersion 2.5.J.B{{< / highlight >}}

Version number has a special syntax where J is substituted with date expressed with 5 digits: first 2 represents the year 2016 is 16, while the other three digits represents the progressive number of day in the year. The other special char is B that is substituted with build progressive number. If you remember the default build number in TFS / VSTS ends with a dot followed by the daily incremental number for the build.

There are no special operation to do in your build. Here is the output.

[![image_thumb\[8\]](https://www.codewrecks.com/blog/wp-content/uploads/2016/01/image_thumb8_thumb.png "image_thumb[8]")](https://www.codewrecks.com/blog/wp-content/uploads/2016/01/image_thumb81.png)

 ***Figure 3***: *Output of the build*

Selecting the powershell task, you can verify (2) that the  **script correctly determines version number as 2.5.16023.4. This is the fourth build of 23 January 2016**. In point 3 you can see that the script simply changed various AssemblyInfo.cs and AssemblyInfo.vb to update the number before the build.

Thanks to PowerShell I was able to fully reuse a script prepared for the old Build System in the new system with very little work.

Gian Maria.
