---
title: "A dto factory code generator with visual studio T4"
description: ""
date: 2009-06-24T10:00:37+02:00
draft: false
tags: [Entity Framework,Software Architecture]
categories: [Entity Framework,Software Architecture]
---
[Data Transfer Objects](http://en.wikipedia.org/wiki/Data_Transfer_Object), best known as Dto, are an essential part of projects that uses services or Domain Model. Dto are great, but the disadvantage is that maintaining Dto objects is a pain, because they are composed by repetitive code, and you have no fun in writing them.

Since building a Dto is a mechanical process it is better to use a code generation tool to generate them with little effort. If you work with visual studio 2008 the best choice in Code Generator is T4, because it is included in Visual Studio and is really good. I do not want to cover T4 syntax, because you can find tons of information following [this post links](http://www.hanselman.com/blog/T4TextTemplateTransformationToolkitCodeGenerationBestKeptVisualStudioSecret.aspx).

You can [download here](http://www.codewrecks.com/blog/Storage/DtoFactory.zip) a little project that contains a simple DtoFActory.tt file used to generate basic Dto out from a domain object. It is written with little effort, and it can contain errors, but Iâ€™m quite satisfied by the general result. To use it simply add the DtoFactory.tt file to your solution, then you can use in other tt file. In the [example](http://www.codewrecks.com/blog/Storage/DtoFactory.zip) I simply generate a EntityFramework edmx against northwind database, then I create a CustomerDto.tt file with this content.

{{< highlight xml "linenos=table,linenostart=1" >}}
<#@ template language="C#" hostspecific="True" debug="True" #>
<#@ output extension="cs" #>
<#@ include file="DtoFactory.tt" #>
<#
// <copyright file="CustomerDto.tt" company="Gian Maria Ricci">
//  Copyright Ã‚ © Gian Maria Ricci. All Rights Reserved.
// </copyright>
    GenerateDto(
        @"bin\Debug\DtoFactory.Exe", 
        "DtoFactory.Customers",
        "CustomersDto",
        "DtoFactory",
        "http://www.nablasoft.com/dotnet/",
        1,    
        new PropertyData[] {"CustomerId", "CompanyName", "ContactName"},
        true, true, true); 
#>{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

As you can see I import the DtoFactory.tt file, then call the GenerateDto function. The first parameter is the relative path of the assembly that contains the original object. Relative means respect to the tt file itself, this is one of the part I do not like very much because you need to find out relative path and refers to the debug directory, but it can be acceptable.

Then I specify the fullname of the class, the name of the Dto object, the name of the namespace were to put generated class. Then I need to specify the namespace used in the DataContract attribute (I want my Dto to be transferrable by WCF), then the number of base classes to examine to find properties, a list of PropertyData object with names of the property of the original object I want in my dto, finally three boolean values to specify if I need my dto to implement INotifyPropertyChanged, INotifyPropertyChanged, and IEditableObject.

You can see that this simple template will generate a CustomerDto.cs file that contains a CustomersDto class that contains that three properties. The interesting part is how I generate the assembler of the Dto. To build a Dto the standard way to proceed is to take the original object and copy all needed properties into corresponding properties of the dto object. This is a suboptimal approach, because using such a technique, you are forced to load the entire object from the database. In My situation CustomersDto has only three properties, *why I need to load an entire Customers object into memory to build a CustomersDto object that contains only three properties*? The solution is in how my dtoFactory generates the assembler.

{{< highlight CSharp "linenos=table,linenostart=1" >}}

public static Expression<Func<Customers, CustomersDto>> ExpressionSelector;
public static Func<Customers, CustomersDto> Selector;

static CustomersDtoAssembler()
{

    ExpressionSelector = obj => new CustomersDto()
    {
        CompanyName = obj.CompanyName,
        ContactName = obj.ContactName,
        CustomerID = obj.CustomerID,
    };
    Selector = obj => new CustomersDto()
    {
        CompanyName = obj.CompanyName,
        ContactName = obj.ContactName,
        CustomerID = obj.CustomerID,
    };
}{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

As you can see my generator generates an * **Expression&lt;Func&lt;Customers, CustomersDto&gt;&gt;,** *and simply initialize it in static constructor with a simple lambda expression. If you are wondering why I need such a strange object letâ€™s see how I use it

{{< highlight csharp "linenos=table,linenostart=1" >}}
using (NorthwindEntities context = new NorthwindEntities())
{
    var Query = context.Customers.
       Where(c => c.CustomerID.StartsWith("A"))
      .Select(CustomersDtoAssembler.ExpressionSelector);

    foreach (CustomersDto customerDto in Query)
    {
        Console.WriteLine("ID: {0}, ContactName: {1}, CompanyName {2}", 
            customerDto.CustomerID, customerDto.ContactName, customerDto.CompanyName);
    }
}{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

Thanks to LINQ to Entities, I can simply build a query to the NorthwindEntites data context, selecting Customers, applying a filter and specify the assembler  **ExpressionSelector** seen before. This produces this query against my database.

{{< highlight sql "linenos=table,linenostart=1" >}}
SELECT 
1 AS [C1], 
[Extent1].[CompanyName] AS [CompanyName], 
[Extent1].[ContactName] AS [ContactName], 
[Extent1].[CustomerID] AS [CustomerID]
FROM [dbo].[Customers] AS [Extent1]
WHERE (CAST(CHARINDEX(N'A', [Extent1].[CustomerID]) AS int)) = 1{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

Thanks to the  **Expression&lt;Func&lt;Customers, CustomerDto&gt;&gt;,** Entity Framework knows how to retrieve only the data he need to create the Dto, wonderful :D. With such a powerful generator I can create Dto objects with few lines of code.

Since this generator is not still fully tested feel free to send me suggestions, bugs, feature you wish to have, etc, etc.

Alk.

[Code Download.](http://www.codewrecks.com/blog/Storage/DtoFactory.zip)

Tags: [Dto](http://technorati.com/tag/Dto)
