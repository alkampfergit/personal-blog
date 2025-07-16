---
title: "Cleaner Xml Serialization"
description: ""
date: 2008-06-25T02:00:37+02:00
draft: false
tags: [NET framework]
categories: [NET framework]
---
Suppose you have a simple class

{{< highlight CSharp "linenos=table,linenostart=1" >}}
[Serializable, XmlRoot("LogEntry")]
public class LogFeeder
{
    private Guid sourceId;
    private String _Data;
    private String _Log;

    [XmlAttribute("DetailSourceId")]
    public Guid SourceId {
        get { return sourceId; }
        set { sourceId = value; }
    }

    [XmlAttribute("Data")]
    public string Data {
        get { return _Data; }
        set { _Data = value; }
    }

    [XmlAttribute("Log")]
    public string Log {
        get { return _Log; }
        set { _Log = value; }
    }
    public LogIUriFeeder() {}

    public LogIUriFeeder(Guid sourceId, string data, string log) {
        this.sourceId = sourceId;
        _Data = data;
        _Log = log;
    }
}{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

If you serialize with XmlSerializer you got this output as default

{{< highlight xml "linenos=table,linenostart=1" >}}
<?xml version="1.0" encoding="utf-16"?>
<LogEntry 
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
    xmlns:xsd="http://www.w3.org/2001/XMLSchema" 
    DetailSourceId="63509b61-f7a0-44ea-955a-38cce19aa13a" 
    Data="data" 
    Log="log" />{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

This is not very satisfying because I need to store it in database as xml fragment or appending to an existing xml node; so I do not care about the namespace or the xml declaration and I want to remove the xml declaration. The trick is to use an XmlWriter to specify format of outputted XML, and use a Blank Namespace to avoid namespace declaration, here is the code

{{< highlight CSharp "linenos=table,linenostart=1" >}}
public static String ToXml(Object obj) {
    XmlSerializer ser = new XmlSerializer(obj.GetType(), "");
    StringWriter sw = new StringWriter();
    XmlWriterSettings settings = new XmlWriterSettings();
    settings.OmitXmlDeclaration = true;
    settings.Indent = true;
    settings.NewLineOnAttributes = true;
    XmlSerializerNamespaces blank = new XmlSerializerNamespaces();
    blank.Add("", "");
    using (XmlWriter writer = XmlWriter.Create(sw, settings)) {
        ser.Serialize(writer, obj, blank);
    }
    return sw.ToString();
}{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

With this code the result of the serialization is

{{< highlight xml "linenos=table,linenostart=1" >}}
<LogEntry
  DetailSourceId="63509b61-f7a0-44ea-955a-38cce19aa13a"
  Data="data"
  Log="log" />{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

cleaner and shorter. With XmlWriterSettings you can also decide formatting, as example I prefer to have a new line on attributes, since my serialization is attribute centric.

alk.

Tags: [XmlSerialization](http://technorati.com/tag/XmlSerialization)

