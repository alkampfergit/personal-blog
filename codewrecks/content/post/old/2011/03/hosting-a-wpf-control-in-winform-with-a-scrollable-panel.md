---
title: "Hosting a WPF control in Winform with a scrollable Panel"
description: ""
date: 2011-03-18T11:00:37+02:00
draft: false
tags: [Winforms]
categories: [NET framework]
---
I have a winform project that uses a WPF control for reports. Everything went good, until we need to add more report to a form, and requirements told us to create a scrollbar to show all reports. I simply put a panel with autoscroll = true, and inside it I put a [TableLayoutPanel](http://msdn.microsoft.com/en-us/library/system.windows.forms.tablelayoutpanel.aspx) and everything seems to works, excepts that [ElementHost](http://msdn.microsoft.com/en-us/library/system.windows.forms.integration.elementhost.aspx) used to wrap the WPF controls when scrolled shows a messy interface.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2011/03/image_thumb4.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2011/03/image4.png)

 ***Figure 1***: *Messy interface with WPF report when I scroll the panel*

This is due to a bad iteration between the panel and the contained [ElementHost](http://msdn.microsoft.com/en-us/library/system.windows.forms.integration.elementhost.aspx), because when the panels scrolls the TableLayoutPanel noone tells the hostControl to refresh. The solution is obvious, handle the Scroll event of the [Panel](http://msdn.microsoft.com/en-us/library/kbxtbzd1%28v=VS.90%29.aspx):

{{< highlight csharp "linenos=table,linenostart=1" >}}
private void PanelContainerScroll(object sender, ScrollEventArgs e)
{
ehReport21111.Refresh();
ehReport22222.Refresh();
ehReport3333.Refresh();
.....
}
{{< / highlight >}}

I simply manually call Refresh for every ElementHost to force refresh of WPF control hosted in it.

alk.
