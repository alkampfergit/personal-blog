---
title: "Data Driven Test of a stored procedure in Database Edition"
description: ""
date: 2009-11-16T17:00:37+02:00
draft: false
tags: [Visual Studio Database Edition]
categories: [Visual Studio]
---
Database Tests are really a great feature of Database Edition, and, like other tests, you can create a Data Driven Test of a stored procedure with little effort. The first stuff I do is to create a database project that will contains a table for each sets of data I want to use in a test.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2009/11/image_thumb14.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2009/11/image14.png)

In this project I create a table for each sets of data, and create a script to preload the data as post-deployment script. In this example I want to test a stored procedure, that accepts a string filter, and for each filter I want to test the number of rows returned. To achieve this I need a set of test data with two column, a filter column and a ExpectedNumberOfResult column. I create this table in the TestDatabase Database project

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2009/11/image_thumb15.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2009/11/image15.png)

Ok, now here is the TestDataSet1 deployment script

{{< highlight sql "linenos=table,linenostart=1" >}}
-- =============================================
-- Script Template
-- =============================================
SET NOCOUNT ON
GO

    TRUNCATE TABLE [dbo].[TestDataSet1]
    INSERT [dbo].[TestDataSet1] VALUES('da', 1)
    INSERT [dbo].[TestDataSet1] VALUES('e', 18)
    INSERT [dbo].[TestDataSet1] VALUES('det', 0)

END
GO{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

I simply need to remove all old data, and preload with real data. Now here is the stored I want to test.

{{< highlight sql "linenos=table,linenostart=1" >}}
CREATE PROCEDURE [dbo].[GetCustomerByName]
    @filter    nvarchar(30)
AS
    SELECT * from
    Customer
    Where [Name] like '%' + @filter + '%'
RETURN 0{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

Absolutely simple, and I've already generated a DataGenerationPlan and already verified that searching with â€˜da' will return only one column, with â€˜e' it will return 18 columns etc etc. To save Time I simply right click and â€œDeployâ€ the test database only when the test data changes, clearly this database is readonly, because tests use it only to data drive the test. Then I create a very simple Stored proceudre Test, and modify in this way

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2009/11/image_thumb16.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2009/11/image16.png)

We need to notice a couple of stuff, first of all the @filter parameter was not declared in T-Sql code, this because we will take it from the test table, the other peculiarity is that the NumberOfRowReturned is a single condition that expects 0 rows to be returned, now it is time to dataDrive the test. The whole operation is covered in [this article](http://msdn.microsoft.com/en-us/ms243192.aspx), here is a brief summary. First of all in the test we need to modify App.Config, you need to add a section

{{< highlight xml "linenos=table,linenostart=1" >}}
<section 
name="microsoft.visualstudio.testtools" 
type="Microsoft.VisualStudio.TestTools.UnitTesting.TestConfigurationSection, Microsoft.VisualStudio.QualityTools.UnitTestFramework, Version=9.0.0.0, Culture=neutral, PublicKeyToken=b03f5f7f11d50a3a"/>
{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

And then the section parameter

{{< highlight xml "linenos=table,linenostart=1" >}}
  <microsoft.visualstudio.testtools>
    <dataSources>
      <add name="SqlClientDataSource" 
              connectionString="SqlClientConn" 
            dataTableName="TestDataSet1" 
            dataAccessMethod="Sequential"/>
    </dataSources>
  </microsoft.visualstudio.testtools>{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

I'm telling that I want to create a new data source to data drive my stored procedure test, this data source will be called SqlClientDataSource, it uses the SqlClientConn connection string, it will use the TestDataSet1 table and the access method is sequential, it means that it will run the test for each row in the table.

Now the fun part begins, because you will need to instruct the test to use this data, so you will need to â€œRight clickâ€ the database test and choose â€œView Codeâ€. For those not used to database testing, a database test is composed by a simple C# or VB *wrapper* test that permits you to use a designer, but in the background there is the usual test structure. The first step is to choose the data source

{{< highlight CSharp "linenos=table,linenostart=1" >}}
[DataSource("SqlClientDataSource")]
[TestMethod()]
public void dbo_GetCustomerByNameTest(){{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

Now you need to pass the filter parameter to the stored.

{{< highlight csharp "linenos=table,linenostart=1" >}}
String NameFilter = (String)TestContext.DataRow["NameFilter"];

DbParameter[] p = new DbParameter[1];

p[0] = this.ExecutionContext.Provider.CreateParameter();
p[0].Direction = ParameterDirection.Input;
p[0].ParameterName = "@Filter";
p[0].Value = NameFilter;{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

The code is really really simple, since it is a Data Driven test, the TestContext has the DataRow populated with the content of the TestDataSet1 table, so I take the NameFilter column value and then create an array of one DpParameter, named @filter that will be passed to the test. Now I need to modify the test condition because I need to set up the number of expected row count, this is a matter of another few lines of code.

{{< highlight CSharp "linenos=table,linenostart=1" >}}
int ExpectedResultCount = (int)TestContext.DataRow["ExpectedResultCount"];
DatabaseTestActions testActions = this.dbo_GetCustomerByNameTestData;
RowCountCondition rowCountcontidion =
    (RowCountCondition) testActions
                           .TestAction
                           .Conditions
                           .Single(c => c.Name == "NumberOfRowReturned");
rowCountcontidion.RowCount = ExpectedResultCount;
{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

IF this code seems an Hack, you should consider how the designer will code the test under the hood. First of all I store in the ExpectedResultCount the number of rows that I'm expecting to be returned from the stored, then, with a simple LINQ query, I take the condition named â€œNumberOfRowReturnedâ€, that is the name I gave to the condition into the designer. Since I already know that it is a row count condition I can cast it to the right type RowCountCondition, and finally change the RowCount property. The final step is passing the parameter array to the test

{{< highlight csharp "linenos=table,linenostart=1" >}}
System.Diagnostics.Trace.WriteLineIf((testActions.TestAction != null), "Executing test script...");
ExecutionResult[] testResults = TestService.Execute(this.ExecutionContext, this.PrivilegedContext, testActions.TestAction, p);{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

This can be achieved with an overload version of the Execute method, that accepts the array of parameter as last argument. Now you can run the test and look at the result.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2009/11/image_thumb17.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2009/11/image17.png)

As you can verify, the stored was called three time, and for each run a different assertion was run, to verify it try to change the post-deploy script of the testDAtabase project adding a row

{{< highlight sql "linenos=table,linenostart=1" >}}
TRUNCATE TABLE [dbo].[TestDataSet1]
INSERT [dbo].[TestDataSet1] VALUES('da', 1)
INSERT [dbo].[TestDataSet1] VALUES('e', 18)
INSERT [dbo].[TestDataSet1] VALUES('det', 0)
INSERT [dbo].[TestDataSet1] VALUES('a', 22){{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

The last row tells that we expect 22 customers with an â€˜a' in the name, but I already know that my data generation plan generates only 17 records with this condition, now you can run test again and this is the output.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2009/11/image_thumb18.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2009/11/image18.png)

Now you can verify that the test was run 4 times, and the last one it fails.

This technique is very powerful, because you can test a stored procedure or trigger, several time with only a test definition, just exercising it with different input data taken from another database.

alk.

Tags: [Visual Studio Database Edition](http://technorati.com/tag/Visual%20Studio%20Database%20Edition)
