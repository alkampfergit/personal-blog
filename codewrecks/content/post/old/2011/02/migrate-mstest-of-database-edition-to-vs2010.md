---
title: "Migrate MsTest of database edition to VS2010"
description: ""
date: 2011-02-22T10:00:37+02:00
draft: false
tags: [DataDude,MsTest]
categories: [Visual Studio]
---
I have a VS2008 project that is being converted to VS2010. This solution has a MsTest test project used to run database test against a Database project. After conversion you need to target the 4.0 framework for the test project, you run the test and you get

> Microsoft.Build.BuildEngine.InvalidProjectFileException: Microsoft.Build.BuildEngine.InvalidProjectFileException: The expression "HKEY\_LOCAL\_MACHINE\SOFTWARE\Microsoft\VisualStudio\9.0\VSTSDB@VSTSDBDirectory" cannot be evaluated.. Aborting test execution

This is due to the fact that the test project probably references old version of the Microsoft.Data.Schema and Microsoft.Data.Schema.UnitTesting dll, just verify that you are using the correct version, simply remove the above two dll from references and add them again using the right version.

[![SNAGHTML5a3573](http://www.codewrecks.com/blog/wp-content/uploads/2011/02/SNAGHTML5a3573_thumb.png "SNAGHTML5a3573")](http://www.codewrecks.com/blog/wp-content/uploads/2011/02/SNAGHTML5a3573.png)

 ***Figure 1***: *reference rigth database testing dll for MSTest*

this is not enough, because you need also to go to app.config and change the version of the database test related configuration section

{{< highlight csharp "linenos=table,linenostart=1" >}}
<configSections>
<section name="DatabaseUnitTesting"
type="Microsoft.Data.Schema.UnitTesting.Configuration.DatabaseUnitTestingSection, Microsoft.Data.Schema.UnitTesting,
Version=10.0.0.0, Culture=neutral, PublicKeyToken=b03f5f7f11d50a3a"/>
{{< / highlight >}}

As you can see the Version should be changed to 10.0.0.0 because you should have 9.1.0.0 (the one related to VS2008 database testing tools)

Now all of your test should run fine again.

alk.
