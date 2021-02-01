---
title: "Consistency from WPF and GDI in creating images from stream"
description: ""
date: 2010-12-28T09:00:37+02:00
draft: false
tags: [WPF]
categories: [WPF]
---
If you have a Stream and want to create a simple GDI+ Bitmap you can write this simple code.

[![SNAGHTML5424c0](https://www.codewrecks.com/blog/wp-content/uploads/2010/12/SNAGHTML5424c0_thumb.png "SNAGHTML5424c0")](https://www.codewrecks.com/blog/wp-content/uploads/2010/12/SNAGHTML5424c0.png)

 ***Figure 1***: *FromStream static method permits to easily build an Image from a Stream*

Bitmap object has a static method called FromStream, that is used to take a stream as input and creates an System.Drawing.Image as result, is easy and simple to use. In WPF you have a different object to represent images, the BitmapImage, and you can be really surprised to notice that it has no FromStream static method.

To solve this inconsistency of API (I'm expecting to have a FromStream method to keep the Windows.Media API similar to GDI+), you can write a simple extension method.

{{< highlight csharp "linenos=table,linenostart=1" >}}
public static BitmapImage FromStream(this BitmapImage image, Stream stream)
{
image.BeginInit();
image.StreamSource = stream;
image.EndInit();
stream.Close();
return image;
}
{{< / highlight >}}

This method simply fill the BitmapImage with the content of the Stream, so you can call it with this code.

{{< highlight csharp "linenos=table,linenostart=1" >}}
var streamImage = myService.GetStreamResource("Image_XXXX");
BitmapImage bi = new BitmapImage();
bi.FromStream(streamImage);
{{< / highlight >}}

We have two thing to notice, the first one is that we have an instance method, not a static one, so you need to Build an Empty BitmapImage and then loading the stream, the other difference from Bitmap is really interesting.

One of the annoying characteristic of GDI Bitmap can be found reading the documentation of Bitmap.FromStream() method:

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2010/12/image_thumb4.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2010/12/image4.png)

It could be difficult to keep reference of the original Stream and keeping it open until you use the Bitmap, thus the BitmapImage is in my opinion more powerful because if you see the extension method shown before, I close the stream before returning, thus the BitmapImage does not need the original stream to be keep open.

This behavior is in my opinion most intuitive, because having a stream that represents an Image is useful only to create some object that can be handled from the UI, then the original stream should be disposed, and the memory used by the image should be handled by the UI engine (WPF in this situation).

alk.
