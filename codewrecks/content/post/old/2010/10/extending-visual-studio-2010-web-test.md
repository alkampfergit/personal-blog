---
title: "Extending Visual Studio 2010 Web Test"
description: ""
date: 2010-10-28T07:00:37+02:00
draft: false
tags: [Testing,Visual Studio,Web Test]
categories: [Testing]
---
Visual Studio has an integrated Web Test tool capable to record navigation in IE to create web tests that can be used even for Load Testing. One of the most interesting capabilities of this tool, is that it is pluggable.

Suppose you have recorded a simple test that verifies the registration procedure for a web site, this test suffer from a well known problem, whenever you will run it, it will try to register the same user again and again and it fails. Moreover, if I want to use this test in a web load test I could not use Data Driven Test because I really want a random string to be generated each time the test is run to be sure that a new username gets registered. Sounds complicated? Maybe not :)

First of all add a dll project to your solution, reference the Microsoft.VisualStudio.QualityTools.WebTestFramework library and add this class to the project.

{{< highlight csharp "linenos=table,linenostart=1" >}}
[Description("Generates a random string for a context parameter")]
public class RandomContextParam : WebTestRequestPlugin
{
[Description("Context parameter name that we want to create")]
public String ContextParameterName { get; set; }
 
public override void PreRequestDataBinding(
object sender,
PreRequestDataBindingEventArgs e)
{
var rng = new RNGCryptoServiceProvider();
byte[] random = new byte[16];
rng.GetBytes(random);
var value = BitConverter.ToString(random).Replace("-", "");
e.WebTest.Context.Add(ContextParameterName, value);
base.PreRequestDataBinding(sender, e);
}
}
{{< / highlight >}}

This is all you need to generate a random string during test, overriding the PreRequestDataBinding, generate a random string, and then add to the test context thanks to e.WebTest.Context.Add() method. Now you can simply take your recorded web test for user registration, reference the project that contains this plugin-in and add a request plug-in

[![SNAGHTML49f9e9](https://www.codewrecks.com/blog/wp-content/uploads/2010/10/SNAGHTML49f9e9_thumb.png "SNAGHTML49f9e9")](https://www.codewrecks.com/blog/wp-content/uploads/2010/10/SNAGHTML49f9e9.png)

 ***Figure 1***: *Create the plug-in project, insert the class in it and reference it from the project that contains the web test*

[![SNAGHTML4b3ed5](https://www.codewrecks.com/blog/wp-content/uploads/2010/10/SNAGHTML4b3ed5_thumb.png "SNAGHTML4b3ed5")](https://www.codewrecks.com/blog/wp-content/uploads/2010/10/SNAGHTML4b3ed5.png)

 ***Figure 2***: *Add the plugin to the request where the user is created.*

Now you need to configure the plugin, it has only a property that is used to specify the name of the context parameter to use for the random string.

[![SNAGHTML4e2118](https://www.codewrecks.com/blog/wp-content/uploads/2010/10/SNAGHTML4e2118_thumb.png "SNAGHTML4e2118")](https://www.codewrecks.com/blog/wp-content/uploads/2010/10/SNAGHTML4e2118.png)

 ***Figure 3***: *Configure the plugin and the test to use the random string*

Now I run the test and verify that the username has a random value.

[![SNAGHTML4fe724](https://www.codewrecks.com/blog/wp-content/uploads/2010/10/SNAGHTML4fe724_thumb.png "SNAGHTML4fe724")](https://www.codewrecks.com/blog/wp-content/uploads/2010/10/SNAGHTML4fe724.png)

This simple example shows how simple is to create a plug-in for Visual Studio web test.

Alk.
