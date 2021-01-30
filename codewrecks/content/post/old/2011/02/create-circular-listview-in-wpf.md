---
title: "Create circular listview in wpf"
description: ""
date: 2011-02-10T13:00:37+02:00
draft: false
tags: [WPF]
categories: [WPF]
---
In my little Wpf [ListView with better touch support](http://www.codewrecks.com/blog/index.php/2010/12/20/wpf-listview-with-better-touch-support/) I had the need to support the concept of circular scrolling. What I want is the ability to scroll elements continuously, as if the list was circular; if I have 5 elements, from 0 to 4 I want to scroll left from the element 4 to the element 0.

<iframe title="YouTube video player" height="390" src="http://www.youtube.com/embed/-YQxxyCUNLo" frameborder="0" width="480" allowfullscreen="allowfullscreen"></iframe>

As you can see in this short video the listview appears not to have an end and we can scroll how many elements we want. This is a trick or an illusion and is obtained with a  little support from the viewmodel. This KineticListView was bound to a peculiar property of the ViewModel

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2011/02/image_thumb5.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2011/02/image5.png)

Property is called DataToShowSingleRepetition, and here is how it is handled in the ViewModel.

{{< highlight csharp "linenos=table,linenostart=1" >}}
DataToShowSingleRepetition.Add(new Data() { Value = "Stringa che Ã¨ abbastanza lunga " + 0, IValue = 0 });
DataToShowSingleRepetition.Add(new Data() { Value = "Stringa che Ã¨ abbastanza lunga " + 1, IValue = 1 });
DataToShowSingleRepetition.Add(new Data() { Value = "Stringa che Ã¨ abbastanza lunga " + 2, IValue = 2 });
DataToShowSingleRepetition.Add(new Data() { Value = "Stringa che Ã¨ abbastanza lunga " + 3, IValue = 3 });
DataToShowSingleRepetition.Add(new Data() { Value = "Stringa che Ã¨ abbastanza lunga " + 4, IValue = 4 });
 
var temp = DataToShowSingleRepetition.Last();
DataToShowSingleRepetition.Add(DataToShowSingleRepetition.First());
DataToShowSingleRepetition.Insert(0, temp);
{{< / highlight >}}

The trick in the last three lines. We need to show five elements, but I place a copy of the last one (the one with value 4) at the beginning of the list and a copy of the first (the one with value 0) to the end of the list. This is needed to â€œsimulateâ€ the fact that we are actually scrolling a circular set of elements.

The logic behind this is: when the first logical element (the one with value 0) is shown, we should be able to scroll the list to the right, showing the last logical element (the one with value 4) to the left, and since the original ListView does not support this concept we need to repeat the logical last element as the first element. What it happens is that, when the KineticListView finish to scroll, it check if we are on the physical first element (the one with value 4). If it is true, it immediately moves to the same element at the end of the list.

[![SNAGHTML1415288](http://www.codewrecks.com/blog/wp-content/uploads/2011/02/SNAGHTML1415288_thumb.png "SNAGHTML1415288")](http://www.codewrecks.com/blog/wp-content/uploads/2011/02/SNAGHTML1415288.png)

In this example the list shows only one element but we can use the circular option even when the list shows multiple items, we need only to repeat more elements, here is the result.

<iframe title="YouTube video player" height="390" src="http://www.youtube.com/embed/FDsbyoFJ7FA" frameborder="0" width="640" allowfullscreen="allowfullscreen"></iframe>

As you can see the illusion to have circular elements is maintained even if we are actually showing three elements at a single time. Here is the code in the ViewModel.

{{< highlight csharp "linenos=table,linenostart=1" >}}
DataToShowRepetition.Insert(0, DataToShow[DataToShow.Count - 1]);
DataToShowRepetition.Insert(0, DataToShow[DataToShow.Count - 2]);
DataToShowRepetition.Insert(0, DataToShow[DataToShow.Count - 3]);
DataToShowRepetition.Insert(0, DataToShow[DataToShow.Count - 4]);
DataToShowRepetition.Insert(0, DataToShow[DataToShow.Count - 5]);
DataToShowRepetition.Insert(0, DataToShow[DataToShow.Count - 6]);
DataToShowRepetition.Add(DataToShow[0]);
DataToShowRepetition.Add(DataToShow[1]);
DataToShowRepetition.Add(DataToShow[2]);
DataToShowRepetition.Add(DataToShow[3]);
DataToShowRepetition.Add(DataToShow[4]);
DataToShowRepetition.Add(DataToShow[5]);
{{< / highlight >}}

We are actually repeating six element for each side of the list and KineticListView has a corresponding property used to specify how many elements we are repeating, called CircularRepetitions.

{{< highlight csharp "linenos=table,linenostart=1" >}}
<KineticListView:KineticListView
x:Name="listView3" ItemsSource="{Binding Path=DataToShowRepetition}"
Width="600"
ItemTemplate="{DynamicResource DataTemplate1}"
BorderThickness="0"
Circular="true"
CircularRepetitions="6"
Direction="Horizontal">
{{< / highlight >}}

In the code of the kinetic there is some simple math to handle this situation that is really similar to the standard one with only one element.

Alk.
