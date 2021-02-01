---
title: "WPF ListView with better touch support"
description: ""
date: 2010-12-20T18:00:37+02:00
draft: false
tags: [WPF]
categories: [WPF]
---
I've the need to use a listview in a WPF project based on touch monitor, and the user needs to scroll element of listview horizontally and vertically, and each element should be a UserControl with a complex ui interface.

I started with a couple of articles, [this one](http://www.codeproject.com/KB/WPF/DraggableListView.aspx) that shows a custom ListView based on the original ListView, and [that one](http://blogs.claritycon.com/blogs/kevin_marshall/archive/2007/10/18/3332.aspx) that shows an iPhone like ListView with kinetic movement. None of them satisfy my needs, but I used them as starting point to create my user control that permits me to satisfy the user need.

I implemented some nice features, if you drag partially a control, when you release the mouse the list use a smooth animation to always make the first element fully visible, if a button is in the template of the listview, you can click, but if you drag the element clicking on the button no click is raised.

If you like it, I'll make it available on codeplex, let me know.

<object width="425" height="344"><param name="movie" value="http://www.youtube.com/v/XYfAFiDn0Ao?hl=en&amp;hd=1"><embed src="http://www.youtube.com/v/XYfAFiDn0Ao?hl=en&amp;hd=1" type="application/x-shockwave-flash" width="425" height="344"></object>

Alk.
