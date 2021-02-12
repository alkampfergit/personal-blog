---
title: "Quick reminder on How-To map items of a list view to a VM command"
description: ""
date: 2011-06-23T12:00:37+02:00
draft: false
tags: [MVVM,WPF]
categories: [WPF]
---
The problem is really simple, but sometimes I see people tend to forget a little bit how the DataContext works in WPF and being stuck in wandering why a command is not invoked when a button inside a DataTemplate is pressed.

Suppose you have a ListView bounds to a list of items called *SingleResult*, for each SingleResult I have a complex layout and the main ViewModel contains a command that expect a SingleResult parameter called *ShowDetails* that simply shows the details of a SingleResult item. I see people do binding in this way.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2011/06/image_thumb18.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2011/06/image18.png)

 ***Figure 1***: *Code to bind a button to a command*

When the program runs this is the UI.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2011/06/image_thumb19.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2011/06/image19.png)

 ***Figure 2***: *The UI in action.*

Now clicking on the Details button makes nothing to happen. The reason is quite simple, with the syntax in Figure 1, you are actually binding the command to the *ShowDetails* command of the SingleResult item bound to that row.

This happens because the code is inside a  **DataTemplate** , and the DataContext is the specific object used to render the row. In an good MVVM scenario the *SingleResult*object should have ShowDetails command and everything works good, but if you prefer to define the command to the main ViewModel, you need to change the syntax in this way.

{{< highlight csharp "linenos=table,linenostart=1" >}}
Command="{Binding DataContext.ShowDetails, RelativeSource={RelativeSource FindAncestor, AncestorType={x:Type Window}}}"
{{< / highlight >}}

This code works because the command is bound to the ShowDetails defined on the DataContext of the ancestor of type Window, thus, actually binding to the main ViewModel.

Alk.

Tags: [MVVM](http://technorati.com/tag/MVVM)
