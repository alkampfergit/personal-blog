---
title: "Automatic deployment of a web application with TFS Build"
description: ""
date: 2009-10-23T09:00:37+02:00
draft: false
tags: [Tfs]
categories: [Software Architecture,Team Foundation Server]
---
When you develop web applications you usually have X developers solving bugs and implementing features, and a series of testers that test application during developing process. A must to have requirement is that

1. Modifications to the trunk are visible as soon as possible to testers.
2. Data in test database gets preserved

Point 2 is especially important, testers usually work with the site and fills database with data. Suppose that tester John find a bug that occurs only with specific data, a developer correct the bug, then a deploy is done, all test data are wiped away, and the tester is not able to verify if the bug is gone.

Moreover testers usually fill the database with real data useful for testing, then you need to deploy update to web application while updating database schema preserving data. The optimum solution is the one represented by this schema

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2009/10/image-thumb8.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2009/10/image8.png)

When a developer does a check-in or at a scheduled time the build server gets latest bit of the tip, then compile it, and update the web server pointing IIS to the new version and updating schema of the database in the meanwhile, preserving all the data inside the test db.

It is absolutely not a complex stuff to do, here is the only modification I need to do into the msbuild file of the build.

{{< highlight xml "linenos=table,linenostart=1" >}}
<UsingTask
    TaskName="DotNetMarche.MsBuildExtensions.Administrative.IISChangePhisicalDirTask"
    AssemblyFile="..\sources\libs\MsBuildCustomTasks\DotNetMarche.MsBuildExtensions.dll"/>
<UsingTask
    TaskName="DotNetMarche.MsBuildExtensions.Xml.XmlPokeTask"
    AssemblyFile="..\sources\libs\MsBuildCustomTasks\DotNetMarche.MsBuildExtensions.dll"/>
<Target Name="AfterDropBuild">
    <Message Text="Deploy web application for $(BuildNumber)" />

    <XmlPokeTask
        FilePath="$(DropLocation)\$(BuildNumber)\debug\_PublishedWebsites\NorthwindWeb\web.config"
        XPath="/connectionStrings/add[@name='Northwind']/@connectionString"
        NewValue='Data Source=localhost\sql2008;Initial Catalog=NorthwindCiTest;user=sa;pwd=Pa$$w0rd'
        FailIfError='false' />
    <IISChangePhisicalDirTask
        Username="administrator"
        Password="xxxxxxxxxxx"
        MachineName="WS2008V1"
        SiteName="NorthWindTest"
        NewPhisicalDirectory="C:\Drops\NorthwindTest\$(BuildNumber)\debug\_PublishedWebsites\NorthwindWeb\" />
    <MSBuild Projects="$(SolutionRoot)\src\DbEdition\NorthwindTest\NorthwindTest\NorthwindTest.dbproj"
                Properties="OutDir=$(DropLocation)\$(BuildNumber)\debug\;TargetDatabase=NorthwindCiTest;DefaultDataPath=C:\Program Files\Microsoft SQL Server\MSSQL10.SQL2008\MSSQL\DATA;TargetConnectionString=Data Source=WS2008V1\SQL2008,1433%3Buser=sa%3Bpwd=Pa$$w0rd;DeployToDatabase=true;"
                Targets="Deploy"  />
</Target>{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

The first two &lt;UsingTask directive are needed to import a couple of custom msbuild task. The first is the XmlPokeTask, used to change part of an xml file. In this example you can verify how I change the connection string, because the Test Server can have a different setup, in this situation I use sa credentials, this is very bad for security, but this is only an example. In real scenario you must use integrated security.

The second task is a simple task that uses the technique described in [this post](http://www.codewrecks.com/blog/index.php/2009/10/12/change-base-directory-of-a-site-in-iis/), I basically change the directory used by the site NorthWindtest of a machine called WS200v1. The most important stuff here, is that drop location is on WS2008V1 machine, and since I know that the physical directory is c:\drops\ I can simply know the real directory from the BuildNuber. This action permits me to point the test site on the latest build.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2009/10/image-thumb9.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2009/10/image9.png)

Finally since the database could be changed I need to follow the instruction of [this post](http://www.codewrecks.com/blog/index.php/2009/10/06/deploy-a-database-project-with-tfs-build/) to deploy the data on test database. Now each time a build is triggered after the build Test machine IIS was automatically redirected to the latest version, the web.config was changed to suite the test environment, and the database is automatically upgraded. I simply did the first checkin of the project and after the build I test the site from my dev machine

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2009/10/image-thumb10.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2009/10/image10.png)

The site was deployed, and I'm able to insert a record in the new empty database created by the first build.

Alk.

Tags: [Team Foundation Server](http://technorati.com/tag/Team%20Foundation%20Server)
