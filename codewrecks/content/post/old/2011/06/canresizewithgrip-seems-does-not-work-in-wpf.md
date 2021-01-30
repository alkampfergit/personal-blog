---
title: "CanResizeWithGrip seems does not work in WPF"
description: ""
date: 2011-06-21T09:00:37+02:00
draft: false
tags: [MetroUi,WPF]
categories: [WPF]
---
I have an application that is built with a Metro-Like UI, so each windows has no border and can be resized with the ResizeMode equal to CanResizeWithGrip.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2011/06/image_thumb13.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2011/06/image13.png)

 ***Figure 1***: *The windows can be resized by a little grip on the bottom right border of the window*

I created another view, use a similar layout from the preceding one, but this time the little grip to resize the windows does not appear in the windows.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2011/06/image_thumb14.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2011/06/image14.png)

 ***Figure 2***: *The resize grip of this view is missing*

To understand why the grip is missing you need to understand how the window without border is build, here is the important properties of the windows that determines the â€œno borderâ€ style.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2011/06/image_thumb15.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2011/06/image15.png)

One thing you should be aware of, is that the key of everything is the AllowsTransparency set to True, if you set this property to false, all the background will be rendered in black, because even if Bakground=â€Transparentâ€, transparency is disabled in the Windows. Now here is what I see with AllowTransparency disabled.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2011/06/image_thumb16.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2011/06/image16.png)

 ***Figure 3***: *With AllowTransparency to false I realized that the main grid does not span the entire width of the window*

The problem is quite subtle, since the main control of the window (a grid) is smaller then the entire window, when the WPF engine renders the window, the little grip maker to resize the window is rendered on a transparent region, as you can see in Figure 4.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2011/06/image_thumb17.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2011/06/image17.png)

 ***Figure 4***: *Turning transparency on and moving the windows against a dark background now I see the marker*

The marker was correctly rendered, but since the real dimension of the window is bigger than the visible content, I do not see him where Iâ€™m expecting it to be, and this makes me think that it was not correctly rendered.

Alk.

Tags: [Wpf](http://technorati.com/tag/Wpf)
