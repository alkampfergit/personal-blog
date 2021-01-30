---
title: "A better version of dtofactory"
description: ""
date: 2009-07-07T00:00:37+02:00
draft: false
tags: [NET framework,Software Architecture]
categories: [NET framework,Software Architecture]
---
In [this post](http://www.codewrecks.com/blog/index.php/2009/06/24/a-dto-factory-code-generator-with-visual-studio-t4/) I dealt with a primitive version of a T4 template to generate dto starting from domain objects. In these days I had little time to improve it a little bit, and I created a simple test project to verify some of the basic functionality.

Usage of the T4 template is really simple, Iâ€™ve created in the test project an Entity Factory model to the ubiquitous northwind database, then I added a OrderDto.tt file to the project with this content.

{{< highlight xml "linenos=table,linenostart=1" >}}
<#@ template language="C#" hostspecific="True" debug="True" #>
<#@ output extension="cs" #>
<#@ include file="DtoFactory.tt" #>
<#
// <copyright file="OrdersDto.tt" company="Gian Maria Ricci">
//  Copyright Ã‚ © Gian Maria Ricci. All Rights Reserved.
// </copyright>
    GenerateDto(
        @"bin\Debug\DtoFactory.Exe", 
        "DtoFactory.Orders",
        "OrdersBaseDto",
        "DtoFactory",
        "http://www.nablasoft.com/dotnet/",
        1,      
        new String[] {"OrderId", "OrderDate", "Customers.CustomerID", "Customers.ContactName"},
        null,   
        true, true, true);  
#>{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

It is quite the same of the previous version, but now I inserted some enhancements. If you look at the property list you can see that I inserted properties like â€œCustomers.CustomerIDâ€ and â€œCustomers.ContactNameâ€, that belongs to the customers object. When you use a domain model you are working with a graph of object, but dto must be plain. My generator will generate this class:

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2009/07/image-thumb14.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2009/07/image14.png)

My dto class implements various interfaces and it has properties like Customers\_ContactName and Customers\_CustomerID, so it is a simple transfer object that contains all information we need. The assembler class is responsible to create a dto from original object and as usual can be used in this way:

{{< highlight chsarp "linenos=table,linenostart=1" >}}
using (NorthwindEntities context = new NorthwindEntities())
{
    var Query = context.Orders
       .Where(o => o.Customers.CustomerID == "ALFKI")
       .Select(OrdersBaseDto.Assembler.ExpressionSelector);

    foreach (var order in Query)
    {
        Console.WriteLine("OrderId:{0} Customer:{1} Date:{2}",
            order.OrderID, order.Customers_CustomerID, order.OrderDate);
    }
}{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

This code simply use the ExpressionSelector contained in nested class Assembler of my dto of choice, then I can iterate into the query using various properties of the dto object. The  **most important stuff is that the expression selector actually does a projection** , here is the generated query captured from the profiler.

{{< highlight sql "linenos=table,linenostart=1" >}}
SELECT 
1 AS [C1], 
[Extent1].[OrderDate] AS [OrderDate], 
[Extent1].[OrderID] AS [OrderID], 
[Extent1].[CustomerID] AS [CustomerID], 
[Extent2].[ContactName] AS [ContactName]
FROM  [dbo].[Orders] AS [Extent1]
LEFT OUTER JOIN [dbo].[Customers] AS [Extent2] ON [Extent1].[CustomerID] = [Extent2].[CustomerID]
WHERE N'ALFKI' = [Extent1].[CustomerID]{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

Only the field related to the dto are retrieved, and thanks to Entity Framework you get the join and projection for free, no unnecessary data is taken from database. This is a quite good result, because with few lines of code my generator is able to geneate a dto composed by properties taken from various objects, and thanks to LINQ I also got a projection for free that permits me to gain maximum efficiency avoiding to retrieve full objects.

Another interesting stuff is this one, you can link various Dto objects between them

{{< highlight csharp "linenos=table,linenostart=1" >}}
    GenerateDto(
        @"bin\Debug\DtoFactory.Exe", 
        "DtoFactory.Orders",
        "OrdersTestDto",
        "DtoFactory",
        "http://www.nablasoft.com/dotnet/",
        1,      
        new String[] {"OrderID", "OrderDate", "Customers"},
        new PropertyData[] {new PropertyData("Customers", "CustomersDto")},   
        true, true, true); {{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

Iâ€™m asking to generate an OrdersTestDto object that contains the â€œCustomersâ€ property, but I specify that I do not want full Customers object, but simply a CustomersDto, so you will end in two dto connected together

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2009/07/image-thumb15.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2009/07/image15.png)

This facility permits me to reuse dto but actually the ExpressionSelector of this dto cannot be directly used with LINQ, it needs still more work ;).

All the project is still in a very rought form, but Iâ€™m quite satisfied on it, if you like it you can download [here](http://www.codewrecks.com/blog/storage/dtofactoryblog.zip). The code is provided as-is :) do not blame the author.

alk.

Tags: [Dto](http://technorati.com/tag/Dto) [T4](http://technorati.com/tag/T4) [Code generation](http://technorati.com/tag/Code%20generation)
