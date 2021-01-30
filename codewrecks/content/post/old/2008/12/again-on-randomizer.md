---
title: "Again On randomizer"
description: ""
date: 2008-12-06T06:00:37+02:00
draft: false
tags: [Testing]
categories: [Testing]
---
If you read [last post](http://www.codewrecks.com/blog/index.php/2008/12/06/randomizer-nunit-addin/) you saw how to write a simple randomizer for the execution of NUnit test, but it has a problem, it mess up the nunit interface. The solution is not to ovveride the Tests property, but overriding the way the test are executed. To make it simple I simply take the TestSuite.cs file from original Nunit source code, then I simply change the order in witch the test are executed.

{{< highlight xml "linenos=table,linenostart=1" >}}
private void RunAllTests(
 TestSuiteResult suiteResult, EventListener listener, ITestFilter filter)
{
    Random rnd = new Random();
    foreach (Test test in ArrayList.Synchronized(Tests).Cast<Test>().OrderBy(ts => rnd.Next())){{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

All the rest of the methods are standard code from the 2.4.8 release of nunit, I simply added a randomization in the main execution cycle, now everything works as expected, because the interface does not mess up but each run it executes tests in random order.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2008/12/image-thumb1.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2008/12/image1.png) [![image](http://www.codewrecks.com/blog/wp-content/uploads/2008/12/image-thumb2.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2008/12/image2.png)

As you can see test execution is now completely random at each run.

alk.

Tags: [Nunit](http://technorati.com/tag/Nunit) [Nunit Addin](http://technorati.com/tag/Nunit%20Addin) [Randomize Tests](http://technorati.com/tag/Randomize%20Tests)
