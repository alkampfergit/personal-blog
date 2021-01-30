---
title: "Execute custom code during Tfs build"
description: ""
date: 2009-07-03T07:00:37+02:00
draft: false
tags: [Team Foundation Server]
categories: [Team Foundation Server]
---
At this point I explained how to setup a build, and how to fully customize it editing the msbuild file to execute some tasks, like open an issue when one or more test fail.

Another interesting stuff to explain is how to execute custom code during the build, to demonstrate this concept Iâ€™ll show how to tweet a warning message when test phase fails. To execute custom code you simply need to create a custom msbuild task that does everything you want, then you simply need to call this custom task in the build script. The first step is creating the task.

{{< highlight CSharp "linenos=table,linenostart=1" >}}
public class TweetTask : Task
{
    [Required]
    public String Username { get; set; }
    [Required]
    public String Password { get; set; }
    [Required]
    public String Tweet { get; set; }

    public override bool Execute()
    {
        TwitterService service = new TwitterService();
        String tweet = Tweet.Substring(0, Math.Min(Tweet.Length, 140));
        return service.SendMessage(Username, Password, tweet);
    }
}{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

As you can see, creating a custom task is really simple, you should inherit from the Task base class and override the Execute() method. In this example everything is done in the TwitterService class that I [took from this post](http://www.dreamincode.net/code/snippet2556.htm). To pass parameters to this task you can simply create public properties in the task class, and use the [Required] attribute to specify that the caller absolutely needs to specify these properties to use the task.

Now you only need to compile this class into a dll, and *make it avaliable to the build process*. This is probably the most interesting part, because  **the build engine must be able to locate this dll in order to execute your custom action**. Another requirement I want, is that you must be able to use your custom task without the need to physically go to tfs server and copy the dll into some directory. This because you must be able to fully configure the build with the same set of permission you have in tfs. I do not want to ask someone â€œHey copy this dll into the tfs serverâ€, I simply want to configure everything in visual studio.

This is a well known problem for everyone that works with Continuous integration machines, and the solution I like is  **inserting everything is needed for the build in a specific folder into the source control system of the project**.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2009/07/image-thumb6.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2009/07/image6.png)

As you can see I created a folder called BuildTools, inside it another folder called MsBuildCustomTasks and inside the compiled dll with my actino. Now Iâ€™m sure that the dll with my custom task is included into the source control system, and I can refer to it inside the TFSBuild.proj build file.

{{< highlight xml "linenos=table,linenostart=1" >}}
<UsingTask
        TaskName="DotNetMarche.MsBuildExtensions.Twitter.TweetTask"
         AssemblyFile="..\sources\BuildTools\MsBuildCustomTasks\DotNetMarche.MsBuildExtensions.dll"/>{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

to import the custom task you simply need to specify the task name and the assemblyFile in a  **&lt;UsingTask&gt;** directive, as you can see the path of the dll is..\sources\xxx where xxx is the path of the dll relative to the root of the source control system. Now if you do a check-in the next build will comprehend your custom task. This technique is useful, because you can be sure that each build always do a â€œGet Latestâ€ to build the latest version of the source, thus getting also every tool it need to do the build.

Now you can use this task wherever you want:

{{< highlight xml "linenos=table,linenostart=1" >}}
<TweetTask
    Condition="'$(IsDesktopBuild)' != 'true' and '$(TestSuccess)' != 'true'"
    Username="alkampfer" 
    Password="xxxxxxxxxxx" 
    Tweet="Unit Test Failure in build number: $(BuildNumber)" />{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

As for the previous post, Iâ€™m asking to tweet a message to my twitter account when test phase fails during the build, I made a test fails, commit everything and after integration machine finished to build I can see this in my twitterDesk

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2009/07/image-thumb7.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2009/07/image7.png)

WOW :D you can have your CI machine tweet whenever you want with less than 20 lines of code. You can now create a dedicated twitter account for every project you have, and you can follow status of the build in every device that supports twitter :D.

Alk.

Tags: [Team Foundation Server](http://technorati.com/tag/Team%20Foundation%20Server)
