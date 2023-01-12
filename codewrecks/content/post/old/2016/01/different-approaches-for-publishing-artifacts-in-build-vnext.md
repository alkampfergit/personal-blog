---
title: "Different approaches for publishing Artifacts in build vNext"
description: ""
date: 2016-01-30T10:00:37+02:00
draft: false
tags: [build]
categories: [Team Foundation Server]
---
I’ve wrote an old post that explain how you can [manage your artifacts with Build vNext](http://www.codewrecks.com/blog/index.php/2015/06/30/manage-artifacts-with-tfs-build-vnext/), in that post I suggested to use a custom PowerShell script that identify all of your files that needs to be published as artifacts, and move everything inside the Staging Directory.

I believe that  **this is the perfect approach for complex application, where we have some logic to be applied before publishing an artifact** , also it is super easy to compress everything with 7Zip to reduce the usage of your Upload Bandwidth if you have on-premises agent that needs to publish on VSTS (or simply because you want to save space in your shared folder used as a drop folder).

> Publishing artifacts is a Two Step Process, the first one identify and prepare what to publish, the second one actually do the real publishing on the target storage.

If you create a new Build definition today on VSTS this is the default template that is created for a Visual Studio Solution.

[![External Image](https://www.codewrecks.com/blog/wp-content/uploads/2016/01/image_thumb14.png "Actual template for standard Visual Studio Build")](https://www.codewrecks.com/blog/wp-content/uploads/2016/01/image14.png)

 ***Figure 1***: *Actual template for standard Visual Studio Build*

As you can see from  **Figure 1** , **publishing artifacts is composed by two distinct tasks, the first one copies files in ArtifactStagingDirectory, the other one published Artifacts**. This is a good approach, because you can use [Several Copy Files task](https://msdn.microsoft.com/en-us/Library/vs/alm/Build/steps/utility/copy-files) if you need to publish different type of files in different folder, but PowerShell task gives you a better flexibility.

> Preparing files with PowerShell gives you maximum flexibility about preparing what needs to be published.

Using a PowerShell approach is definitively a must if you care DevOps and continuous delivery. With real world and complex projects,  **you need to publish in drop folder something that can be taken from a script or some deployer to be deployed to some target environment**. Here is some common tasks done by the PowerShell script before copying data to StagingDirectory.

 **Rename all.exe.config files:** You can take all of your applicationname.exe.config file and rename to applicationname.exe.config.default. With such a technique,  **if you simply unzip and ovewrite executable on a test server you do no overwrite configuration files**. The application can have logic that copy all settings that does not exists in the.config.default to.config file. This helps tremendously manual deployment (avoiding to overwrite a config file carefully crafted for that environment).

 **Prepare configuration file for your Release Pipeline:** release pipelines can change configuration files for a given environment, but often you need to take the default config in source control and replace part with various pattern (ex: \_\_SettingsName\_\_), and this can be easily done with XML or Json manipulation in PowerShell.

 **Prepare different archives / package for different configuration:** if you have plugin based architecture, you probably want to create an archive with all the plugins, another one with no plugin, and a series of archive with different standard plugin configuration. Generally speaking, it is not so uncommon the nedd to have multiple packages/archives of your sofware composed by different combination of files of a same build.  **This is often simply done copying dll and adding something to configuration files and should be done automatically to create different packages with a single build.**  **Sanity check and security check:** All configuration files should be checked for some common pattern to identify if some sensitive information can be included in artifacts. What about if a developer leave some password unencrypted in some config file?

Surely you can have other examples on file manipulation checking that needs to be done to  prepare your artifacts, so I still think that, unless your project is really simple, preparing Artifacts with PowerShell is the right way to go.

Gian Maria Ricci
