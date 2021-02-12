---
title: "Deploy a database project with tfs build 2010"
description: ""
date: 2010-01-04T15:00:37+02:00
draft: false
tags: [DataDude,TFS Build,workflow]
categories: [Team Foundation Server]
---
If you want to deploy a database project into a target sql server instance during a tfs 2010 build, you can use with success the basic MsBuildTask, [similar to tfs2008](http://www.codewrecks.com/blog/index.php/2009/10/23/automatic-deployment-of-a-web-application-with-tfs-build/).

I decided to deploy the database, only if the tests are ok and the build is ok, so I place a condition activity under the test phase and I set the condition to pass only if the test and build status are different from Failed

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2010/01/image_thumb.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2010/01/image.png)

Now I need to know where the dbproj will be located in the disk during the build, and since I know the repository path, I can use a specific TFS build action to convert the source control path into physical path. The source control path is *$/Experiments/NorthwindTest/NorthwindTest.Database/NorthwindTest.Database.dbproj* so I can drop a * **ConvertWorkspaceItem** * activity to convert this path to the physical one. First of all I need to declare a variable where to put the result.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2010/01/image_thumb1.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2010/01/image1.png)

I called this variable *dbProject* (String type). Now I can configure my  **ConvertWorkspaceItem** activity I dropped in the *then* part of my condition activity.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2010/01/image_thumb2.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2010/01/image2.png)

This activity needs three variables, the first is the source control path you want to translate, the second is the name of the variable that will contain the result and the third is the Workspace to use (is stored into the global variable  **Workspace** ).

Following this activity I dropped a WriteBuildMessage activity, used to write something into the build log (I wrote the exact path of the database project that is to be deployed)

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2010/01/image_thumb3.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2010/01/image3.png)

This is only informational, but it is useful to check during the build process.

The most important activity is the  **MsBuildActivity** that will do the real work. This activity invokes Msbuild.exe that in turns will target the database project to deploy. The most important property is the  **CommandLineArgument** where you must specify all details of the deploy

*"/p:TargetDatabase=NorthwindTest" +       
" /p:""DefaultDataPath=C:\Program Files\Microsoft SQL Server\MSSQL10.SQL2008\MSSQL\DATA""" +        
" /p:""TargetConnectionString=Data Source=10.0.0.99\SQL2008,49400%3Buser=sa%3Bpwd=Pa$$w0rd""" +        
" /p:DeployToDatabase=true"*

These properties are used to specify the name of the database, the datapath, the connectionstring where to deploy the database, and they override the standard one defined on the project. As you can see in connection string I used the sa password, that is strongly discouraged for security reasons in production environment. You can use integrated security if the user used to run the team agent has the right to create a database in the target instance.

Finally these are all the properties of the msbuild activity.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2010/01/image_thumb4.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2010/01/image4.png)

LogFile is really important, because you want a msbuild log file of what is happened during the deploy. You can check this file in the logs\ subfolder of the drop location

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2010/01/image_thumb5.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2010/01/image5.png)

If you open deploydatabase.log, you can find all the information you need on what is happened, here is a little extract.

*Build started 1/4/2010 7:08:38 AM.       
Project "C:\Builds\1\Experiments\DeployDatabase\Sources\NorthwindTest\NorthwindTest.Database\NorthwindTest.Database.dbproj" on node 1 (Deploy target(s)).        
DspDeploy:        
  Deployment script generated to:        
  C:\Builds\1\Experiments\DeployDatabase\Binaries\NorthwindTest.Database.sql        
  Creating NorthwindTest…        
  Creating [dbo].[Categories]…        
  Creating PK\_Categories…        
  Creating [dbo].[Categories].[CategoryName]…        
  Creating [dbo].[CustomerCustomerDemo]…        
  Creating PK\_CustomerCustomerDemo…        
  Creating [dbo].[CustomerDemographics]…        
  Creating PK\_CustomerDemographics…        
  Creating [dbo].[Customers]…        
  Creating PK\_Customers…*

A really important property is the Target, that is set to  **New String() {*Deploy*}**. A database project supports some different targets, as an example the build, deploy, dataGeneration and StaticCodeAnalysis, each of them will perform a different task.

The project to deploy is specified in the  **Project** property, and as you can see I use the variable dbProject that was populated with the ConvertWorkspaceItem.

If you check build details you can find all the information you need about the build process

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2010/01/image_thumb6.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2010/01/image6.png)

From here you can verify project directory, and all the options that are passed to the msbuild.exe. You can now schedule the build and verify that the database is deployed on target server.

alk.

Tags: [TfsBuild](http://technorati.com/tag/TfsBuild)
