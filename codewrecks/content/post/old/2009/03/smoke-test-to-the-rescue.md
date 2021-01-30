---
title: "Smoke Test to the rescue"
description: ""
date: 2009-03-02T07:00:37+02:00
draft: false
tags: [Testing]
categories: [Testing]
---
A particular type of Unit Test are called [Smoke Tests](http://xunitpatterns.com/Smoke%20Test.html), and are of great importance in a project. This [term](http://en.wikipedia.org/wiki/Smoke_testing) originally derive from [Electronics](http://en.wikipedia.org/wiki/Electronics) where the smoke test means "light the board and look if you can see any smoke". In software engineering we can use the same metaphor to verify if some piece of software "smokes when used".

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2009/03/image-thumb.png)](https://www.codewrecks.com/blog/wp-content/uploads/2009/03/image.png)

The purpose of a smoke test is to verify some basilar property of a component, and can be very simple, it simply calls some functions or class methods, just to see if they exists or if they throw exceptions when called.

Suppose you have a class called *ChannelFilter*, it accepts a List of integer as constructor parameter and uses that list to do a query on a complex domain model to retrieve some informations. Suppose also that the software has an architecture with no facilities for Database testing. This means that you do not have Database Sandbox or similar structure, in tests you can only query the main developing database and you should not modify data. In such an environment the typical smoke test is the following.

{{< highlight xml "linenos=table,linenostart=1" >}}
[Test]
public void TestSmokeChannelFilter()
{
   List<Int32> param = new List<Int32>();
   param.AddRange(new[] { 1, 2, 3 });
   ChannelFilter filter = new ChannelFilter(param);
}{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

Even if this test does not assert nothing, it is logical asserting that

- *Class ChannelFilter has a constructor that accepts a list of integer*
- *The query generated in the constructor can be executed and does not throws exception*

The first point is important if you make heavy use of Inversion of Control, with castle I configured this class passing a list of Integer as parameter, if you change the constructor of the class (maybe adding a required parameter) everything will compile well, but when you try to instantiate the class with Castle at runtime, you will get an error. This test prevents this problem because it contains particular type of implicit assertion "* **the fact that the test compiles will assure me that the ChannelFilter class have a constructor that accepts a list of integer** *". Even if this is not a typical unit test assertion, for smoke test is perfectly valid.

Even for the second point you can complain that the test does not verify the real data returned from the database, so you cannot be sure if the query issued by the ChannelFilter constructor returns correct data. This is true, but the test assures you that "* **the query can be executed** *", it is not complete but it is a lot more than having no test. In an environment where a lot of people can change database structure, it can happens that someone changes a field from not nullable to nullable. If you use Entity Framework you will end with an exception, because generated entity is not valid anymore. In such a situation the above test will fail, signaling you that some logic is broken, so you can immediately call for fireman to set off the fire.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2009/03/image-thumb1.png)](https://www.codewrecks.com/blog/wp-content/uploads/2009/03/image1.png)

A smoke test is also useful to debug code, if something in ChannelFilter does not convince you, you can fire test into debugger to see what is gone wrong.

The conclusion is that even if a good test should have some characteristics, a stupid test as the one shown before brings some value to the suite. In the above situation a real good test will makes use of Database Sandbox, will use routine to fill database with known data, and finally will check back ChannelFilter properties to see if the query runs ok and returns expected data…but it requires time to be written. I strongly encourage you to spend such a time to create good tests, but if you do not want to, remember that *a good suite of Smoke Tests is surely better of having no test*.

alk.

Tags: [Smoke Testing](http://technorati.com/tag/Smoke%20Testing) [Unit Testing](http://technorati.com/tag/Unit%20Testing)
