---
title: "Failed to deploy database project error during database testing"
description: ""
date: 2009-08-26T05:00:37+02:00
draft: false
tags: [MsTest,Visual Studio]
categories: [Visual Studio]
---
When you create database test in a [MsTest](http://en.wikipedia.org/wiki/MSTest) project, usually it configure an initialization method that deploy the database schema before test runs.

{{< highlight CSharp "linenos=table,linenostart=1" >}}
[AssemblyInitialize()]
public static void IntializeAssembly(TestContext ctx)
{
    //Setup the test database based on setting in the
    //configuration file
    DatabaseTestClass.TestService.DeployDatabaseProject();{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

If something went wrong during this phase you probably will end with this not so much useful error message: â€œFailed to deploy database project â€¦â€

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2009/08/image-thumb27.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2009/08/image27.png)

And if you look at test result you have no more clue on what is actually failing.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2009/08/image-thumb28.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2009/08/image28.png)

To see actual error you need to look at the â€œRun detailsâ€

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2009/08/image-thumb29.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2009/08/image29.png)

Now you can see much more useful information on what is really gone wrong.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2009/08/image-thumb30.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2009/08/image30.png)

From this log you can verify that some post build action went wrong. So do not forget to always take a look at â€œrun detailâ€ to have detail on what is the reason of failure of the test.

Alk.

Tags: [MsTest](http://technorati.com/tag/MsTest)
