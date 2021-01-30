---
title: "Test and Context"
description: ""
date: 2009-06-10T01:00:37+02:00
draft: false
tags: [Testing]
categories: [Testing]
---
For a Unit Test the most important concept, and probably the most difficult to manage is the concept of [Fixture](http://xunitpatterns.com/test%20fixture%20-%20xUnit.html). Quite often part of the Fixture is composed by an external File. In a little project that I use as example for jQuery I have a really simple class that parses an XML file to create a menu for Asp.Net MVC enabled site.

In such a situation the fixture of the test is using different source files to test the class with different input. In a classic NUNIT unit testing you can solve this problem including the file in the project with â€œCopy if newerâ€. With such a setting Visual Studio at each build check if the file is changed, and eventually copies the file into the appropriate directory (bin/debug/pathofthefile in standard debug configuration)

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2009/06/image-thumb1.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2009/06/image1.png)

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2009/06/image-thumb2.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2009/06/image2.png)

This approach is good, but has some problems, if you simply change the XML file, and rebuild the project, the file gets no copied in the output directory. This happens because Visual Studio correctly checks that no source file was changed, so it has no need to recompile. Another stuff I do not like is that I need to find the file *with the pat**h I used to insert it into the test project*.

{{< highlight xml "linenos=table,linenostart=1" >}}
[Test]
public void GrabMenuWithActionUrl()
{ 
 MasterLogic sut = new MasterLogic(new MyTestUrlHelper());
 List<MenuItem> menu = sut.CreateMenu("SampleFiles\\MenuType1.Xml").MenuItems;
 Assert.That(menu, Has.Count.EqualTo(2));
 Assert.That(menu[1].MenuItems[0], Has.Property("Url").EqualTo("/Photo/ManageAlbum"));
}{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

The same test can be written in msTest, but this time I have the DeploymentItem attribute, that can be used to specfy to mstest engine, that my test really need the file â€œSampleFiles\MenuType1.xmlâ€.

{{< highlight chsarp "linenos=table,linenostart=1" >}}
[TestMethod()]
[DeploymentItem(@".\SampleFiles\BaseMenu1.xml")]
public void CreateMenuTest()
{
    PrivateObject param0 = new PrivateObject(new MasterLogic(new MyTestUrlHelper()));
    MasterLogic_Accessor target = new MasterLogic_Accessor(param0);
    string menuFileName = @"BaseMenu1.xml";
    MenuItem expected = new MenuItem("TEST");
    target.CreateMenu(menuFileName);
    Assert.AreEqual(expected.Text, "TEST");
}{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

This is a cleaner way to express the fixture, thanks to the DeploymentItem attribute it is clear that the test needs the file SampleFiles\BaseMenu.xml, and most important, the file was copied automatically before each test runs and it is located in the same dir of the test assembly, so i can simply refer to it with the BaseMenu1.xml name without any path.

alk.

Technorati Tags: [msTest](http://technorati.com/tags/msTest),[Unit Testing](http://technorati.com/tags/Unit+Testing)
