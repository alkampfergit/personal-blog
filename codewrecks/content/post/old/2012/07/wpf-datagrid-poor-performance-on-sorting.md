---
title: "Wpf DataGrid poor performance on sorting"
description: ""
date: 2012-07-06T08:00:37+02:00
draft: false
tags: [DataGrid,WPF]
categories: [WPF]
---
I’ve a WPF View where with a simple  **DataGrid that shows hundreds of rows** , it all works fine until I added sorting capabilities; when I click on the header to sort content, it took almost 5 seconds to sort 500 elements, and this kind of performance is simply unacceptable. The first step was firing a profiler to understand *where*  the code is slow, and I found this result.

[![SNAGHTML969d89](http://www.codewrecks.com/blog/wp-content/uploads/2012/07/SNAGHTML969d89_thumb.png "SNAGHTML969d89")](http://www.codewrecks.com/blog/wp-content/uploads/2012/07/SNAGHTML969d89.png)

 ***Figure 1***: *Profiler shows me that almost all the time was spent in the UpdateLayout framework function*

Since profiler shows me that the problem is in calculating the layout of the grid, I modified the XAML code to be sure that Virtualization of the UI Rendering is active

{{< highlight xml "linenos=table,linenostart=1" >}}


<DataGrid ItemsSource="{Binding ResultOfSearch}" 
            AutoGenerateColumns="False" 
            VirtualizingStackPanel.IsVirtualizing="True"
            VirtualizingStackPanel.VirtualizationMode="Recycling"
&#91;/sourcecode&#93;
</pre>
</div>

<p>The secret is in the <a href="http://msdn.microsoft.com/en-us/library/system.windows.controls.virtualizingstackpanel.isvirtualizing"><strong>VirtualizingStackPanel.IsVirtualizing</strong></a><strong> property set to true</strong>, this means that when it is time to calculate the layout of the grid, only the visible elements took part in calculation, this is how MSDN describe this property</p>

<blockquote>
  <p>The standard layout system creates item containers and computes layout for each item associated with a list control. The word &quot;virtualize&quot; refers to a technique by which a subset of UI elements are generated from a larger number of data items based on which items are visible on-screen. Generating many UI elements when only a few elements might be on the screen can adversely affect the performance of your application. The <a href="http://msdn.microsoft.com/en-us/library/system.windows.controls.virtualizingstackpanel.aspx">VirtualizingStackPanel</a> calculates the number of visible items and works with the <a href="http://msdn.microsoft.com/en-us/library/system.windows.controls.itemcontainergenerator.aspx">ItemContainerGenerator</a> from an <a href="http://msdn.microsoft.com/en-us/library/system.windows.controls.itemscontrol.aspx">ItemsControl</a> (such as <a href="http://msdn.microsoft.com/en-us/library/system.windows.controls.listbox.aspx">ListBox</a> or <a href="http://msdn.microsoft.com/en-us/library/system.windows.controls.listview.aspx">ListView</a>) to create UI elements only for visible items.</p>
</blockquote>

<p>But the problem is still there, really slow sorting even with VirtualizingStackPanel enabled, then I realized that the DataGrid was wrapped inside a <strong>ScrollViewer</strong> and this is the root cause of the problem. The ScrollViewer lets its content grow to occupy all the space he need, then he manage to scroll its content. This means that if you put a complex control like a DataGrid inside a ScrollViewer you are vanishing the concept of VirtualizingStackPanel because the DataGrid will always calculate the layout for full content. If the grid has 1000 element he will need to calculate the layout <em>for the entire DataGrid</em> and this is peformance killer. Removing the ScrollViewer and enabling scrolling directly on the GridView with the property </p>

<div style="padding-bottom: 0px; margin: 0px; padding-left: 0px; padding-right: 0px; display: inline; float: none; padding-top: 0px" id="scid:C89E2BDB-ADD3-4f7a-9810-1B7EACF446C1:2d3619b7-3544-4276-912f-94d2e58237a4" class="wlWriterEditableSmartContent"><pre style=white-space:normal>

ScrollViewer.CanContentScroll="True"

{{< / highlight >}}

solved the problem. Now even with 1000 elements the grid is sorting smootly.

Gian Maria
