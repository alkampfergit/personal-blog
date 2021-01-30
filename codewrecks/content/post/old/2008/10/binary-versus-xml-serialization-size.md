---
title: "Binary versus Xml Serialization size"
description: ""
date: 2008-10-31T03:00:37+02:00
draft: false
tags: [NET framework]
categories: [NET framework]
---
Yesterday a [friend](http://dotnetmarche.org/members/Roberto-Sileoni.aspx) of [DotNetMarche](http://dotnetmarche.org/) asked me this question: â€œI have the need to store serialized objects into database , I can choose between binary or xml format, which is smaller in size?â€

My first answer was â€œBinary should occupy less space because it is more compactâ€ but he told me that DBA checked that xml entities actually uses less space than binary ones.

This morning I did some test with a simple class

{{< highlight CSharp "linenos=table,linenostart=1" >}}
    [Serializable] public class Test {public String Property { get; set; }}{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

I tried this code

{{< highlight csharp "linenos=table,linenostart=1" >}}
private static void Test(string testString)
{
    MemoryStream bms = new MemoryStream();
    BinaryFormatter bf = new BinaryFormatter();
    Test t = new Test() {Property = testString};
    bf.Serialize(bms, t);
    Console.WriteLine("BinaryFormatterSize = {0}", bms.Length);

    MemoryStream xms = new MemoryStream();
    XmlSerializer xs = new XmlSerializer(typeof(Test));

    xs.Serialize(xms, t);
    Console.WriteLine("XmlSerializerSize = {0}", xms.Length);

    Console.WriteLine(Encoding.UTF8.GetString(bms.ToArray()));
    Console.WriteLine(Encoding.UTF8.GetString(xms.ToArray()));
}
{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

Basically I created an object of type Test and I serialize it with BinaryFormatter and XmlSerializer dumping the size of the serialized data as well as a conversion to string using the UTF8 Unicode encoding, then I invoke this function with Test("abcdefghi this is a longer string to test for a different situation");

The result was.

{{< highlight xml "linenos=table,linenostart=1" >}}
BinaryFormatterSize = 236
XmlSerializerSize = 229
 ?   ?????       ??   JConsoleApplication4, Version=1.0.0.0, Culture=neutral, Pu
blicKeyToken=null??   ?ConsoleApplication4.Test?   ?<Property>k__BackingField??
  ??   Cabcdefghi this is a longer string to test for a different situation?
<?xml version="1.0"?>
<Test xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://ww
w.w3.org/2001/XMLSchema">
  <Property>abcdefghi this is a longer string to test for a different situation<
/Property>
</Test>{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

As you can verify the binary formatter is actually longer than xml one, this because you can see that in binary serialization the.net environment serialize the whole name of the class as well as the name of the property saved (k\_\_BackingField because it is an auto property). The xml version is smaller but if you change the XmlSerialization in this way

{{< highlight csharp "linenos=table,linenostart=1" >}}
XmlWriterSettings settings = new XmlWriterSettings();
settings.OmitXmlDeclaration = true;
settings.Indent = true;
settings.NewLineOnAttributes = true;
XmlSerializerNamespaces blank = new XmlSerializerNamespaces();
blank.Add("", "");
using (XmlWriter writer = XmlWriter.Create(xms, settings))
{
    xs.Serialize(writer, t, blank);
}{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

You are asking for suppression of the XMLDeclaration and no namespace, the result of this test is.

{{< highlight xml "linenos=table,linenostart=1" >}}
BinaryFormatterSize = 236
XmlSerializerSize = 110
 ?   ?????       ??   JConsoleApplication4, Version=1.0.0.0, Culture=neutral, Pu
blicKeyToken=null??   ?ConsoleApplication4.Test?   ?<Property>k__BackingField??
  ??   Cabcdefghi this is a longer string to test for a different situation?
?<Test>
  <Property>abcdefghi this is a longer string to test for a different situation<
/Property>
</Test>{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

WOW! the xml serialization is less than half in size respect to binary serialization, this because the XMLSerializer does not need to store the type of the object into the serialized format, since you specify the type on XmlSerializer constructor. Moreover the Xml format is human readable and can be validated with XSD or manipulated with XSLT.

Alk.

Tags: [Serialization](http://technorati.com/tag/Serialization) [.NET Framework](http://technorati.com/tag/.NET%20Framework)

<script type="text/javascript">var dzone_url = 'http://www.codewrecks.com/blog/index.php/2008/10/31/binary-versus-xml-serialization-size/';</script><script type="text/javascript">var dzone_title = 'Binary versus Xml Serialization size';</script><script type="text/javascript">var dzone_blurb = 'Binary versus Xml Serialization size';</script><script type="text/javascript">var dzone_style = '2';</script><script language="javascript" src="http://widgets.dzone.com/widgets/zoneit.js"></script> 

[![DotNetKicks Image](http://www.dotnetkicks.com/Services/Images/KickItImageGenerator.ashx?url=http://www.codewrecks.com/blog/index.php/2008/10/31/binary-versus-xml-serialization-size/&amp;bgcolor=0080C0&amp;fgcolor=FFFFFF&amp;border=000000&amp;cbgcolor=D4E1ED&amp;cfgcolor=000000)](http://www.dotnetkicks.com/kick/?url=http://www.codewrecks.com/blog/index.php/2008/10/31/binary-versus-xml-serialization-size/)
