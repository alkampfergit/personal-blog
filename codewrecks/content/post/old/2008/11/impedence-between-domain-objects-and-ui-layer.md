---
title: "Impedence between domain objects and Ui Layer"
description: ""
date: 2008-11-20T11:00:37+02:00
draft: false
tags: [NET framework,Software Architecture]
categories: [NET framework,Software Architecture]
---
When you work with domain model your domain objects become more complex than a simple containers for table values. This makes somewhat problematic using these object directly with the UI, especially when you use native binding. Let's make an example, I have this object called  **Domain** [![image](https://www.codewrecks.com/blog/wp-content/uploads/2008/11/image-thumb10.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2008/11/image10.png)

As you can see the Domain class has a property called ContentBlackList that is a List of String. The setter is private and in the getter the list is created lazily, then I have a [User Type](http://www.codewrecks.com/blog/index.php/2008/10/21/some-details-on-older-post-about-usertype/) to map this property into a single field of a table in a list of string separated by the charachter #. The object works well, until I want to bind this property directly to a textbox in a form.

This is a common problem, if objects are not simple container for database fields it could happens that they cannot be used directly with the binding engine.

The first problem is, I need to convert the list&lt;String&gt; to a string to show data in textbox and back when the user change content of the textbox. This is fairly simple in windows forms thanks to Parse() and Format() methods of Binding object

{{< highlight CSharp "linenos=table,linenostart=1" >}}
 1 private void AddFormattingForStringList(TextBox textBoxControl)
 2         {
 3             Binding b = textBoxControl.DataBindings["Text"];
 4             if (b == null) return;
 5             b.Parse += ConvertStringToList;
 6             b.Format += ConvertListToString;
 7         }
 8 
 9         void ConvertListToString(object sender, ConvertEventArgs e)
10         {
11 
12             List<String> list = (List<String>)e.Value;
13             if (list == null || list.Count == 0)
14                 e.Value = String.Empty;
15             else
16                 e.Value = list.Aggregate((s1, s2) => s1 + "," + s2);
17         }
18 
19         void ConvertStringToList(object sender, ConvertEventArgs e)
20         {
21             String value = (String)e.Value;
22             if (String.IsNullOrEmpty(value))
23                 e.Value = new List<String>();
24             else
25                 e.Value = value.Split(',', ' ', '|', ';').ToList();
26         }{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

As you can see in line 3 I get the Binding for property *Text* of a textBox, this is necessary because I could have more bindings to other properties. Then if the binding is not null I listen for the Parse and Format events. The parse event is invoked when the Binding takes the value from the control (Textbox.Text property, a string) and assign it to the original property (a List of String) and the attached ConvertStringtoList simply split the string with various separator and uses ToList() to create a list from the array. The ConvertListToString attached to the format event, does the reverse operation, converting a list of string in a comma separated list of string, this is a breeze thanks to the Aggregate Linq operator.

But this is not enough, if you look closely at the property implementation of the original object you can see that the set part of ContentBlackList is private. This is needed because the user must not be able to change the inner IList&lt;String&gt; used by the object. This is especially important if you use an ORM like nhibernate, because usually NHibernate use lazy list and you should not substitute with other list. Since NHibernate can access private properties I'm sure that noone can tamper the original IList&lt;String&gt; implementation.

Now the problem is: Binding Engine cannot set private property, so the binding is broken.

This happens because the Domain Object is not designed with Ui in mind, and this is a  good thing, because the Domain should not depend from the Ui. To solve this typical problem you can resort to the old Proxy pattern.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2008/11/image-thumb11.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2008/11/image11.png)

As you can see the proxy wraps a real Domain object and exposes the ContentBlackList to the UI and presents both get and set methods. The Set methods simply remove all objects from the original list and then insert again thus permitting me to bind this object directly to a textbox.

The general problem discussed here is that Objects from Domain quite often are not directly usable with the UI layer, and a proxy can be a good solution, even if in domain with hundreds of classes, doing a proxy for each class can be a manteniance nightmare.

alk.

Tags: [Binding](http://technorati.com/tag/Binding) [Proxy](http://technorati.com/tag/Proxy)
