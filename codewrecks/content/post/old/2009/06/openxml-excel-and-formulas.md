---
title: "OpenXml excel and formulas"
description: ""
date: 2009-06-16T09:00:37+02:00
draft: false
tags: [Office]
categories: [Office]
---
In an [old post](http://www.codewrecks.com/blog/index.php/2008/11/28/create-a-report-in-excel-2007-with-open-xml-sdk-10/), I deal with a simple way to create excel report using openXml format. The trick is a simple manipulation of the document with Linq to Xml.

Now I need to add another feature, I need to open an excel document with formulas, fill some cells, leaving formulas intact. My first version does not work as expected, I simply created an excel with simple formulas, then fire my function and when I open the resulting excel I see all zero on formula column, but the formula is there, and if I change some cell referenced by the formula I'll obtain the right value.

This problem arise because formula are stored in original sheet with such a xml

{{< highlight xml "linenos=table,linenostart=1" >}}
<c r="C2">
  <f t="shared" ref="C2:C10" si="0">A2+B2</f>
  <v>0</v>
</c>{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

This means that the cell C2 contains the formula A2+B2, but the node &lt;v&gt;0&lt;/v&gt; tells Excel that actual value is Zero. So when you open the resulting excel file, excel found that content of the cell is 0 and shows this value until some related cell changes content. To solve this problem I simply added a bit of code that removes the &lt;v&gt; element.

{{< highlight csharp "linenos=table,linenostart=1" >}}
originalElement.Descendants(ExcelFiller.ns_s + "v").Remove();
row.Add(originalElement);{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

Now when excel opens elaborated document, it found no &lt;v&gt; (value) element, so it recalculate it based on formula.

alk.

Tags: [OpenXml](http://technorati.com/tag/OpenXml)
