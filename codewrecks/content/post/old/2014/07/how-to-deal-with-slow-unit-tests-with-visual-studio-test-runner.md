---
title: "How to deal with Slow Unit Tests with Visual Studio Test Runner"
description: ""
date: 2014-07-02T15:00:37+02:00
draft: false
tags: [Unit Testing,Visual Studio]
categories: [Testing]
---
## The problem

One of the most dreadful problem of Unit Testing is slow testing. If your whole suite of tests runs in 10 minutes, it is normal for developers not to run the whole suite at each build. One of the most common question is

> How can I deal with slow Unit Tests?

Here is my actual scenario: in a project I’m working in, we have some multilingual full text search done in Elastic Search and we have a battery of Unit Tests that verify that searches work as expected. Since each test deletes all documents, insert a bunch of new documents and finally commits lucene index, execution times is high compared to the rest of tests. Each test need almost 2 seconds to run on my workstation, where I have really fast SSD and plenty of RAM.

This kind of tests cannot be run in memory or with some fancy trick to make then run quickly. Actually  **we have about 30 tests that executes in less than one seconds, and another 13 tests that runs in about 23 seconds, this is clearly unacceptable**. After few hours of work, we already reached the point where running the whole suite becomes annoying.

## The solution

This is a real common problem and it is quite simple to fix. First of all Visual Studio Test runner actually tells you execution time for each Unit Test, so you can immediately spot slow tests. When you identify slow tests you can mark them with a specific category, I use *slowtest*

{{< highlight csharp "linenos=table,linenostart=1" >}}


    [TestFixture]
    [Category("elasticsearch")]
    [Category("slowtest")]
    public class EsSearcherFixture : BaseTestFixtureWithHelpers

{{< / highlight >}}

Since I know in advance that this test are slow I immediately mark the entire class with the attribute *slowtest.*If you have no idea what of your tests are slow, I suggest grouping test by Duration in Visual Studio Test Runner.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2014/07/image_thumb.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2014/07/image.png)

 ***Figure 1***: *Group tests by Duration*

The result is interesting, because Visual Studio consider every test that needs more than one second to be slow. I tend to agree with this distinction.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2014/07/image_thumb1.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2014/07/image1.png)

 ***Figure 2***: *Test are now grouped by duration*

This permits you to immediately spot slow tests, so you can add the category slowtest to them. If you keep your Unit Tests organized and with a good usage of categories, you can simply ask VS Test Runner to exclude slow test with filter –* **Traits:”slowtest”** *

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2014/07/image_thumb2.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2014/07/image2.png)

 ***Figure 3***: *Thanks to filtering I can now execute continuously only test that are not slow.*

I suggest you to do a periodic check to verify that every developers is using the slowtest category wisely, just group by duration, filters out the slowtest and you should not have no tests that are marked slow.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2014/07/image_thumb3.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2014/07/image3.png)

 ***Figure 4***: *Removing the slowtest category and grouping by duration should list no slow test.*

The nice part is that I’m using NUnit, because Visual Studio Test Runner supports many Unit Tests Frameworks thanks to the concepts of Test Adapters.

If you keep your tests well organized you will gain maximum benefit from them :).

Gian Maria.
