---
title: "SSIS use parameter with ADO Net source in DataFlow"
description: ""
date: 2010-04-13T13:00:37+02:00
draft: false
tags: [Sql Server,SSIS]
categories: [General]
---
I have a database where reports are done with stored procedure over the OLTP database, and we begin to suffer poor performance because we have a lot of data and sometimes reports are locked by transaction issued from components that does bulk data insertion.

A viable solution is moving all data in a DataWarehouse server where I can copy all denormalized data. This permits me to do a report query with only a simple select over a single table, then queries are issued against a database with no lock. I decided to move data using SSIS, with incremental population and customer partition.

My algorithm is the following one

1. select all customer id to process
2. For each id take the date of last population and the maximum date present in original data
3. delete in destination table all data present in that range (this permits me to recalculate all if needed)
4. Move all the new data into destination table.

To simplify the process I created a SSIS package, represented in this figure.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2010/04/image_thumb7.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2010/04/image7.png)

In this approach I can take advantage to the fact that Execute Sql Task support the specification of SQL syntax with parameter, so I'm able to use parameter in the query, and use SSIS variables to populate those parameters.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2010/04/image_thumb8.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2010/04/image8.png)

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2010/04/image_thumb9.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2010/04/image9.png)

As you can verify I simply create a T-Sql query with the parameter @clieId, then assign the value of a variable to the parameter, but in a Data Flow you cannot use parameter on ADO Net Source, and this can be a problem, because I need to filter the source data by customer and date range, then doing transformation etc etc.

The solution is using Expression, you can see that he Move Data for ExcelAnalysis has a little pink triangle in the upper left, to specify that some properties are set with expression. If you click on the whole dataflow in the *control Flow* tab you can setup expression for the Data Flow Block

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2010/04/image_thumb10.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2010/04/image10.png)

As you can see the block of the DataFlow contains expression for each ADO NET data source inside the flow, so you can set properties with expression.

The problem is that expression are not parameter aware, so we need to use expression syntax to build the SQL query, like old school :), the expression is something like this.

{{< highlight csharp "linenos=table,linenostart=1" >}}
"SELECT    xxx,yyy,
from xxxx
WHERE     LastUpdateDate >  '" + (DT_WSTR, 30) @[User::lastRunDate] +
"'  and LastUpdateDate <= ' " + (DT_WSTR, 30)  @[User::HighestDateForCustomer]  +
"' and CustomerId = " +  (DT_WSTR, 12)  @[User::CustomerId]
{{< / highlight >}}

As you can see the query is composed using string manipulation and expression syntax, it is surely sub-optimal, but as far as I know this is the best way to use a parametrize-like query in a Data Flow Ado Net Source

Alk.
