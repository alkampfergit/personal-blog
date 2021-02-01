---
title: "LINQ2XMl and namespaces"
description: ""
date: 2008-09-01T07:00:37+02:00
draft: false
tags: [LINQ]
categories: [LINQ]
---
In Xml namespace are used extensively to distinguish between tag names, you can use namespaces directly with XElement class thanks to the XNamespace class, here is an example.

{{< highlight csharp "linenos=table,linenostart=1" >}}
XNamespace ns = XNamespace.Get("http://www.nablasoft.com/mynamespace");
XElement element = new XElement(ns + "root",
                                new XElement(ns + "Element"),
                                new XElement("AnotherElement"));
Console.WriteLine(element.ToString());{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

This code works but the output is quite clumsy.

{{< highlight xml "linenos=table,linenostart=1" >}}
<root xmlns="http://www.nablasoft.com/mynamespace">
  <Element />
  <AnotherElement xmlns="" />
</root>{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

The namespace does not have an alias, so it is used as the default namespace, thus, the element AnotherElement, that has no namespace has the attribute xmlns=”” to reset it to the default namespace. This is really bad, so each time that you use XNamespace, does not forget to set an alias in the root node.

{{< highlight csharp "linenos=table,linenostart=1" >}}
1 XElement element2 = new XElement(ns +"root",
2     new XAttribute(XNamespace.Xmlns + "n", ns),
3     new XElement(ns + "Element"),
4    new XElement("AnotherElement"));
5 Console.WriteLine(element2.ToString());{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

This code is similar to the old one, but with the fundamental addition of a new XAttribute object (line 2), that creates the alias for the namespace, now the XML output of the fragment is.

{{< highlight xml "linenos=table,linenostart=1" >}}
<n:root xmlns:n="http://www.nablasoft.com/mynamespace">
  <n:Element />
  <AnotherElement />
</n:root>{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

The fragment is really cleaner, now all the node that are in the namespace are prefixed with n. But this is not enough, suppose you have to compose various fragment of XML contained in XElement with namespaces, this is a typical snippet.

{{< highlight csharp "linenos=table,linenostart=1" >}}
XElement element2 = new XElement(ns + "root",
    new XAttribute(XNamespace.Xmlns + "n", ns),
    new XElement(ns + "Element"),
   new XElement("AnotherElement"));

XElement element3 = new XElement(ns + "root",
    new XAttribute(XNamespace.Xmlns + "n", ns),
    new XElement(ns + "Element"),
    new XElement("AnotherElement"));
element2.Add(element3);
Console.WriteLine(element2.ToString());{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

I create an element2 with a namespace and an alias, then I create another element with the same namespace, finally I add an element to the other, the result is this XML fragment.

{{< highlight xml "linenos=table,linenostart=1" >}}
<n:root xmlns:n="http://www.nablasoft.com/mynamespace">
  <n:Element />
  <AnotherElement />
  <n:root xmlns:n="http://www.nablasoft.com/mynamespace">
    <n:Element />
    <AnotherElement />
  </n:root>
</n:root>{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

The result is not so good, because the inner node still have the attribute for the namespace alias declaration. Since I know that all namespace alias are contained in the root node, I can remove all subsequent namespace alias declaration.

{{< highlight csharp "linenos=table,linenostart=1" >}}
element2.Descendants().Attributes(XNamespace.Xmlns + "n").Remove();
Console.WriteLine(element2.ToString());{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

The code is really straightforward, with Descendants() I take all the nodes except the root, than I look for all inner declaration of the alias, and removed each instance with Remove(), the result is

{{< highlight xml "linenos=table,linenostart=1" >}}
<n:root xmlns:n="http://www.nablasoft.com/mynamespace">
  <n:Element />
  <AnotherElement />
  <n:root>
    <n:Element />
    <AnotherElement />
  </n:root>
</n:root>{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

This is cleaner than the previous one, because it declare namespace alias only in the root node of the XML fragment.

alk.

