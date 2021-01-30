---
title: "Be sure to use latest version of Nuget Restore Task in VSTS Build"
description: ""
date: 2018-08-27T15:00:37+02:00
draft: false
tags: [build,VSTS]
categories: [Azure DevOps]
---
If you have in VSTS some old build that uses Nuget restore task, it is time to check if you are using the new version, because if you still use the 0.x version you are missing some interesting features.

> With VSTS build it is always a good habit to periodically check if some of the tasks have new version.

Here is as an example, how the version 0 is configured

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2018/08/image_thumb-18.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2018/08/image-18.png)

 ***Figure 1***: *Nuget restore task in version 0*

In Figure 1 you see how you configure a standard nuget restore task, if you are using version 0 (2) it is time to upgrade, especially because the old version of the task is not so flexible about the version to use (3).

Before changing version, you need to know that the newer version of this task goes hands to hands with another new Task, the  **Nuget Tool Installer Task** , that is designed to download and install a specific version of nuget that will be used by all subsequent task in the Phase.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2018/08/image_thumb-19.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2018/08/image-19.png)

 ***Figure 2***: *Thanks to the NugetToolInstaller task you can ensure that a specific version of NuGet is present in the system and used by all subsequent tasks.*

> Nuget Tool installer also ensure that all nuget task will use the very same version.

After the Nuget Tool Installer you can simply configure Nuget Task in version 2, see  **Figure 3.** [![image](https://www.codewrecks.com/blog/wp-content/uploads/2018/08/image_thumb-20.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2018/08/image-20.png)

 ***Figure 3***: *Nuget task version 2 in action*

As you can see you do not need to specify any version, the version used will be the one installed by the Nuget Installer task, so you are  **always sure that the exact version of Nuget is installed and available for the build to be used.** As usual, if you have build that sits there for long time, take your time to check if some of the tasks are available in newer and more powerful version. If you wonder how  **you can immediately check if some of the tasks have newer version, simply check for a little flag near the description of the task, as shown in Figure 4.** [![image](https://www.codewrecks.com/blog/wp-content/uploads/2018/08/image_thumb-21.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2018/08/image-21.png)

 ***Figure 4***: *A little flag icons warn you that you are using an old version of this task.*

Gian Maria.
