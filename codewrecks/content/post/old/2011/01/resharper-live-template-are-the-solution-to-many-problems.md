---
title: "Resharper live template are the solution to many problems"
description: ""
date: 2011-01-17T11:00:37+02:00
draft: false
tags: [Resharper]
categories: [Programming]
---
Surely when you write code you write a lot of similar snippets, as an example, defining properties in objects that should implements INotifyPropertyChanged is usually highly repetitive, I write my properties like this one.

{{< highlight csharp "linenos=table,linenostart=1" >}}
[DataMember]
public Int32 Rank
{
get { return _rank; }
set { this.Set(p => p.Rank, value, ref _rank); }
}
private Int32 _rank;
{{< / highlight >}}

DataMember is needed for WCF, and the setter part is based on some base class and some helpers that raise INotifyPropertyChanged etc etc etc. Writing many of these is really tedious, so it is time to write a VS Snippet or still better, a Resharper Live Template.

The main difference is that R# has the concept of macro, writing such a snippet requires that the name of the field is the same of the property, but with first character lowercase and prefixed with a  \_.

Here is the template in R#.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2011/01/image_thumb7.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2011/01/image7.png)

 **Figure 1** : *Live template in action*

Now You can simply assign a shortcut to this template and defining new properties is really a breeze.

Alk.
