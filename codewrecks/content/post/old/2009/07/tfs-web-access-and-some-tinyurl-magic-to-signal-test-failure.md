---
title: "Tfs Web access and some tinyurl magic to signal test failure"
description: ""
date: 2009-07-06T07:00:37+02:00
draft: false
tags: [Tfs]
categories: [Team Foundation Server]
---
In the [last post](http://www.codewrecks.com/blog/index.php/2009/07/03/execute-custom-code-during-tfs-build/) of Tfs series, I showed how  to build a msbuild custom action to tweet when build test run fails. Using [twitter](http://twitter.com/) can seem strange at first, and probably not so professional to associate to a project build, but this is not true. Twitter is a free service that can be consumed from many devices, you can use tool such as [twitterDeck](http://tweetdeck.com/beta/) to manage all of your tweets in your desktop environment and to categorize them, but you can also use any mobile phone, so it is probably the most serious way to signal build problems to everyone is interested in the build process of a certain project.

The only great limitation of twitter is that it cannot convey more than 140 characters, and it is difficult to give enough information to the user in such little space. Here is a typical result from a failure build

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2009/07/image-thumb9.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2009/07/image9.png)

When anyone interested in the project looks at this message, he immediately know that something is gone wrong, but how can he know what exactly is gone wrong? To solve this problem we must do a couple of things.

The first step is installing the [Visual Studio Team System Web Access 2008 SP1 Power Tool](http://www.microsoft.com/downloads/details.aspx?FamilyId=3ECD00BA-972B-4120-A8D5-3D38311893DE&amp;displaylang=en), an extension to tfs that permits Tfs management from a web interface like this one.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2009/07/image-thumb10.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2009/07/image10.png)

Since this site can use windows authentication to manage user permissions, you can even expose this site to the entire internet, so everyone that has permission, can manage Tfs server simply from a pc with a browser and internet access. I do not want to show you all the possibilities that the web access power tool can give to you, but I immediately noticed an interesting stuff: I can browse into the team build, then I can look at details of every build:

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2009/07/image-thumb11.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2009/07/image11.png)

This pages shows me full details about the build, now if you look closely at the query string, you can see that it specify the build to show with the parameter  **builduri=vstfs///build/build/41** ;) now is the time to do some other custom action. To tweet such a long url is impossible, but you can use [tinyurl](http://tinyurl.com/) to shorten it to be tweeted without problem.

This means that I need another custom msbuild action, this one is slightly different from the one used to tweet the message, because it need to returns the string with the new url (the one returned by the tiny process). Here is the full task definition.

{{< highlight CSharp "linenos=table,linenostart=1" >}}
public class TinyUrlTask : Task
{
    [Required]
    public String Url { get; set; }

    [Output]
    public String TinedUrl { get; set; }

    public override bool Execute()
    {
        TinedUrl = TinyUrl.MakeTinyUrl(Url);
        return true;
    }
}{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

The only difference with the tweeter task is the presence of a property marked with [Output] parameter, and in the Execute() method I simply call an external class that shorten the url with TinyUrl and then I stored the result of the task into TinedUrl output property. With such a definition I can modify the build script with this custom action to execute after tests are run

{{< highlight xml "linenos=table,linenostart=1" >}}
<Target Name="AfterTest">

    <!-- Refresh the build properties. -->
    <GetBuildProperties TeamFoundationServerUrl="$(TeamFoundationServerUrl)"
                                 BuildUri="$(BuildUri)"
                                 Condition=" '$(IsDesktopBuild)' != 'true' ">
        <Output TaskParameter="TestSuccess" PropertyName="TestSuccess" />
    </GetBuildProperties>

    <TinyUrlTask Url="http://10.0.0.200:10001/UI/Pages/Build/Details.aspx?builduri=$(BuildURI)">
        <Output TaskParameter="TinedUrl" ItemName="TinedBuildUrl" />
    </TinyUrlTask>
    <TweetTask
        Condition="'$(IsDesktopBuild)' != 'true' and '$(TestSuccess)' != 'true'"
        Username="alkampfer"
        Password="xxxxxxxxx"
        Tweet="Build TestFailed:@(TinedBuildUrl)" />
</Target>{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

The tiny url task is called passing the url that points to the build result, fortunately the only parameter that this page needs is the  **BuildUri** , that is passed with querystring and is contained in the msbuild variable $(BuildURI). The result of this task is retrieved with the Output node, where you can specify the output property you want to know with the TaskParameter attribute and the propertygroup where to store this value in the ItemName attribute. The final effect is that the @(TinedBuildUrl) propertyGroup contains the encoded url returned by tinyurl server after the TinyUrlTask is invoked. Now you can simply call the same TweetTask of the previous post to tweet the link to the web page that shows the details of the build. If you commit some code that will make a single test fail you got a tweet like this.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2009/07/image-thumb12.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2009/07/image12.png)

The great difference from the previous version, is that the tweet now contains a link that can be immediately clicked to browse build results.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2009/07/image-thumb13.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2009/07/image13.png)

Thanks to tinyurl, that long url was shortened into a twittable one and you can look at build detail with a single click, how cool :). Now you can simply create a twitter account for each build, and everyone interested in that project can follow the corresponding twitter account to be notified of each build failure, and for each tweet he got clickable link that immediately takes him to the page with the results of the failing build.

Managing projects in such a way is real fun!!!!

alk.

Tags: [Team Foundation Server](http://technorati.com/tag/Team%20Foundation%20Server)
