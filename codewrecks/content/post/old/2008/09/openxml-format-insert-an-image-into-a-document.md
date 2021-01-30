---
title: "OpenXml format insert an image into a document"
description: ""
date: 2008-09-02T00:00:37+02:00
draft: false
tags: [Office]
categories: [Office]
---
In [previous post](http://www.codewrecks.com/blog/index.php/2008/08/29/openxml-office-format-open-and-substitute-text/) I showed how to open a docx file, search for a specific text, and replace the text with another string. The reason for doing this is simply to create a master report file in docx format, and let an application insert data in specific part of the document itself.

The next step is to substitute text with an image, this is a more complex process, because we need first to insert the image into the package, then we need to reference it in the main document. The first part is really simple

{{< highlight csharp "linenos=table,linenostart=1" >}}
ImagePart newImage = document.MainDocumentPart.AddImagePart(imageType);
using (Stream image = new FileStream(imageFileName, FileMode.Open, FileAccess.Read, FileShare.Read))
{
    newImage.FeedData(image);
}{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

This code is a part of a little library I’m developing, in the first line I use the AddImagePart method of the MainDocumentPart, that creates another part of the document that will contain an image, then I simply open a fileStream to read the image data and use the method FeedData of the ImagePart object. Now we have the image included in the document.

The next step is to add a reference to the image into the document, to accomplish this I store an XML fragment in project resources

{{< highlight xml "linenos=table,linenostart=1" >}}
<root     xmlns:ve="http://schemas.openxmlformats.org/markup-compatibility/2006" 
    xmlns:o="urn:schemas-microsoft-com:office:office" 
    xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" 
    xmlns:m="http://schemas.openxmlformats.org/officeDocument/2006/math" 
    xmlns:v="urn:schemas-microsoft-com:vml" 
    xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing" 
    xmlns:w10="urn:schemas-microsoft-com:office:word" 
    xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" 
    xmlns:wne="http://schemas.microsoft.com/office/word/2006/wordml">
<w:drawing>
                    <wp:inline distT="0" distB="0" distL="0" distR="0">
                        <wp:extent cx="955040" cy="955040"/>
                        <wp:effectExtent l="19050" t="0" r="0" b="0"/>
                        <wp:docPr id="1" name="Immagine 1" descr=""/>
                        <wp:cNvGraphicFramePr>
                            <a:graphicFrameLocks xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" noChangeAspect="1"/>
                        </wp:cNvGraphicFramePr>
                        <a:graphic xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main">
                            <a:graphicData uri="http://schemas.openxmlformats.org/drawingml/2006/picture">
                                <pic:pic xmlns:pic="http://schemas.openxmlformats.org/drawingml/2006/picture">
                                    <pic:nvPicPr>
                                        <pic:cNvPr id="0" name="Picture 1" descr=""/>
                                        <pic:cNvPicPr>
                                            <a:picLocks noChangeAspect="1" noChangeArrowheads="1"/>
                                        </pic:cNvPicPr>
                                    </pic:nvPicPr>
                                    <pic:blipFill>
                                        <a:blip r:embed="###imageid###"/>
                                        <a:srcRect/>
                                        <a:stretch>
                                            <a:fillRect/>
                                        </a:stretch>
                                   ...
            </root>{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

This is the code that word generates for an image. Despite the complexities of the fragment, the important part is that the only things you need to change to include the image is substute the ###imageid### with the real id of the embedded object.

{{< highlight csharp "linenos=table,linenostart=1" >}}
String nodeContent =
    Properties.Resources.XmlContentForEmbedImage.Replace(
        "###imageid###",
        document.MainDocumentPart.GetIdOfPart(newImage));{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

Thanks to the method GetIdOfPart() of MainDocumentPart we are able to get the id of the previously embedded image, now we can simply insert this piece of Xml into the MainDocumentPart to include the image in the word document.

alk.

Tags: [OpenXml](http://technorati.com/tag/OpenXml)

Technorati Tags: [OpenXml](http://technorati.com/tags/OpenXml)

<!--dotnetkickit-->
