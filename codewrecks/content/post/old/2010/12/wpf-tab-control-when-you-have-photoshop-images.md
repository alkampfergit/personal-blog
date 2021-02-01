---
title: "Wpf tab control when you have photoshop images"
description: ""
date: 2010-12-27T18:00:37+02:00
draft: false
tags: [WPF]
categories: [WPF]
---
I'm working on a project in WPF where there are a lot of skinning done in photoshop and in particular I have some Tab control with a really complex skinning of the tab part.

Since I'm not a Blend guru, and since it could be really complex to reproduce with high fidelity in wpf all complex photoshop effects that are on the original files, and since we already have the photoshop work done, we decided to use the tab in more creative way.

First: we extracted from photoshop all the five images of the tab control, one representing each selected tab.

Second: we put on the view an image and a tab control

Third: we edit the template of the tab elements of the tab control removing all elements, this makes the original tab buttons disappears from the template..

Fourth: Place a button with opacity zero on each tab represented in the image, this is needed to make possible to switch tab.

We need to include the background images as resources, and load all of them in the ViewModel initialization phase, I put all of them inside a simple List&lt;BitmapImage&gt; and I need also to create a property that will hold the Actual Background.

{{< highlight csharp "linenos=table,linenostart=1" >}}
_tabBackground = new List<BitmapImage>();
_tabBackground.Add(new BitmapImage(new Uri("pack://application:,,,/......tabimage1.png")));
_tabBackground.Add(new BitmapImage(new Uri("pack://application:,,,/......tabimage2.png")));
_tabBackground.Add(new BitmapImage(new Uri("pack://application:,,,/......tabimage3.png")));
_tabBackground.Add(new BitmapImage(new Uri("pack://application:,,,/......tabimage4.png")));
_tabBackground.Add(new BitmapImage(new Uri("pack://application:,,,/......tabimage5.png")));
TabCurrentBackground = _tabBackground[0];
{{< / highlight >}}

The current bacground is set on a property of the ViewModel, it is initialized on the first background, and finally I need to create the view.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2010/12/image_thumb3.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2010/12/image3.png)

 ***Figure 1***: *Part of the View, I highlighted the most important part of the view.*

The real TabControl has the SelectedIndex property bound to the CurrentTabIndex ViewModel property and is placed over the image that contains the photoshop static image converted to jpg. Each invisible button is bound to the ChangeTab command of the ViewModel, and has the id of the corresponding tab in the CommandParameter. ViewModel should really do little bit of work to make the tab control works.

{{< highlight csharp "linenos=table,linenostart=1" >}}
private void ExecuteChangeTab(object obj)
{
Int32 newTabIndex = Int32.Parse(obj.ToString());
CurrentTabIndex = newTabIndex;
}
{{< / highlight >}}

Just convert the value passed as ObjectParameter to an int and assign to CurrentTabIndex, because in the setter part of the CurrentTabIndex property I also update the background image to reflect the current selected tab.

This structure is really good, because it helped me to solve another problem. Two of the original five tab should support drill down, they show a list of elements, and when you select one of them you should drill down to show details. Since the tab control is completely driven by code, I create more TabItems holding the details. As an example, in the second tab I have one level drilldown, I use a ListView to show all elements and in the template of the item I put a button bound to a command of the original ViewModel called ShowSubItineraryDetails

{{< highlight csharp "linenos=table,linenostart=1" >}}
<Button Content="&gt;" Grid.Column="4" Margin="0" d:LayoutOverrides="Height" CommandParameter="{Binding}"
Command="{Binding DataContext.ShowSubItineraryDetails, RelativeSource={RelativeSource FindAncestor, AncestorType={x:Type ListView}}}"  />
{{< / highlight >}}

It issues the command ShowSubItineraryDetails to the original Viewmodel, that reacts with that code.

{{< highlight csharp "linenos=table,linenostart=1" >}}
private void ExecuteShowSubItineraryDetails(object obj)
{
SelectedSubItinerary = (SubItinerary)obj;
CurrentTabIndex = 5;
}
{{< / highlight >}}

Since the command parameter is the real object bound to the list, that contains all the details, I simply assign it to a SelectedSubItinerary property of the viewmodel, and then move to the sixth TabContent, that contains all the ui controls to show details of the objects. This is really good because the user can never show this tab clicking on the fakie tab control, and I need to do a very little work to make the logic of drill down in the ViewModel.

alk.
