---
title: "Hosting wcf service in precompiled web sites"
description: ""
date: 2009-04-28T03:00:37+02:00
draft: false
tags: [ASPNET]
categories: [ASPNET]
---
The situation is the following: I have a web site (not a web application) that have one wcf service hosted with the classic svc file. Everything works as expected, until I use a Deployment Web Project to build a site with â€œallow the precompiled site to be updatableâ€ to false. Now if I browse the service in my dev machine everything is ok, but when I deploy in production server I obtain a 404 error.

After a search I found that other people have the same problem, and finally I come across [this post](http://social.msdn.microsoft.com/forums/en-US/wcf/thread/8c897f8e-2143-450e-a9f4-97d1f8702da7/) that gives me the solution. It turns out that Web Site, when precompiled, writes the name of the site in the.compiled file. If I go into the bin directory of the deploy directory, I can verify that Myservice.svc.989dc2fb.compiled have the customstring attribute  equal to â€œNameOfWebSite/Service/MyService.svcâ€. Since my dev machine I'm working into have IIS5 (windows XP) I mounted the site in a virtual directory called â€œNameOfWebSiteâ€ and everything works, but when I deploy the site on the production server the service stops working because the site is mounted in the root path of the site.

The solution is to change the customstring attribute to â€œ/service/MyService.svc||â€¦â€ to correctly match the real folder in production server.

This is not a good thing to do, because I hate to insert manual steps in the build process, so I proceed to create a [nant task](http://nant.sourceforge.net/release/latest/help/tasks/xmlpoke.html) that corrects my problem.

{{< highlight xml "linenos=table,linenostart=1" >}}
<target name="WCFCompiledCorrection" depends="GetPublishingProperties">
 <xmlpoke file="${ProjectDir}\Deploy\${BuildConfiguration}\bin\MyService.svc.989dc2fb.compiled"
          xpath="/preserve/@customString" 
           value="/Services/MyService.svc||..."
          />
</target> {{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

As you can see the only drawback is that name of the file contains some hash code (989dc2fb), but the code seems to be stable (I tried to change something and recompile again in my dev machine and in deploy server), another issue is that the value is a very long string, because the customString attribute is a very long one, and that string contains a lot of reference to assemblies, so if the service changes references, I need to update the script.

The final step is creating a warning in the build document, stating that if the build fails in the above task, you need to check name of the file to see if it is changed, and if the service does not work in production, you need to manually verify the data in the.compiled files and update the task accordingly.

Alk.

Tags: [WCF](http://technorati.com/tag/WCF) [IIS](http://technorati.com/tag/IIS) [Precompiled Asp.Net](http://technorati.com/tag/Precompiled%20Asp.Net)
