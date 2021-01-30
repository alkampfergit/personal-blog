---
title: "Database Test With DataBase Edition"
description: ""
date: 2009-06-19T03:00:37+02:00
draft: false
tags: [Testing]
categories: [Testing]
---
I really like the ability to use the Visual Studio Team System Database Edition to create Database Test where I can specify the Database Project with the structure and a DataGeneration Plan to preload data for testing.

While this is really good to create a set of unit test that are repeatable, it can slow up testing process during development. Letâ€™s make an example, I need to made a change in a stored procedure, so I write some tests to verify the new features, verify that they fail, and then start to work.

The process usually is

1. Modify the stored in the Database Project
2. Run the new tests
3. If new tests are all green rerun the whole test suite to verify that you have not broke something else.

If the modification is really complex you need to modify/run test more than one time, but since you are always running the same little test suite, you really does not need to redeploy database structure and run data generation plan at each iteration. Deploying database and running data generation plan at each test run can be time consuming.

Iâ€™m used to setup database test with transaction management to automatically rollback a transaction after each test, you can use [extensions project](http://www.codeplex.com/MSTestExtensions) or you can code it by yourself, because is a simple matter of using a TransactionScope object. In the end you will end with tests that do not alter the database. In such a situation I prefer to proceed this way: first of all I configure my database project to deploy to the test database, simply open property of the database project and goes into Deploy tab

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2009/06/image-thumb18.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2009/06/image18.png)

Then I go into the test project, goes into Database Folder, locate the DatabaseSetup.cs and comment out the two lines that actually does structure deploy and data generation

{{< highlight chsarp "linenos=table,linenostart=1" >}}
[AssemblyInitialize()]
public static void IntializeAssembly(TestContext ctx)
{
    //Setup the test database based on setting in the
    //configuration file
    //DatabaseTestClass.TestService.DeployDatabaseProject();
    //DatabaseTestClass.TestService.GenerateData();
}{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

Then I open the DataGenerationPlan I want to use and with the menu Data-&gt;DataGeneration Plan-&gt;Execute plan, I execute my plan against the test database.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2009/06/image-thumb19.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2009/06/image19.png)

Now Iâ€™m sure that

1. the database is prepared to be tested
2. No test will alter the content of the database (thanks to transaction maangement)

At this point I setup the build configuration to make a deploy of the DAtabase Project at each build, everything is now prepared for work.

I open the.sql file that contains the stored I want to modify, write some modifications, and then Build+Run Tests. With such a configuration Iâ€™m sure that at each build, my modification are propagated to test database, data are already there because I preloaded previously, and each test now run very fast. With this configuration I can really speed up development time avoiding unnecessary preload and structure syncronization.

When all new test passes I run the whole test suite, then remove the comment from the InitializeAssembly and do a check-in.

alk.

Tags: [msTest](http://technorati.com/tag/msTest)

<!--dotnetkickit-->
