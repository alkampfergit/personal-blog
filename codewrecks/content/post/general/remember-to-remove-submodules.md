---
title: "Remove submodule completely from your git repository"
description: "If you stop using submodules in a Git Repository, please be sure to cleanup everything."
date: 2023-08-28T08:00:00+02:00
draft: false
tags: ["VisualStudio"]
categories: ["Programming"]
---

I have a project that **uses git submodules in the past** then they are removed long time ago, no-one had problem but I've noticed that Visual Studio had some strange warning during the build.

{{< highlight bash "linenos=table,linenostart=1" >}}
warning : Could not find a part of the path 'C:\develop\xxx\submodules\jarvis.catalog\.git'. The source code won't be available via Source Link.
{{< / highlight >}}

It seems that Visual Studio Integration with Git **still found information on submodules and tried to check something in corresponding folders**. I'm not sure that this warning was present since we removed the submodule, it seems more that some settings changed, but nevertheless we still have **some information in our repository pointing to old, not used anymore submodules.**.

Talking to other developers they told me that they already saw the warning but since no problem arise they simply did not investigate further. **My problem is that we have lots of this warning in local build, and maybe the build slows down due to these failing check for directories in file system.**

Checking **logs of Azure DevOps pipeline I did not find anyone of these warning**, so it seems that is something specific of my machine/configuration. 

Checking the repository I **still found a .gitmodules files with all configuration in the repository** that survived our cleanup of the repository. No-one noticed this problem because everything just work without submodule init etc, but Visual Studio and potentially other tools, checking the presence of the file **performs some check or other stuff during build/usage** and maybe the build is made slower due to these failed check of directories.

As a rule of thumb, if you remove / change some submodule configuration, always check your .gitmodules file for leftovers.

Removing the file completely removed the warning.

Gian Maria.