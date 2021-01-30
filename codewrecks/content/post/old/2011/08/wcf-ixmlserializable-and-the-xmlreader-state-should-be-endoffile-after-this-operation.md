---
title: "Wcf IXmlSerializable and The XmlReader state should be EndOfFile after this operation"
description: ""
date: 2011-08-23T16:00:37+02:00
draft: false
tags: [LINQ]
categories: [NET framework]
---
Iâ€™ve a simple class that contains Properties metadata and I need to pass instances of that class with WCF. Since it contains Dictionary of objects I decided to implement IXmlSerializable to decide the exact format of serialization and make it usable with WCF. Since I really hate reading XML stream with [XmlReader](http://msdn.microsoft.com/en-us/library/b8a5e1s5%28v=VS.90%29.aspx), I decided to implement the ReadXml method using an XElement, thanks to the fact that I can create an XElement from a XmlReader thanks to the Load method.

{{< highlight csharp "linenos=table,linenostart=1" >}}
public void ReadXml(System.Xml.XmlReader reader)
{
XElement element = XElement.Load(wholeContent);
foreach (var xElement in element.Elements())
{{< / highlight >}}

Using an XElement is really better than using the Raw [XmlReader](http://msdn.microsoft.com/en-us/library/b8a5e1s5%28v=VS.90%29.aspx) interface. I wrote a couple of tests to verify that everything work, then I use this class in a DataContract and sent over the wire with WCF. When I call the WCF function I got a strange error â€œ **The XmlReader state should be EndOfFile after this operation**.â€ error. This happens because the serialized XML content sent by WCF is somewhat manipulated and when the XElement read the content of the XmlReader after he finished reading the content the reader is not at the end. This check is somewhat annoying but you can do a dirty trick to avoid this problem.

{{< highlight csharp "linenos=table,linenostart=1" >}}
String wholeContent = reader.ReadInnerXml();
XElement element = XElement.Parse(wholeContent);
{{< / highlight >}}

Iâ€™ve changed the ReadXml function only a little, I read all the content of the XmlReader in a String thanks to the [ReadInnerXml](http://msdn.microsoft.com/en-us/library/system.xml.xmlreader.readouterxml%28v=VS.90%29.aspx)() method, then I use the standard XElement.Parse() method to create an XElement from a string. Everything works as expected, but I still wonder why the XmlReader that comes from a WCF serialization cannot be read directly in an XElement. o\_O

Gian Maria.
