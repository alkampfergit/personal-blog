---
title: "Manage image in openXml format part2"
description: ""
date: 2008-09-08T03:00:37+02:00
draft: false
tags: [Office]
categories: [Office]
---
In [a previous post](http://www.codewrecks.com/blog/index.php/2008/09/02/openxml-format-insert-an-image-into-a-document/) I deal with image insertion into an openXml document. Now it is time to show how to change image dimension, I want to be able to define new dimension and to choose if the image should be stretched or no. The *w:drawing*element has two distinct part to manage image dimension, the first is the *wp:extent*node, child of the wp:inline one.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2008/09/image-thumb2.png)](http://www.codewrecks.com/blog/wp-content/uploads/2008/09/image2.png)

This node determines the extent of the area of the document that will contain the image, but to really change dimension of the image we should operate in a different tag:

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2008/09/image-thumb3.png)](http://www.codewrecks.com/blog/wp-content/uploads/2008/09/image3.png)

The *spPr*node is used to determines the shape properties as described in the section 4.4.1.41 of the specification of the openXml format, it contains the *xfrm* node, that is used to apply 2D transformation to an object. This particular node is used to specify the offset of the picture into the area, and the ext is used to set the real image dimension. The code to change image width is the following

{{< highlight csharp "linenos=table,linenostart=1" >}}
String nodeContent =
    Properties.Resources.XmlContentForEmbedImage.Replace(
        "###imageid###",
        document.WordProcessingDocument.MainDocumentPart.GetIdOfPart(newImage))
       .Replace("###width###", (Width * 9525).ToString())
       .Replace("###height###", (Height * 9525).ToString());
nodeContent = SetImageDimension(nodeContent);{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

I store a sample of the image xml code in the resource file of the project, then I simply change image Id as described in the previous post, finally I change the width and height of the wp:extent. Since the value of these tag are to be expressed in EMUs (that is English Metric Units and not the [famous animal](http://www.planetozkids.com/oban/animals/facts-emu.htm)) I multiply for 9525, a constant that converts from pixel unit to EMUs. The function SetImageDimension sets the a:xfrm node.

{{< highlight csharp "linenos=table,linenostart=1" >}}
private string SetImageDimension(string nodeContent)
{
    if (StretchImage)
    {
        nodeContent = nodeContent.Replace("###widthr###", (Width * 9525).ToString())
               .Replace("###heightr###", (Height * 9525).ToString());
    }
    else
    {
        Double widthRatio = OriginalWidth / (Double) Width;
        Double heightRatio = OriginalHeight / (Double) Height;
        Double realRatio = Math.Max(widthRatio, heightRatio);
        nodeContent = nodeContent.Replace("###widthr###", (OriginalWidth * realRatio * 9525).ToString())
                           .Replace("###heightr###", (OriginalHeight * realRatio * 9525).ToString());
    }
    return nodeContent;
}{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

As you can see in the sample image code I write ###widthr### and ###heightr### tag to set the correct format, if the StretchImage is set to true, I simply set the width and height as specified from the user, if it is false I should make some simple calculation to avoid image stretching.

Now I’m able to resize the image as desidered.

alk.

Tags: [docx](http://technorati.com/tag/docx) [openXml Format](http://technorati.com/tag/openXml%20Format)

<!--dotnetkickit-->
