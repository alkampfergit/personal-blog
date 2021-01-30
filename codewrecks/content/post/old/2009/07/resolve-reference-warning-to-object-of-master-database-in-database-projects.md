---
title: "Resolve reference warning to object of master database in database projects"
description: ""
date: 2009-07-08T06:00:37+02:00
draft: false
tags: [NET framework]
categories: [NET framework]
---
If you use some stored procedure or objects that reside into master database, when you compile your database project you will end with warning like this.

{{< highlight csharp "linenos=table,linenostart=1" >}}
C:\DEVELOP\myproject\TRUNK\SRC\COMMON\SQLSERVER\REPMANAGEMENT.DATABASE\SCHEMA OBJECTS\PROGRAMMABILITY\STORED PROCEDURES\LOG.GETFEEDER.PROC.SQL(45,6)Warning TSD04151: Procedure: [Log].[GetFeeder] contains an unresolved reference to an object. Either the object does not exist or the reference is ambiguous because it could refer to any of the following objects: [dbo].[sp_executesql] or [Log].[sp_executesql].{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

This happens because I used the  **sp\_executesql** in my stored procedures, and sp\_executesql is one of the stored that resides into Master database. To avoid these warnings you must add a reference to all objects that are in master schema.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2009/07/image-thumb16.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2009/07/image16.png)

This kind of reference is not a simple one, but is a â€œDatabase referenceâ€. You can find a reference of the master db in directory %program files%/Microsoft Visual STudio 9.0/VSTSDB/Extensions/SqlServer/SqlVersion/DBSchemas

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2009/07/image-thumb17.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2009/07/image17.png)

The dbschema of master database is really big, almost 8 megabytes, and it can slow down your project compilation, because visual studio needs to analyze it to retrieve definition of all objects of master db. Now, since the original master.dbschema contains definition of thousands of db objects, you can create a shrinked version of it that contains only the definition of those object you really reference into your project.

Reducing the file is really simple, you must create a copy of the original file, then you can delete all elements contained in this newly copied file, the result is a content like this one.

{{< highlight xml "linenos=table,linenostart=1" >}}
<?xml version="1.0" encoding="utf-8"?>
<DataSchemaModel FileFormatVersion="1.0" SchemaVersion="1.0" DspName="Microsoft.Data.Schema.Sql.SqlDsp.Sql100DatabaseSchemaProvider" CollationLcid="1033" CollationCaseSensitive="False">
    <Header>
        <CustomData Category="ModelCapability">
            <Metadata Name="ModelCapability" Value="Default" />
        </CustomData>
        <CustomData Category="DBSchema">
            <Metadata Name="DatabaseType" Value="master" />
            <Metadata Name="SqlServerVersion" Value="10.00" />
            <Metadata Name="Author" Value="Microsoft Corp." />
        </CustomData>
        <CustomData Category="DatabaseVariableLiteralValue">
            <Metadata Name="Name" Value="master" />
        </CustomData>
    </Header>
    <Model>
    </Model>
</DataSchemaModel>{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

This is the minimum skeleton of a dbschema file, with all elements node removed, now you begin adding all the elements you need from the original file. As an example since I used the sp\_executeSql I goes into the master.dbschema, look for its definition and directly copied into the new reduced file.

{{< highlight xml "linenos=table,linenostart=1" >}}
<Model>
        <Element Type="ISqlExtendedProcedure" Name="[sys].[sp_executesql]">
            <Property Name="IsQuotedIdentifierOn" Value="False" />
            <Relationship Name="Owner">
                <Entry>
                    <References ExternalSource="BuiltIns" Name="[sys]" />
                    <Annotation Type="SqlModelBuilderResolvableAnnotation" Name="[sys]">
                        <Property Name="TargetTypeStorage" Value="ISqlObjectOwner" />
                    </Annotation>
                </Entry>
            </Relationship>
            <Annotation Type="AliasedToDbo" />
            <Annotation Type="GloballyScoped" />
        </Element>{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

In the end I have a dbschema file with 6 elements, (all those I need) and I can reference it without the risk of slowing down the database project.

Alk.

Tags: [Visual Studio Database Edition](http://technorati.com/tag/Visual%20Studio%20Database%20Edition)
