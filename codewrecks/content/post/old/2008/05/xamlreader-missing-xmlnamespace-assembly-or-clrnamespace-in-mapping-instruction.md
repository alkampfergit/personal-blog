---
title: "XamlReader quotMissing XmlNamespace Assembly or ClrNamespace in Mapping instructionquot"
description: ""
date: 2008-05-18T02:00:37+02:00
draft: false
tags: [Uncategorized]
categories: [General]
---
This post is a clarification of the [preceding post](http://www.codewrecks.com/blog/?p=257).

If you try to load XAML file at runtime with the XamlReader it is important that you specify the full assembly if the file contain reference to local defined object. As an example, if I use a custom IValueConverter defined in my assembly, the cyder designer can generate such a XAML file for a resource

{{< highlight xml "linenos=table,linenostart=1" >}}
<ResourceDictionary xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
    xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
    xmlns:UILogic="clr-namespace:Proximo.Planner.Gui.Presentation.UILogic">{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

IF the code gets compiled into the assembly all went good, but when you try to compile with  **XamlReader.Load()** an exception of type XamlParseException is raised with such a message “Missing XmlNamespace, Assembly, or ClrNamespace in Mapping instruction. Line ‘3’ Position ‘5’.”

You have to specfy the assembly where the UILogic namespace live. You can try

xmlns:UILogic=”clr-namespace:Proximo.Planner.Gui.Presentation.UILogic **<font color="#ff0000">, Proximo.Planner.Gui</font>** “&gt;

But the error is still there, you cannot use the standard syntax to define a type in.net, because in XAML the story is a little bit different, here is the correct way to declare a custom namespace in XAML file that has to be loaded runtime.

xmlns:UILogic=”clr-namespace:Proximo.Planner.Gui.Presentation.UILogic<font color="#ff0000"><strong>;assembly=Proximo.Planner.Gui</strong></font>“&gt;

Now the file can be loaded successfully

Alk.

Tags: [XamlReader](http://technorati.com/tag/XamlReader)

<!--dotnetkickit-->
