---
title: "Custom Activities in TFS2010"
description: ""
date: 2009-12-07T11:00:37+02:00
draft: false
tags: [Tfs,TFS Build,workflow]
categories: [Team Foundation Server]
---
There is a good post on [Jim Lambâ€™s blog](http://blogs.msdn.com/jimlamb/archive/2009/11/18/how-to-create-a-custom-workflow-activity-for-tfs-build-2010.aspx) on how to customize tfs2010 build, but I decided to blog my experience because I need some more time to make it work.

The steps to create a custom activities in tfs2010 are the following ones. First of all create an activity, like this simple TweetActivity one. Respect the example of Jim, I need to add also the BuildExtensionAttribute to make it run.

{{< highlight xml "linenos=table,linenostart=1" >}}
[BuildActivity(HostEnvironmentOption.All)]
[BuildExtension(HostEnvironmentOption.Agent)]
public sealed class TweetActivity : CodeActivity
{
   [RequiredArgument]
   public InArgument<string> Username { get; set; }

   [RequiredArgument]
   public InArgument<string> Password { get; set; }

   [RequiredArgument]
   public InArgument<string> Tweet { get; set; }

   protected override void Execute(CodeActivityContext context)
   {

       TwitterService service = new TwitterService();
       String tweet = Tweet.Get(context);
       tweet = tweet.Substring(0, Math.Min(tweet.Length, 140));
       String result = service.SendMessage(Username.Get(context), Password.Get(context), tweet);
   }
}{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

This is a very simple activity that simply tweet a message. Then after you compile it, you need to save the assembly in a specific file of your source code, to be available from build agent.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2009/12/image_thumb.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2009/12/image.png)

You must configure the Build Controller to point at a specific folder to have it understand where to find assemblies that contains custom activities. These steps are really well described in [Jimâ€™s post](http://blogs.msdn.com/jimlamb/archive/2009/11/18/how-to-create-a-custom-workflow-activity-for-tfs-build-2010.aspx), so I do not give further details.

Then you face the first problem, if you copy the default workflow of the build (to avoid changing the basic one) and open it into Visual Studio, you donâ€™t see your custom action in toolbox so you are not able to add it to your build process. To solve this I decided to add my custom activity by hand, editing the xaml file. First of all you need to add the namespace

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2009/12/image_thumb1.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2009/12/image1.png)

Now you need to add your custom activity in the workflow flow, I decided, for simplicity, to add it before the get latest activity, so it is the very first activity that gets executed. After all I only wants to test if my action gets executed during the build.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2009/12/image_thumb2.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2009/12/image2.png)

Xaml files are simple enough to edit by hand, as you can see to add the custom activity, just add a da:TweetActivity (da is the alias I used for my namespace) and configure the properties. Then I commit everything and started a build.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2009/12/image_thumb3.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2009/12/image3.png)

Ok it works :).

alk.

Tags: [Team Foundation Server](http://technorati.com/tag/Team%20Foundation%20Server)
