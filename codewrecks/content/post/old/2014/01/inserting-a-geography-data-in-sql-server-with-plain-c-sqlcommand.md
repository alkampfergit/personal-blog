---
title: "Inserting a Geography data in Sql Server with plain C SqlCommand"
description: ""
date: 2014-01-22T20:00:37+02:00
draft: false
tags: [EF]
categories: [Entity Framework]
---
Usually I access data with ORM like NHibernate or Entity Framework and resort to plain T-SQL only for reporting or manipulation of massive data, but yesterday  **I had to use some plain SQL to insert data in a table that has Geograpy column**.

[![SNAGHTMLe9b70](https://www.codewrecks.com/blog/wp-content/uploads/2014/01/SNAGHTMLe9b70_thumb.png "SNAGHTMLe9b70")](https://www.codewrecks.com/blog/wp-content/uploads/2014/01/SNAGHTMLe9b70.png)

 ***Figure 1***: *A table with geography data*

If you use EF 5 you can simply declare the property of type DbGeography and everything is handled by Entity Framework for you.

> public virtual DbGeography Posizion { get; set; }

Using this type of data is simple, because  **EF gives you some operator to express some advanced concepts Es: Order results based on relative distance respect a given coordinate, and it takes care of inserting and loading data from DB.** {{< highlight csharp "linenos=table,linenostart=1" >}}


var text = string.Format("POINT({0} {1})", currentLatitude, currentLongitude);
DbGeography geo = DbGeography.FromText(text, 4326);
results = query.OrderBy(c => c.Posizione.Distance(geo)).ToList();

{{< / highlight >}}

When it is time to work with plain Sql things started to become a little bit complicated, because geography type in Sql Server is a CLR User Type. The simplest solution is to use standard geography instructions of T-Sql. Suppose you need to  **insert into database a record that has a geography column but you have coordinate in latitude and longitude** , here is the insert you need.

{{< highlight sql "linenos=table,linenostart=1" >}}


 INSERT INTO  [dbo].[myTable]
 (
                [Id]
             ...
               ,[Position]
 )
 VALUES
 (
                @Id,
               ...
                 geography::STPointFromText('POINT(' + CAST(@lon AS VARCHAR(20)) + ' ' + CAST(@lat AS VARCHAR(20)) + ')', 4326)
)

{{< / highlight >}}

The trick is using the geography::STPointFromText function to create a point from latitude and longitude. Probably this is not the most efficient way, but it is simple and permits you to specify latitude and longitude as plain SqlParameter of type Decimal.

{{< highlight csharp "linenos=table,linenostart=1" >}}


CurrentDatabase.AddInParameter(c, "@lat", DbType.Decimal, Entity.Latitude);
CurrentDatabase.AddInParameter(c, "@lon", DbType.Decimal, Entity.Longitude);

{{< / highlight >}}

This accomplish the insert  **without the need to reference any of the native geography types of Sql Server and using only plain T-Sql**.

Gian Maria.
