---
title: "Mix Linq2XML and XPath take the best from both"
description: ""
date: 2008-09-05T09:00:37+02:00
draft: false
tags: [LINQ]
categories: [LINQ]
---
I must admit that LINQ 2 Xml impressed me very much, I’m actually using it to modify docx documents with the OpenXml sdk. While Linq 2 xml is really useful to makes query and find nodes in xml, I found it rather clumsy in my unit test code. Ex.

I’m writing a test that must verify if my table class correctly generate the header. In openXml format the header is simply created with a w:tblHeader node in the first w:tr (the first row) element of a table. The unit test have this structure

{{< highlight csharp "linenos=table,linenostart=1" >}}
[Test]
public void SetHeaderTest()
{
    OpenXmlTable table = new OpenXmlTable();
    table.NextCell("FirstCell")
       .NextCell("SecondCell")
       .NewRow()
       .NextCell("Third")
       .NextCell("Fourth")
       .SetHeader(1);
    XElement e = table.GenerateXmlData(null, GetSubToken());
    //now assert that the xml is good
}{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

I left the assertion part blank, because now I have to find a way to test that my table class correctly created the w:tblHeader node in the right place. with Linq2Xml you can select with descendants the node called w:tblHeader, but then you should check that it was positioned in the right place. Moreover an assertion should be crystal clear, and I prefer to use XPath because for these kind of selection I found it to be clearer.

Linq2Xml classes permits you to issue an XPath query against an XElement, and this is really the stuff I need, but when you deal with namespace, you should pay a lot of attenction to select the correct node. Since the root node in my situation has namespace declaration I can simply issue this assertion

{{< highlight csharp "linenos=table,linenostart=1" >}}
Assert.That(e.XPathSelectElement(
    @"./w:tbl/w:tr[1]/w:trPr/w:tblHeader", 
    e.CreateNavigator()), 
    Is.Not.Null);{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

I’m used with XPath but this is a very simple expression,  **@”./w:tbl/w:tr[1]/w:trPr/w:tblHeader”** you can read it it means, find the elment tblHeader son of trPr son of the first tr element son of the tbl element. This assertion is simple and verify that the first row in the table set as header. Moreover you should tell to XPath engine the definition of the namespace w, but since it is defined in my original XElement it is enough to pass the node navigator as the second parameter.

The ability to mix LINQ2XML code with XPAth code permits me to take the best from both world and I appreciate very much that XDocument and XElement natively supports query with XPath.

alk.

Tags: [XPath](http://technorati.com/tag/XPath) [Testing](http://technorati.com/tag/Testing)

<!--dotnetkickit-->
