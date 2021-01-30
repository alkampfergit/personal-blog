---
title: "FlowDocumentScrollViewer and horizontal stretch"
description: ""
date: 2012-07-24T11:00:37+02:00
draft: false
tags: [WPF]
categories: [WPF]
---
Quite often when you use **FlowDocumentScrollViewer it does not use all horizontal space, even if the container is large enough**. Here is the declaration of my FlowDocumentScrollViewer

{{< highlight xml "linenos=table,linenostart=1" >}}


<FlowDocumentScrollViewer
  Background="red" 
  HorizontalScrollBarVisibility="Hidden"
  HorizontalAlignment="Stretch" 
  HorizontalContentAlignment="Stretch" 
  Height="100" 
  Document="{Binding Converter={converter:HtmlToDocumentConverter}}" />  

{{< / highlight >}}

As you can see I’ve set both HorizontalAlignment and HorizontalContentAlignment to Stretch, the document is inside a Grid with yellow background and here is what I see during run and in designer.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2012/07/image_thumb3.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2012/07/image3.png)

 ***Figure 1***: *FlowDocumentScrollViewer does not use all horizontal spacing*

The problem is that **FlowDocument does not stretch to occupy all horizontal spacing**. As you can see containing grid uses all horizontal space (yellow background helps you to see grid area) while documents use only a little part of available space and the result is a lot of Grid space to remain unused by the FlowDocumentScrollViewer control. The easiest way to solve this problem  **is binding the width of the FlowDocumentScrollViewer to the same width of the container control** {{< highlight xml "linenos=table,linenostart=1" >}}


Width="{Binding Path=ActualWidth, RelativeSource={RelativeSource AncestorType=Grid}}"   

{{< / highlight >}}

Thanks to the RelativeSource binding I’m able to easily obtain the result I want

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2012/07/image_thumb4.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2012/07/image4.png)

 ***Figure 2***: *Now my FlowDocumentScrollViewer use all horizontal space.*

Gian Maria
