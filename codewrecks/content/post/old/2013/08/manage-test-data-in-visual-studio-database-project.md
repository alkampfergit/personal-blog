---
title: "Manage Test Data in Visual Studio Database project"
description: ""
date: 2013-08-05T16:00:37+02:00
draft: false
tags: [DataDude]
categories: [Visual Studio]
---
One of the greatest missing of [Visual Studio Database Projects](http://msdn.microsoft.com/en-us/data/tools.aspx), is the ability to manage data in a Database Project. One widely used technique to overcome this limitation is using PostDeployment scripts and script data inserting.  **This technique is used also to insert test data inside the database**. When used in this way, you need some way to avoid inserting test data in Production Database, so you need to find a technique that permits you to run the inserting test data only when needed.

A first solution can be:  **differentiate post deployment scripts based on active configuration** , basically one of the Script runs when the configuration is debug and the other one should run when the configuration is release (or other).

Actually Database Projects  **does not distinguish between various configurations** so you need to resort to some hack to have it works. Basically you create one script for every configuration you want to use.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2013/08/image_thumb5.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2013/08/image5.png)

 ***Figure 1***: *Create one script for every configuration you want to support*

Then you need to unload the database project, edit the project file directly and add  **a pre-build step that basically copy the right script over the Script.PostDeployment.sql** based on the active configuration

{{< highlight xml "linenos=table,linenostart=1" >}}


  <Target Name="BeforeBuild">
    <Copy
      SourceFiles="Scripts\Post-Deployment\Script.PostDeployment.$(Configuration).sql"
      DestinationFiles="Scripts\Post-Deployment\Script.PostDeployment.sql" />
  </Target>

{{< / highlight >}}

This is not a so good hack, because  **every time you change the configuration the Script.PostDeployment.Sql will be overwritten and marked as changed**. In this situation you should remember avoiding to check-in to avoid too much noise in the source control. Modifying source file with a pre-build action can also lead to  **TFS Build failures, because the Build agent uses standard Server workspaces and all source files are in read-only mode during the build**. Moreover there is too much risk that someone mistakenly runs the debug version against production database and you will have test data inserted into production DB, so this is not my choice.

A better solution is leaving your Database Project post deployment script free from test data, use them to only insert the real configurations, but  **create another Database Project**. This new project  **references the original Database Project and contains post build script to generate test data**. This technique keeps your original Project clean, when it is time to deploy test data, simply deploy the other database project and thanks to the reference all the original schema will be deployed, then the post deployment script of the other project will insert Test Data.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2013/08/image_thumb6.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2013/08/image6.png)

 ***Figure 2***: *Create a specific database project to deploy test data*

Now the only interesting part is  **how to create the InsertBaseData.sql script to insert some base test data and make it stable**. If you create a script with a long series of INSERT INTO, you will probably fill database with unnecessary data, or worst, the script may fail due to unique index validation.

Everything you need to know is in  **this interesting article from Sql Server Central called** [**Generate MERGE Statements with Table Data**](http://www.sqlservercentral.com/scripts/Generate/88892/). In that article the author shows you a nice stored procedure used to generate a series of MERGE statements from a database with real data.

{{< highlight sql "linenos=table,linenostart=1" >}}

SET NOCOUNT ON
EXEC sp_MSforeachtable @command1="ALTER TABLE ? NOCHECK CONSTRAINT ALL"
MERGE INTO [Categories] AS Target
USING (VALUES
----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  ('model','Model Airplanes')
 ,('paper','Paper Airplanes')
) AS Source ([Code],[Title])
ON (Target.[Code] = Source.[Code])
WHEN MATCHED THEN
 UPDATE SET
 [Title] = Source.[Title]
WHEN NOT MATCHED BY TARGET THEN
 INSERT([Code],[Title])
 VALUES(Source.[Code],Source.[Title])
WHEN NOT MATCHED BY SOURCE THEN 
 DELETE;
{{< / highlight >}}

This is really useful because you can simply fill a real database with test data and when you are happy with it, generate the script that will recreate the same sets of data.

Thanks to this simple technique you can manage Structure and production data in main Database Project and having other Database Projects to generate test data to automatically setup Test Environments.

Gian Maria.
