---
title: "How could I work without resharper"
description: ""
date: 2011-02-23T10:00:37+02:00
draft: false
tags: [Resharper]
categories: [Experiences]
---
In a system that use heavily IoC principle, it is common during component modification, to discover that to add a new functionality that component need to add a dependency on some interface. Here is the constructor of a component

{{< highlight csharp "linenos=table,linenostart=1" >}}
public MainNavigator(
IEBrochureService brochureService,
IBroker broker)
{
{{< / highlight >}}

Now I need to add dependency from the IWpfSystem interface, so I simply add another parameter to the constructor, and R# suggests me a lot of action that could be triggered from this modification

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2011/02/image_thumb7.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2011/02/image7.png)

The first one automatically declare a field called \_engine and initialize into the constructor, but I have a lot of other options, like applying change signature refactoring, and change all call to this constructor, creating an overload version without this new parameter or even check for null assignment.

Shortcut like these one can tremendously boost up your productivity.

alk.
