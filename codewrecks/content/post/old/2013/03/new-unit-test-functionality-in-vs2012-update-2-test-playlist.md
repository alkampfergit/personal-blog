---
title: "New Unit Test functionality in VS2012 Update 2 Test Playlist"
description: ""
date: 2013-03-14T07:00:37+02:00
draft: false
tags: [Unit Testing,VS2012]
categories: [Visual Studio]
---
In VS2012 we have support for basically any Unit Test Framework, because the new test runner is plugin based, and everyone can write plugin to make it compatible with the framework of choice. From the original version that was released with Visual Studio 2012 RTM, in Update 1 and Update 2 the test runner gained a lot of new feature, really useful for everyday work.

 **Update 2 introduced the concept of “Test Playlist”** : basically a simple tool to create a subset of Unit Tests that are meant to be managed together. Since Update 1 already introduced the concept of Traits to group tests, this feature can be seen as a duplicate, but traits and playlist have different meaning. Let’s see how to create a playlist.

To create a list simply  **choose one or how many tests you like in test explorer, right click on one of them and choose Add to Playlist** ; if there is no playlist already loaded, the only option is “New Playlist”, just give the playlist a name and a location and create a new one.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2013/03/image_thumb4.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2013/03/image4.png)

 ***Figure 1***: *Create a playlist from a test in Test Explorer*

Now you can continue to add other test to the playlist if you want; once you are done you can select the playlist from the top menu of the Test Explorer.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2013/03/image_thumb5.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2013/03/image5.png)

 ***Figure 2***: *You can now choose the playlist to use.*

A playlist is just an XML file that contains the list of all the test you added to the playlist. To continue adding test to the playlist you should use the top Menu to select “All Tests”, find tests you want to add to the playlist, and simple right click and choose to “Add to Playlist”; now you should see all the testlist of the project and not only the “new Playlist” option.

 **Once you select a playlist, the test runner works exactly as before, but it consider only the tests included in current playlist, you can filter, group by traits, etc etc**. To remove a test from a playlist, simply choose that playlist, right click on the test (or the tests) you want to remove and choose: Remove from current playlist.

As I told at the beginning of the post: the use of playlist is an alternative to use Traits to group test and run only a subset, but the main difference is that a Trait expresses a real property of the test, (ex the logical area of the software that got tested, or other attribute such Database to indicate that it needs a test database), while playlist are primarily meant to group together heterogeneous tests to simplify management, both for running test and manage them.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2013/03/image_thumb6.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2013/03/image6.png)

 ***Figure 3***: *Group by traits.*

This feature is also needed by all old MsTest users, that are used to create list of test to run with the old test runner.

Gian Maria.
