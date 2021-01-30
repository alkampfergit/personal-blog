---
title: "Get great amount of data with T-SQL for xml"
description: ""
date: 2008-05-08T10:00:37+02:00
draft: false
tags: [LINQ,Sql Server]
categories: [LINQ,Sql Server]
---
I’m creating some big xml files to test performance of linq to xml to make some PoC. I use simply the ForXml to extract data from Customer and Orders table of northwind database, The first Xml is 517 Kb, but I need really bigger file.

The trick is simple I created another table called insertHelper that contain a single column, and I filled with numbers from 1 to 100:

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2008/05/image-thumb1.png)](http://www.codewrecks.com/blog/wp-content/uploads/2008/05/image1.png)

Now I simply issue this query to create a very big xml file

{{< highlight sql "linenos=table,linenostart=1" >}}
select 
    C.[CustomerID] + convert(varchar(2), H.[value]) [CustomerID] 
           ,C.[CompanyName]
           ,C.[ContactName]
           ,C.[ContactTitle]
           ,C.[Address]
           ,C.[City]
           ,C.[Region]
           ,C.[PostalCode]
           ,C.[Country]
           ,C.[Phone]
           ,C.[Fax]
    ,orders.* from customers C
cross join inserthelper H
inner join orders on orders.customerID = C.customerID

for xml AUTO, ELEMENTS, ROOT('Customers'){{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

This makes me happy because now I have the original customer x 100 record, I have ALFKI1, ALFKI2..ALFKI100 and so on, thanks to the cross join SQL operator. The problem is that the XMl returned is so big that when I try to open in the Sql Server management Studio I received an “Insufficent memory” because the XML is too big. The solution is to use this fragment of code.

{{< highlight sql "linenos=table,linenostart=1" >}}
           SqlCommand cmd = conn.CreateCommand();
           conn.Open();
           cmd.CommandText =
               @"select 
    C.[CustomerID] + convert(varchar(2), H.[value]) [CustomerID] 
           ,C.[CompanyName]
           ,C.[ContactName]
           ,C.[ContactTitle]
           ,C.[Address]
           ,C.[City]
           ,C.[Region]
           ,C.[PostalCode]
           ,C.[Country]
           ,C.[Phone]
           ,C.[Fax]
    ,orders.* from customers C
cross join inserthelper H
inner join orders on orders.customerID = C.customerID

for xml AUTO, ELEMENTS, ROOT('Customers')";
           XmlReader res = cmd.ExecuteXmlReader();
           FileStream fs = new FileStream("Big.xml", FileMode.OpenOrCreate);
           XmlDocument doc = new XmlDocument();
           doc.Load(res);
           XmlWriter writer = XmlWriter.Create(fs);
           doc.WriteTo(writer);{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

This is not good snippet, it lack using for SqlCommand (that is disposable) but it serves me only to create the file thanks to the *ExecuteXmlReader* functino of the SqlCommand.

The file is 60Mb big, and is  a good candidate to make some load test of linq to XML.

Alk.

Tags: [ForXml](http://technorati.com/tag/ForXml) [Linq to XML](http://technorati.com/tag/Linq%20to%20XML)
