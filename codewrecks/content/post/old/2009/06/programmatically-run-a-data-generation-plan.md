---
title: "Programmatically run a Data Generation Plan"
description: ""
date: 2009-06-01T09:00:37+02:00
draft: false
tags: [Testing]
categories: [Testing]
---
Iâ€™m quite surprised, I was simply looking for a way to run a Data Generation Plan (.dgen) file in Visual Studio Team Edition, but it seems to me that the class that does this have some internal methods. When You generate the first database test Visual Studio ask you all information to run schema sync and data generation, if you look at generated code you can see this code.

{{< highlight CSharp "linenos=table,linenostart=1" >}}
[AssemblyInitialize()]
public static void IntializeAssembly(TestContext ctx)
{
    //Setup the test database based on setting in the configuration file
    DatabaseTestClass.TestService.DeployDatabaseProject();
    DatabaseTestClass.TestService.GenerateData();
}{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

This is run first of every code in the test project, but I really have the need to run different data generation plan in different part of my code. If you look at the DatabaseTestClass with reflector you can be really surprised, it has a TestService class that is of type DatabaseTestService.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2009/06/image-thumb.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2009/06/image.png)

As you can see it has a GenerateData method that permits you to specify dgen file name, *but it is protected.*I really wonder why, but it seems that you cannot run database generation file programmaticallyâ€¦or not?

Here is the solution

{{< highlight CSharp "linenos=table,linenostart=1" >}}
public static void RunDataGenerationPlan(
    String path,
    String projectFile,
    String dataGenerationFile, 
    bool clearDatabase, string providerInvariantName, string connectionString)
{
    FileInfo project = new FileInfo(Path.Combine(path, projectFile));
    FileInfo generation = new FileInfo(Path.Combine(path, dataGenerationFile));

    Microsoft.Build.BuildEngine.Engine engine = new Engine(ToolsetDefinitionLocations.Registry);
    engine.DefaultToolsVersion = "3.5";
    Project msBuildProject = new Project(engine);

    msBuildProject.Load(project.FullName);
    BuildPropertyGroup group = msBuildProject.AddNewPropertyGroup(false);
    group.AddNewProperty("ConnectionString", connectionString);
    group.AddNewProperty("SourceFile", generation.FullName);

    group.AddNewProperty("PurgeTablesBeforePopulate", clearDatabase.ToString());
    group.AddNewProperty("Verbose", "True");

    //FileLogger logger = new FileLogger();
    //logger.Parameters = @"logfile=D:\temp\build.log";
    //engine.RegisterLogger(logger);
    if (!engine.BuildProject(msBuildProject, "DataGeneration"))
    {
        throw new AssertFailedException("Cannot Generate Data plan");
    }

}{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

The solution is really simple, it is true that I have no way to invoke that protected method (Except reflection), but msbuild can be invoked programmatically, so I create an Engine class, load the main project file, then set some properties for the project such as ConnectionString, Verbose etc. With properties  you can specify the **â€œSourceFileâ€** that is the data generation file that you want to run. Iâ€™ve found a sample [here](http://social.msdn.microsoft.com/Forums/en-US/vstsdb/thread/5e750da2-24a0-4e4e-8eae-761f56c27b2c) that explain the xml syntax for msbuild, so I simply translate it into C# code using the Engine of msbuild directly from code. You need to imports Microsoft.Build.Engine to make this code compile. Now I can use that function in this way.

{{< highlight csharp "linenos=table,linenostart=1" >}}
[TestMethod]
public void TestMethod1()
{
    DatabaseTestServiceHelper.RunDataGenerationPlan(
        @"..\..\..\NorthWindDatabase\",
        @"NorthWindDatabase.dbproj",
        @"Data Generation Plans\GenerationA.dgen",
        true,
        "System.Data.SqlClient",
        @"Data Source=localhost\sql2008;Initial Catalog=NorthWindForUnitTesting;Integrated Security=True;Pooling=False");
}{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

And I can decide programmatically when to run a specific data generation plan. The code to regenerate the whole structure is not important, it is enough for me to run at the beginning of test. The only thing I do not like is the need to use relative path to references project file and data generation plan file, but since it is uncommon to change relative path of the projects, Iâ€™m quite satisfied of it.

Alk.

Tags: [data generation plan](http://technorati.com/tag/data%20generation%20plan) [visual studio](http://technorati.com/tag/visual%20studio)
