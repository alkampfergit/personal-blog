---
title: "YAML build in VSTS"
description: ""
date: 2017-11-26T17:00:37+02:00
draft: false
tags: [build]
categories: [Azure DevOps]
---
One of the most exciting feature that was recently introduced in VSTS is  **the ability to create YAML Build**. You need to enable this feature because it is still in preview and as usual you can enable for your account from the preview feature management

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2017/11/image_thumb-4.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2017/11/image-4.png)

 ***Figure 1***: *Enable YAML feature for the entire account*

After you enable this feature, when you create a new build you can create a build based on YAML.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2017/11/image_thumb-5.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2017/11/image-5.png)

 ***Figure 2***: *Create a build based on YAML definition*

 **A build definition based on YAML is nothing more that the standard build system, but instead of using a graphic editor in the browser, you define the task to use and the sequence of tasks directly in a yaml file**. To understand the syntax for the YAML file you can directly follow the [tutorial in MSDN at this address](https://docs.microsoft.com/en-us/vsts/build-release/actions/build-yaml).

> YAML build definition greatly enhance the build system of VSTS, it allows to directly create multiple YAMLS files in code to define builds.

This is a preview and if you want to experiment you need to browse source code of tasks directly from the code in GitHub. I’ll do a more detailed post on how to setup a real build looking up tasks,  **for this simple introductory post I’ll use a super simple build definition to use a custom task of mine.** [![image](http://www.codewrecks.com/blog/wp-content/uploads/2017/11/image_thumb-6.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2017/11/image-6.png)

 ***Figure 3***: *Simple build definition with a simple task.*

This is not a real build, but it shows how simple is to create a YAML build, just write one task after another and you are ready to go. Now I can create a YAML build and the only option is the name of the script

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2017/11/image_thumb-7.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2017/11/image-7.png)

 ***Figure 4***: *Simple YAML build, just choose queue, name of the build and the path of YAML definition*

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2017/11/image_thumb-8.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2017/11/image-8.png)

 ***Figure 5***: *Queue a build and verify that your definition was run*

Ok, we can agree that the overall experience is still rough, expecially because you need to lookup name and parameter of the tasks directly from code, but I really believe that this is the future. Here are the advantages that I see in this approach

 **YAML builds uses the very same engine of the standard build.** This is one of my favorites, you have a single build engine and YAML definition is only an alternate way to define a build, so you can switch whenever you want, you can write a custom task once and run for both classic build and YAML build and so on.

 **Each branch have its own definition of the build.** When you work with Git it is standard to have many branches and with classic builds, having a build that can work with different branch is not always easy. Thanks to conditional execution you can execute a task only if you are in a specific branch, but this is clumsy. Thanks to the YAML file, each branch can change build definition.

 **Infrastructure as code.** From a DevOps perspective, I prefer to have everything in the code. I can agree that build is not really infrastructure, but the concept is the same. Build definitions are really part of the project and they should be placed in the code.

 **Moving between accounts.** Thanks to Git, moving code between accounts (ex to consolidate accounts), is super easy ut moving builds between accounts is really not an easy process. Thanks to YAML definition, as soon as I move the code, I also moved the builds and this will simplify moving code between accounts.

More to come.

Gian Maria.
