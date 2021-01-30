---
title: "Use Msbuild Custom Action in TFS2010 build with a custom project"
description: ""
date: 2009-11-09T13:00:37+02:00
draft: false
tags: [Team Foundation Server]
categories: [Team Foundation Server]
---
Since TFS Build 2010 is ruled by workflow foundation, what happens if you want to use a custom msbuild task that you already have used in the past? I agree with the fact that the right approach to use, is writing a custom activity, but you need to write more code, and if you already have a tested MsBuild custom task, probably the best approach is to reuse it in the build workflow.

First of all you need to know that, to integrate msbuild in a tfs2010 build, you can use the MsBuild activity, that can be used to simply launch msbuild against a custom project file. First of all you need to browse the workflow until you reach where you want your custom task to be executed, like in this screenshot:

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2009/11/image_thumb5.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2009/11/image5.png)

The full path on the process can be seen in the following one

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2009/11/image_thumb6.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2009/11/image6.png)

For this example *I want to tweet a message when one of the test fails*, and since failure in running test, raise an exception in the workflow, I simply added a new msbuild task to the exception part of the â€œTry Run testâ€ activity, and proceeded to fully configure it. We have a series of problems here, first of all, we need to write a.proj file that will import my custom task and execute it, and we need also to include the dll containing custom task into the source control. This last point is simplier, just drop the dll with custom tasks with source code.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2009/11/image_thumb7.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2009/11/image7.png)

As you can verify I simply created a BuildTools directory, that contains a MsbuildExtension where I put the dll containing my custom task. Now I need to create the custom msbuild proj file to use it.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2009/11/image_thumb8.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2009/11/image8.png)

As you can see Iâ€™ve simply created a subdirectory of the â€œBuildProcessTemplatesâ€ called CustomBuild where I put my TweetResult.proj file. Now what I need to write into my project file? Here is a possible example

{{< highlight xml "linenos=table,linenostart=1" >}}
<Project
    ToolsVersion="3.5"
    xmlns="http://schemas.microsoft.com/developer/msbuild/2003">
    <UsingTask
                TaskName="DotNetMarche.MsBuildExtensions.Twitter.TweetTask"
                 AssemblyFile="..\..\BuildTools\MsBuildExtension\DotNetMarche.MsBuildExtensions.dll"/>

    <Target Name="Start">
        <TweetTask
             Username="AlkProjects"
            Password="xxxxx"
            Tweet="Build $(BuildNumber) has failing tests." />
    </Target>
</Project>{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

Ok, this is a very simple project file, the path to the dotnetmarche.msbuildextensions.dll is relative to the tweetresult.proj file, so we need to go back 2 directories and then the dll is in BuildTools\msbuildextension\dotnetmarche.msbuildextension.dll. It also uses the property $(BuildNumber). Now you need to instruct your MSBuild activity to use that project file, simply edit the Project property:

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2009/11/image_thumb9.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2009/11/image9.png)

When you press the â€œeditâ€ button you can insert data in the â€œExpression Editorâ€ that seems to use Visual Basic Syntax by default. To locate the project you need to use the BuildAgent class that has GetExpandedBuildDirectory that in turns needs the BuildDetail.BuildDefinition variable. Luckily you have intellisense into the Expression Editor ;) so it is quite simple process. At this base directory you will add the full path of the project as you see in Source tree, you need to use *\source* to identify source, then *\experiments* that represents the name of the project, and finally the remaining part of the directory. The only difficult part is to know how the build agent creates directory to build the project.

Since this MsBuild task is executed in the context of the tweetResult.proj file, it has no access to the standard properties of the build workflow, to assign value to properties you need to use CommandLineArguments

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2009/11/image_thumb10.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2009/11/image10.png)

My tweetresult.proj needs only BuildNumber property, so it is really simple. Finally you need to set property LogFileDropLocation to the value  **logFileDropLocation** , that at run time gets expanded in a subfolder of the drop location called logs, so you can read what happened  just browsing to the drop location

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2009/11/image_thumb11.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2009/11/image11.png)

I launched it after I broke some tests, just to verify if everything is ok and here is the result

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2009/11/image_thumb12.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2009/11/image12.png)

I get a tweet each time a build has some failing tests :) and reusing my old custom Msbuild task.

Alk.

Tags: [Team Foundation Server](http://technorati.com/tag/Team%20Foundation%20Server)
