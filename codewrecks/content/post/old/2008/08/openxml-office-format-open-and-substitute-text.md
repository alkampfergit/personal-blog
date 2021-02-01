---
title: "OpenXml Office format open and substitute text"
description: ""
date: 2008-08-29T08:00:37+02:00
draft: false
tags: [Office]
categories: [Office]
---
Quite often, customers ask us to generate reports in word format, the main advantage of this approach is that people feels comfortable working with word, and they love the possibility to modify the report once generated. In the past years I used many techniques to reach this goal, but in the end, a lot of time ago I resort to write a simple [RTF generator](http://www.codewrecks.com/blog/index.php/2008/07/09/generate-rtf-library-in-net/) that suites my needs.

In these days I reach the point where the complexities of the documents became really difficult to manage with RTF generator, moreover we need a software that permits the customers to create a master word document, then the software should only makes substitution in some prefixed part with the real data. The obvious solution seems to use Office automation, but we need this code in a web application, and office automation is not [supported by microsoft](http://blogs.msdn.com/david.wang/archive/2006/05/11/Office-Automation-and-IIS.aspx) in non interactive environment . Moreover I used this technique in the past, and it is terribly slow for big documents.

We decided to create word 2007 document so I move to OpenXml format. [Microsoft have a SDK](http://www.microsoft.com/downloads/details.aspx?FamilyId=AD0B72FB-4A1D-4C52-BDB5-7DD7E816D046&amp;displaylang=en) that permits you to manage this new format, it permits you only to work with the overall structure of the document, manage the unzipping, adding part and zipping again document, so it’s up to you to manage the XML to modify the document, but thanks to LINQ 2 XML we can really do this in a simple way. Let’s start with a little example. I’ve created a simple document with this content

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2008/08/image-thumb7.png)](https://www.codewrecks.com/blog/wp-content/uploads/2008/08/image6.png)

My goal is to find the **$$$substituteme(30)** in the document, *change it with another text and save the new document with another name*. I create an helper class that does this for me, here is the constructor.

{{< highlight csharp "linenos=table,linenostart=1" >}}
public Document(String originalDocumentPath, String destinationDocumentPath)
{
    File.Copy(originalDocumentPath, destinationDocumentPath, true);
    Doc = WordprocessingDocument.Open(destinationDocumentPath, true);
}{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

The SDK does not permits me to save document with another name, so I simply copy the master file with the name I want, then open the copy; the overall effect is the same, mantaining the master unchanged and have a file with a given name. The WordprocessingDocument class is the root class that you should use to manage docx files, it is true that a docx file is simply a zip file, but this class shield you from this permitting you to browse file content. My class assign the document to a private propery called Doc that does some basic management.

{{< highlight CSharp "linenos=table,linenostart=1" >}}
private WordprocessingDocument Doc
{
    get { return doc; }
    set
    {
        if (doc != null) doc.Dispose();
        doc = value;
        GrabDocumentParts();
    }
}

private void GrabDocumentParts()
{
    if (doc != null)
    {
        using (StreamReader sr = new StreamReader(doc.MainDocumentPart.GetStream()))
        {
            using (XmlReader xmlr = XmlReader.Create(sr))
            {
                mainDocument = XElement.Load(xmlr);
            }
        }
    }
}{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

First of all I dispose a previous document if present (actually it is not needed because I can setup document only in the constructor), suddenly  I read all the content of the MainDocumentPart into an [XElement](http://msdn.microsoft.com/en-us/library/system.xml.linq.xelement.aspx) variable. Now I can change the XElement to substitute text.

{{< highlight sql "linenos=table,linenostart=1" >}}
public static XNamespace namespace_w = XNamespace.Get("http://schemas.openxmlformats.org/wordprocessingml/2006/main");
public Document Substitute(String tagToSearch, String textToSubstitute)
{
    XElement node = FindNodeByTag( tagToSearch);
    node.Value = node.Value.Replace(tagToSearch, textToSubstitute);
    return this;
}

private XElement FindNodeByTag(String tagToSearch)
{
    return (from b in mainDocument.Descendants(namespace_w + "t")
            where b.Value.Trim() == tagToSubstitute
            select b).Single();
}{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

The code is really simple, to find the code I search for a node named w:t; remember that you need to use XML namespaces to make queries. When I found the node I simply substitute the original text with the one I want and since I love fluent interfaces, the Substitute method return the original Document object to chain calls. Finally I need a Save method that close the document and save all modified content to the file.

{{< highlight csharp "linenos=table,linenostart=1" >}}
public void Save()
{
    using (Stream s = doc.MainDocumentPart.GetStream(FileMode.Create, FileAccess.Write))
    {
        using (XmlWriter xmlw = XmlWriter.Create(s))
        {
            mainDocument.WriteTo(xmlw);
        }
    }
    doc.Close();
}{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

The process is really simple, I call GetStream of the MainDocumentPart object, but with FileMode.Create that requires the creation of a new stream, then I simply write to the stream all the content of the modified XElement, and the game is done. Here is a typical use.

{{< highlight csharp "linenos=table,linenostart=1" >}}
Document doc = new Document(@"samples\doc2.docx", @"samples\doc1saved.docx");
doc.Substitute("$$$substituteme(30)", "First Substitution!!!")
   .Substitute("$$$substituteme(25)", "Second Substitution!!!")
   .Save();{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

Thanks to the fluent interface I can use simple syntax to change various part of the document. Working with OpenXml makes really easy to manage Word documents.

alk.

