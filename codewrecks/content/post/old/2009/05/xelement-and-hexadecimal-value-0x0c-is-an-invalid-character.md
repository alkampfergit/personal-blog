---
title: "XElement and hexadecimal value 0x0C is an invalid character"
description: ""
date: 2009-05-27T10:00:37+02:00
draft: false
tags: [NET framework]
categories: [NET framework]
---
Iâ€™ve a little library that build excel files in openXml format. It is based on LINQ to XML, and permits you to open an excel file with open xml sdk, then manipulate the content and showing it to the user.

Today for a particular set of data I got

> hexadecimal value 0x0C, is an invalid character

This is a standard error of Xml, due to the fact that there are some character in ASCII set that cannot be included in XML content. Since I read data from a db, it happens that some strings contain char 0x0C ( **\f** ). To accomplish  this with the minimum effort I simply write such a class

{{< highlight chsarp "linenos=table,linenostart=1" >}}
class SanitizedXmlWriter : XmlWriter
{
    private XmlWriter wrapped;

    public SanitizedXmlWriter(XmlWriter wrapped)
    {
        this.wrapped = wrapped;
    }

    public override void Close()
    {
        wrapped.Close();
    }{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

This is a simple wrapper for an XmlWriter, since I got this error when I try to write to a XmlWriter an XElement that contains those non valid chars. All functions are simple wrappers of base class except that one that write  a string.

{{< highlight chsarp "linenos=table,linenostart=1" >}}
public override void WriteString(string text)
{
    if (text.All(c => IsValidXmlChar(c)))
    {
        wrapped.WriteString(text);
    }
    else
    {
        StringBuilder sb = new StringBuilder(text.Length);
        foreach (char c in text)
        {
            if (IsValidXmlChar(c))
                sb.Append(c);
        }
        wrapped.WriteString(sb.ToString());
    }
}{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

The first test verify if All characters in input string are valid chars, if yes I can simply use base function, while if there is a single invalid chars, I need to copy all chars into a temp string builder, discarding invalid chars. Now I can use whenever I write XElement to a XmlWriter

{{< highlight csharp "linenos=table,linenostart=1" >}}
using (Stream s = workbookPart.SharedStringTablePart.GetStream(FileMode.Create, FileAccess.Write))
{
    using (XmlWriter xmlw = new SanitizedXmlWriter(XmlWriter.Create(s)))
    {
        XmlSharedString.WriteTo(xmlw);
    }{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

Et voilÃ , now everything works ok again.

Alk.

Tags: [Xml](http://technorati.com/tag/Xml)
