---
title: "Deploy a database project with TFS Build"
description: ""
date: 2009-10-06T09:00:37+02:00
draft: false
tags: [Tfs,TFS Build]
categories: [Team Foundation Server]
---
When you develop web application you often have this scenario. Some people are testers, they are testing the application in dev all day, and they want always to test latest version. Moreover testers usually fills data into web application, so they want their data to be preserved between various deploy. If you simply clear all data in test database you will end with a lot of furious tester :) so do not even think to do this.

If a developer needs to change database schema, we need to automate not only the deploy of the web application, but we need also to sync test database with the latest changes. This is necessary so the test site can work with the new version, but old data is preserved for the happiness of the testers.

This is quite simple using TFS and Database project. The situation is this one

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2009/10/image-thumb.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2009/10/image.png)

When a developer does a check-in, the build server grabs the tip from TFS, then it runs the builds script and deploy the new version of the site in the test web server. At the same time test database gets updated with the latest database schema.

To accomplish database deployment is necessary to modify build script by hand. If you create a build script with the wizard and ask to the build machine to build a database project, the only stuff you will get is a build of the database project, not a deploy, and all artifacts are moved in the drop location.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2009/10/image-thumb1.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2009/10/image1.png)

What you really need is the ability to automatically deploy changes to a specific database, this task is quite simple and you can find some details [here in msdn](http://msdn.microsoft.com/en-us/library/aa833165.aspx), but we need to insert this command into the msbuild script. Here is the code

{{< highlight xml "linenos=table,linenostart=1" >}}
<Target Name="AfterDropBuild">
    <Message Text="Deploy of project database" />

    <MSBuild 
        Projects="$(SolutionRoot)\src\DbEdition\NorthwindTest\NorthwindTest\NorthwindTest.dbproj"
        Properties="OutDir=$(DropLocation)\$(BuildNumber)\debug\;TargetDatabase=NorthwindCiTest;DefaultDataPath=C:\Program Files\Microsoft SQL Server\MSSQL.4\MSSQL\Data;TargetConnectionString=Data Source=VM2003R2_1\SQLTEST%3Buser=sa%3Bpwd=Pa$$w0rd;DeployToDatabase=true;" 
        Targets="Deploy"  />
</Target>{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

Wow, it is really simple, all you need is a simple call to a &lt;MSBuild&gt; task inside the AfterDropBuild target. The MSbuild task needs only three properties, the first is the Targets one, that specifies witch action we want to do on the project, in this situation is *Deploy*. Then in the Peojects property we must specify the full path of the database project file, and it is quite simple using the *SolutionRoot* property that points to the root of the source. Finally we need to set *Properties* property, the most important one, used to override project properties.

In my example I need to deploy in a server with a different instance name and a different Data Path from the original one included in the project. Properties property of msbuild permits you to specify different pair property=value separated with semicolon (;). The properties I need to override are:

 **OutDir=** The directory where we can find all the files resulting from the compilation of the database project, the DropLocation is the easiest way to specify them

 **TargetDatabase** = the name of the database used to deploy the project, is NorthwindCiTest, where CI is Continuos Integrated :)

 **DefaultDataPath=** the phisical path where to locate files. In the original project I use D:\ disk that is the one used to store databases in dev machines.

 **DeployToDatabase=** a boolean that must be set to true to ask to update target database

 **TargetConnectionString=** the connection string used to access the sql server, in this example I used sa because I used some test VM, do not use sa in real environment.

A little note must be done for the TargetconnectionSTring, since a connection string usually contains semicolon, and since semicolon is used by msbuild to separate properties, to use semicolon in connection string or in other property value, you need to escape it with the code  %3B the usual [Url Escaping](http://www.december.com/html/spec/esccodes.html).

Now you can fire a build, and verify what is happened in the log.

*Task "Message"  
  
  Deploy of project database*

Done executing task "Message".

Task "MSBuild"

Global Properties:

OutDir=\\tfsalkampfer\builds\TfsBuildScreencast\NorthwindTest\_20091006.10\debug\

TargetDatabase=NorthwindCiTest

DefaultDataPath=C:\Program Files\Microsoft SQL Server\MSSQL.4\MSSQL\Data

TargetConnectionString=Data Source=VM2003R2\_1\SQLTEST%3buser=sa%3bpwd=Pa%24%24w0rd

DeployToDatabase=true

In this first part you can verify that all variables are correctly overridden. If you scroll down the result file you can find details on the update operation

*Task "SqlDeployTask"  
  
  Deployment script generated to:*

\\tfsalkampfer\builds\TfsBuildScreencast\NorthwindTest\_20091006.10\debug\NorthwindTest.sql

Creating NorthwindCiTest…

Creating dbo.Categories…

Creating dbo.Contacts…

Creating dbo.CustomerCustomerDemo…

Creating dbo.CustomerDemographics…

Creating dbo.Customers…

Creating dbo.Employees…

Creating dbo.EmployeeTerritories…

Creating dbo.Order Details…

Creating dbo.Orders…

Creating dbo.Products…

Creating dbo.Region…

Creating dbo.Shippers…

Creating dbo.Suppliers…

Creating dbo.Territories…

Creating dbo.Categories.CategoryName…

This is the first time I run the script against the server, so all tables gets created, I can verify that the database was correctly created going to the test server

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2009/10/image-thumb2.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2009/10/image2.png)

Et voila, the database was automatically deployed to the test instance of sql server thanks to TFS Build and with no effort :).

alk.

Tags: [TFS](http://technorati.com/tag/TFS) [TFS build](http://technorati.com/tag/TFS%20build) [Database](http://technorati.com/tag/Database)
