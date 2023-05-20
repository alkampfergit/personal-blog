---
title: "Find value of ASPNET ObjectDataSource or SqlDataSource at runtime"
description: ""
date: 2008-06-16T10:00:37+02:00
draft: false
tags: []
categories: [General]
---
I must admit that I do not like very much the XXXDataSource control of ASP.NET 2.0 library, but the ObjectDataSource is sometimes a quick solution to interface the UI with own LogicLayer.

In a recent project I have a complex page that set up some complex filter for data in a Sql Server engine, the logic of filtering is exposed by an object queried by an ObjectDataSource. this DataSource has QueryString Parameters, Control Parameter, and some other custom parameter to take parameter value from other sources.

I need to implement a “Delete all” function, the user filter records with various method, when he found a filter that satisfy him, he press “delete All” button and all record selected by the ObjectDataSource are to be deleted.

The simpliest solution is take the StoredProcedure that actually filter data, and create a new version that delete all the record that match the current filter, instead of selecting them. I only had to call this method from the Logic Layer, but the UI has to take all the value of the parameter from the ObjectDataSource. If you iterate in SelectParameters property of an ObjectDataSource, but data are of type System.Web.Ui.Parameter and they does not have a value member. The secret is in the GetValues function of the SelectedParameters collection, that accepts a reference to the current context and the current control, and returned a IDictionary that contains all the actual values of the parameters of the ObjectDataSource

{{< highlight csharp "linenos=table,linenostart=1" >}}
Private Sub MassiveChange(ByVal newStatus As TargetStatus)
     Dim ParamValues  As IDictionary = odsAnalyzedData.SelectParameters.GetValues(Context, odsAnalyzedData){{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

IT solves my problem quite well.

Alk.

<!--dotnetkickit-->

Tags: [ObjectDataSource](http://technorati.com/tag/ObjectDataSource)
