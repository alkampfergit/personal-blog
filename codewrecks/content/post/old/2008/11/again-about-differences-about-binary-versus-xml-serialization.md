---
title: "Again about differences about Binary versus Xml Serialization"
description: ""
date: 2008-11-01T01:00:37+02:00
draft: false
tags: [NET framework]
categories: [NET framework]
---
In [previous post](http://www.codewrecks.com/blog/index.php/2008/10/31/binary-versus-xml-serialization-size/) I deal with the size of binary serialization vs Xml Serialization, but as my friend [Marco](http://www.codemetropolis.com/) commented, those two techniques are really different and should not be compared directly.

Binary serialization is a technique used to obtain a binary representation of an object, and then rebuild that object from it back to a real instance in memory.

*[Serialization](http://en.wikipedia.org/wiki/Serialization)* is a process that permits to convert the state of an object into a form that can be stored into some durable medium (file, DB) to rebuild original object in the future or to send the object to another process or computer through network channels.

Xml Serialization in.net, has probably a wrong name, because it does not really *serialize* an object, it only create an XML stream with the content of all the *public properties,*it does not store private fields, and it* **is not meant** to create a stream to save object state into some durable medium*. Xml Serialization is meant as a technique to read and write XML stream to and from an object model. If you have a schema file, you can use [xsd.exe](http://msdn.microsoft.com/en-us/library/x6c1kb0s%28VS.80%29.aspx) tool to generate a set of classes that can be used to create in memory an object representation of a xml file that satisfies that schema.

A great hint that Xml serialization has little to share with binary serialization is that *XmlSerializer can serialize a class that is not marked as serializable*. This is possible because XmlSerializer does not really serialize the object it simply create a xml stream. If you have a class that simply dumps whenever the default constructor is called

{{< highlight CSharp "linenos=table,linenostart=1" >}}
public class Test3 
    {
        public Test3()
        {
            Console.WriteLine("Test3Constructor Call");
        }

        public String Property { get; set; }{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

when you deserialize an object with XmlSerializer you can see that this constructor gets called. If you deserialize an object with a BinaryFormatter the constructor is not called. This is perfectly reasonable, since serialization is meant to convert an object to a binary stream and back, so you cannot call the default constructor during deserialization because you can end in having a different object from the original one. Try this object

{{< highlight CSharp "linenos=table,linenostart=1" >}}
public class Test4
{
    public Test4()
    {
    }

    public Test4(String privateString)
    {
        this.privateString = privateString;
    }

    public String Property { get; set; }

    public String GetPrivateString()
    {
        return privateString;
    }

    private String privateString;
}{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

It has no business meaning, but if you run this code

{{< highlight csharp "linenos=table,linenostart=1" >}}
Test4 t = new Test4("privatevalue");
Console.WriteLine("GetPrivateString = " + t.GetPrivateString());
MemoryStream xms = new MemoryStream();
XmlSerializer xs = new XmlSerializer(typeof(Test4));
xs.Serialize(xms, t);

xms.Position = 0;
Test4 des = (Test4)xs.Deserialize(xms);
Console.WriteLine("GetPrivateString = " + des.GetPrivateString());{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

You will find that the output is

{{< highlight csharp "linenos=table,linenostart=1" >}}
GetPrivateString = privatevalue
GetPrivateString ={{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

Thus the deserialized object is not the same of the serialized one, thus XML serialization does not guarantees that an entity would be the same after deserialization as Marco commented in the previous post. A very different situation happens if you use binary serialization.

{{< highlight csharp "linenos=table,linenostart=1" >}}
Test4 t = new Test4("privatevalue");
Console.WriteLine("GetPrivateString = " + t.GetPrivateString());
MemoryStream bms = new MemoryStream();
BinaryFormatter bf = new BinaryFormatter();
bf.Serialize(bms, t);
bms.Position = 0;
Test4 des = (Test4) bf.Deserialize(bms);
Console.WriteLine("GetPrivateString = " + t.GetPrivateString());{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

The output is

{{< highlight csharp "linenos=table,linenostart=1" >}}
GetPrivateString = privatevalue
GetPrivateString = privatevalue{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

Thus showing that the deserialized object has the same state. But XmlSerialization have other problems, let's serialize and deserialize this class

{{< highlight CSharp "linenos=table,linenostart=1" >}}
[Serializable]
public class Testcontainer
{
    public Test test1 { get; set; }
    public Test test2 { get; set; }    
}

...

Testcontainer t = new Testcontainer();
t.test1 = t.test2 = new Test() { Property = "Test"};
MemoryStream xms = new MemoryStream();
XmlSerializer xs = new XmlSerializer(typeof(Testcontainer));
xs.Serialize(xms, t);

xms.Position = 0;
Testcontainer des = (Testcontainer)xs.Deserialize(xms);
Console.WriteLine("t.test1 == t.test2 is {0}", des.test1 == des.test2);

MemoryStream bms = new MemoryStream();
BinaryFormatter bf = new BinaryFormatter();
bf.Serialize(bms, t);
bms.Position = 0;
 des = (Testcontainer)bf.Deserialize(bms);
 Console.WriteLine("t.test1 == t.test2 is {0}", des.test1 == des.test2);
{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

The output shows you that with XML Serialization the condition des.test1 == des.test2 is false, because Xml Serialization does not check for object identity , thus it throws exception if the object graph has a circular references.

Never use XmlSerialization to store an object into durable medium unless you are perfectly aware of what you are doing.

alk.

Tags: [Serialization](http://technorati.com/tag/Serialization) [.Net Framework](http://technorati.com/tag/.Net%20Framework)

<script type="text/javascript">var dzone_url = 'http://www.codewrecks.com/blog/index.php/2008/11/01/again-about-differences-about-binary-versus-xml-serialization/';</script><script type="text/javascript">var dzone_title = 'Again about differences about Binary versus Xml Serialization.';</script><script type="text/javascript">var dzone_blurb = 'Again about differences about Binary versus Xml Serialization.';</script><script type="text/javascript">var dzone_style = '2';</script><script language="javascript" src="http://widgets.dzone.com/widgets/zoneit.js"></script> 

[![DotNetKicks Image](http://www.dotnetkicks.com/Services/Images/KickItImageGenerator.ashx?url=http://www.codewrecks.com/blog/index.php/2008/11/01/again-about-differences-about-binary-versus-xml-serialization/&amp;bgcolor=0080C0&amp;fgcolor=FFFFFF&amp;border=000000&amp;cbgcolor=D4E1ED&amp;cfgcolor=000000)](http://www.dotnetkicks.com/kick/?url=http://www.codewrecks.com/blog/index.php/2008/11/01/again-about-differences-about-binary-versus-xml-serialization/)
