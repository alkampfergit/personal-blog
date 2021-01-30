---
title: "WPF BagOfTricks and maybe a little bug in setting current date value"
description: ""
date: 2008-05-10T01:00:37+02:00
draft: false
tags: [WPF]
categories: [WPF]
---
I love wpf, but one of the most annoyng missing controls is a sort of dateTimePicker, luckily we have [Kevin’s WPF Bag Of Trick](http://j832.com/bagotricks/) that has a very useful set of controls. I begin to use this library today, I drop a DatePicker control on the page, and on page load I initialize with current date

{{< highlight csharp "linenos=table,linenostart=1" >}}
InitializeComponent();
datePicker.Value = DateTime.Now;{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

The windows opens, but when I click on the DatePicker and try to select a new date nothing happens……it seems a bug because if I change the preceding code in this way (Setting passing only the date part of the DateTime.Now)

{{< highlight csharp "linenos=table,linenostart=1" >}}
InitializeComponent();
datePicker.Value = DateTime.Now.Date;{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

All seems to work well. Apart this little bug the control is really fantastic :D

Alk.
