---
title: "LINQ to XML 8211 really interesting"
description: ""
date: 2008-04-09T08:00:37+02:00
draft: false
tags: []
categories: [General]
---
A lot of people tend to consider linq2sql the most important provider for linq, this is not true for me. First of all I tend to prefer NHibernate over Entity Framework and LINQ2SQL, and moreover I think that Linq 2 XML really rocks.

If you worked like me with XML you probably are frustrated of the many api you have to deal with: you have to know XPATH 1.0 and 2.0, XSL for transformation, DOM is useful too, and.NET really has a lot of classes to work with XML, and not all of them are really simple to use.

LINQ2XML solves a lot of problem, is a unifying API to get data from, create, and transform XML data. Let suppose you have such an XMl

{{< highlight xml "linenos=table,linenostart=1" >}}
<Customers>
  <customers>
    <CustomerID>ALFKI</CustomerID>
    <CompanyName>Alfreds Futterkiste</CompanyName>
    <orders>
      <OrderID>10643</OrderID>
      <CustomerID>ALFKI</CustomerID>
   ...
    </orders>
    <orders>
     ...{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

This is the XML you can get from northwind database with a simple

{{< highlight sql "linenos=table,linenostart=1" >}}
select  * from customers
inner join orders on orders.customerID = customers.customerID
for xml AUTO, ELEMENTS, ROOT('Customers'){{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

Now if you want to select id, name and orders number for all customer that has more than 10 orders you can do this query.

{{< highlight sql "linenos=table,linenostart=1" >}}
 var customers =
     from c in theDoc.Descendants(("customers"))    
    where c.Descendants("orders").Count() > 10
     select new {
        Id = (String)c.Element("CustomerID"),
        Name = (String)c.Element("CompanyName"),
        OrdersCount = c.Descendants("orders").Count()
    };{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

It is simple, it has nothing to do with XPATH or similar stuff, you have intellisense, and it works :D. If you want to transform that XML.. no more xsl pain :D

{{< highlight sql "linenos=table,linenostart=1" >}}
var customers = from c in theDoc.Descendants(("customers"))
   where c.Descendants("orders").Count() > 10
   select 
      new XElement("customer",
      new XAttribute("id", (String)c.Element("CustomerID")),
      new XAttribute("ordercount", c.Descendants("orders").Count()));

XDocument transDoc = new XDocument(
   new XElement("GoldCustomers", customers));{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

Whoa…… It seems to me that LINQ2SQL can really make my life better.

Alk.

Tags: [LINQ](http://technorati.com/tag/LINQ) [LINQ2XML](http://technorati.com/tag/LINQ2XML)
