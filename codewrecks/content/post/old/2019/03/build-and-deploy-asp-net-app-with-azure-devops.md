---
title: "Build and Deploy AspNet App with Azure DevOps"
description: ""
date: 2019-03-28T19:00:37+02:00
draft: false
tags: [build,release]
categories: [Azure DevOps]
---
I’ve blogged in the past about deploying ASP.NET application, but lots of new feature changed in Azure DevOps and it is time to do some refresh of basic concepts.  **Especially in the field of web.config transform there is always lots of confusion and even if I’m an advocate of removing every configuration from files and source, it is indeed something that worth to be examined.** >  **The best approach for configuration is removing then from source control, use configuration services, etc and move away from web.config.** But since most people still use web.config, lets start with a standard ASP.NET application with a Web.Config and a  **couple of application settings that should be changed during deploy.** [![image](http://www.codewrecks.com/blog/wp-content/uploads/2019/03/image_thumb-8.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2019/03/image-8.png)

 ***Figure 1***: *Simple configuration file with two settings*

When it is time to configure your release pipeline, you  **MUST adhere to the mantra: Build once, deploy many. This means that you should have one build that prepares the binaries to be installed, and the very same binaries will be deployed in several environment.** Since each environment will have a different value for app settings stored in web.config, I’ll start creating a web config transform for the Release configuration (then one that will be released), changing each configuration with a specific token.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2019/03/image_thumb-9.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2019/03/image-9.png)

 ***Figure 2***: *Transformation file that tokenize the settings*

In Figure 2 I show how I change the value of Key1 setting to \_\_Key1\_\_ and Key2 to \_\_Key2 **\_\_. This is necessary because I’ll replace these value with the real value during release.** > The basic trick is changing configuration values in files during the build, setting some tokenized value that will be replaced during release. Using double underscore as prefix and suffix is enough for most situations.

Now it is time to create a build that generates the package to install. The pipeline is really simple, the solution is build with MsBuild with standard configuration for publishing web site. I’ve used MsBuid and not Visual Studio Task, because I do not want to have Visual Studio on my build agent to build, MsBuild is enough.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2019/03/image_thumb-10.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2019/03/image-10.png)

 ***Figure 3***: *Build and publish web site with a standard MsBuild task.*

If you run the build you will be disappointed  **because resulting web.config is not transformed, but it remains with the very content of the one in source control.** This happens because transformation is an operation that is not done during standard web site publishing, but from Visual Studio when you use publish wizard.  **Luckly enough there is a task in preview that performs web.config transformation, you can simply place this task before MsBuild task and the game is done.** [![image](http://www.codewrecks.com/blog/wp-content/uploads/2019/03/image_thumb-11.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2019/03/image-11.png)

 ***Figure 4***: *File transform task is in preview but it does its work perfectly*

As you can see in Figure 4, you should simply specify the directory of the application, then choose XML transformation and finally the option to use web.$(BuildConfiguration).config transformation file to transform web.config.

Now you only need to copy the result of the publish into the artifact staging directory, then upload with standard upload artifact task.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2019/03/image_thumb-12.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2019/03/image-12.png)

 ***Figure 5***: *Copy result of the publish task into staging directory and finally publish the artifact.*

If you read other post of my blob you know that I usually place a PowerShell script that reorganize files, compress etc, but for this simple application it is perfectly fine to copy the \_PublishedWebsites/ directory as build artifact.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2019/03/image_thumb-13.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2019/03/image-13.png)

 ***Figure 6***: *Published artifacts after the build completes.*

> Take time to verify that the output of the build (Artifacts) is exactly what you expected before moving to configure the release.

Before going to build the release phase, please download the web.config file and verify that the substitution were performed and web.config contains what you expected.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2019/03/image_thumb-14.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2019/03/image-14.png)

 **Fiure 7:** *Both of my settings were substituted correctly.*

 **Now it is time to create the release, but first of all I suggest you to install** [**this extension**](https://marketplace.visualstudio.com/items?itemName=qetza.replacetokens&amp;targetId=0ab47163-c335-4202-af04-4f37a747eecb&amp;utm_source=vstsproduct&amp;utm_medium=ExtHubManageList) **that contains a nice task to perform substitution during a release in an easy and intuitive way.** >  **One of the great power of Azure DevOps is extensibility, there are tons of custom task to perform lots of different task, so take time and look in the marketplace if you are not able to find the Task you need from basic ones.** Lets start creating a simple release that uses the previous build as artifact, and contains two simple stages, dev and production.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2019/03/image_thumb-15.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2019/03/image-15.png)

 ***Figure 8***: *Simple release with two stages to deploy the web application.*

Each of the two stages have a simple two task job to deploy the application and they are based on the assumption that each environment was already configured (IIS installed, site configure etc), so,  **to deploy our asp.net app, we can simply overwrite the old installation folder and replace with the new binaries.** The Replace Token task comes in hand in this situation, you simply need to add as the first task of the job (before the task that copies file into IIS directory),  **then configure prefix and suffix with the two underscore to match criteria used to tokenize configuration in web.config** [![image](http://www.codewrecks.com/blog/wp-content/uploads/2019/03/image_thumb-16.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2019/03/image-16.png)

 ***Figure 9***: *Configure replace token suffix and prefix to perform substitution.*

In this example only web.config should be changed, but the task can perform substitution on multiple files.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2019/03/image_thumb-17.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2019/03/image-17.png)

 ***Figure 10***: *Substition configuration points to web.config file.*

The beautiful aspect of transform task is that it uses all the variables of the release to perform substitution.  **For each variable it replace token using prefix and suffix, this is the reason of my transformation release file in the build; my web.config file has \_\_Key1\_\_ and \_\_Key2\_\_ token inside configuration, so I can simply configure those two variables differently for the two environment and my release is finished.** If you use Grid visualization it is immediate to understand how each stage is configured.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2019/03/image_thumb-18.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2019/03/image-18.png)

 ***Figure 11***: *Configure variables for each stage, the replace task will do the rest.*

Everything is done, just trigger a release and verify that the web config of the two stages is changed accordingly.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2019/03/image_thumb-19.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2019/03/image-19.png)

 ***Figure 12***: *Sites deployed in two stages with different settings, everything worked as expected.*

Everything worked good, I was able to build once with web.config tokenization, then release the same artifacts in different stages with different configurations managed by release definition.

Happy AzDo
