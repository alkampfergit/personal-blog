---
title: "Winform hellndashrunning programs with low resolution"
description: ""
date: 2011-03-30T16:00:37+02:00
draft: false
tags: [Winforms]
categories: [NET framework]
---
Iâ€™ve a problem, we developed a winform program that has a really big startup form. The height of the form is 880 pixel and is designed to work on big monitors. Clearly everything is resizable, so if you resize the form you can still work with it, with no problem.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2011/03/image_thumb19.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2011/03/image15.png)

 ***Figure 1***: *the form resized*

as you can see the form is divided in: blue part (filters), yellow part (result of the query), and finally red part (detail of selected element). As you can see, even when the form is resized it is still usable. A user that work at 1027×768 send me this screenshot telling me that she could not edit details of the items

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2011/03/image_thumb20.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2011/03/image16.png)

 ***Figure 2***: *layout is completely messed, the red part (edit details) is missing*

She told me that she is not able to edit records, because the bottom part is missing, so I wonder why this is happening.

The form has a single TabControl, that contains a lot of other controls. It seems that if the form is opened at a resolution that was greater than screen resolution the tabItem will keep the original height, and since it is anchored to up,left,bottom,top, it got messed. Since the Tabcontrol has a height in the designer of 802 pixel, the form gets resizied to 730 but the TabControl still is 802 pixel, and the whole layout got messed up.

The solution is this simple fix.

{{< highlight csharp "linenos=table,linenostart=1" >}}
if (this.Height > Screen.PrimaryScreen.WorkingArea.Height)
{
this.Height = Screen.PrimaryScreen.WorkingArea.Height;
tabControl1.Height = this.Height - 78;
}
{{< / highlight >}}

This is not elegant code, but since the height of the TabControl is 78 pixel less than the heigh of the full form, I simply put a check to verify if the height of the form is greater than the height of the screen. If true I automatically resize both the form and the TabControl accordingly and the problem is solved.

alk.
