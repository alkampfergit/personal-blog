---
title: "Wpf Design Time Data"
description: ""
date: 2012-10-22T19:00:37+02:00
draft: false
tags: [WPF]
categories: [WPF]
---
A really cool aspect of WPF is the  **ability to use DesignTimeData,** a feature that added with MVVM pattern gives a unique DesignTime capabilities to programmer and designers. To use Design Time Data you can simply add a new xaml file and use the Build Action DesignData as visible in  **Figure 1** [![image](https://www.codewrecks.com/blog/wp-content/uploads/2012/10/image_thumb3.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2012/10/image3.png)

 ***Figure 1***: *A xaml file with the Build Action of type DesignData.*

Now you can simply instantiate your ViewModel inside the code of Design Dat; in a simple LogViewer I have a ViewModel called RawLoggerViewModel that has various properties and I can simply instantiate it in DesignData file, because after all a XAML file is nothing than a serialized object XML representation

{{< highlight xml "linenos=table,linenostart=1" >}}


<ViewModels:RawLoggerViewModel 
    xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"       
    xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml" xmlns:d="http://schemas.microsoft.com/expression/blend/2008" 
    xmlns:coll="clr-namespace:System.Collections.ObjectModel;assembly=System"
    xmlns:ViewModels="clr-namespace:LogVisualizer.ViewModels"
    xmlns:system="clr-namespace:System;assembly=mscorlib"
    xmlns:infrastructure="clr-namespace:LogVisualizer.Infrastructure">
    <ViewModels:RawLoggerViewModel.MainFilter>
        Value of the filter
    </ViewModels:RawLoggerViewModel.MainFilter>

{{< / highlight >}}

As you can see I have declared my RawLoggerViewModel in the namespace LogVisualizer.ViewModels, thus I can simply **reference the namespace and declare an instance of my ViewModel inside my design time data file**. This is only a section of the file but you should check that I’ve *set MainFilter Property to the value “value of the filter”, with xaml syntax* (it is a standard property of the RawLoggerViewModelClass). Since you are declaring an instance of a real class, Visual Studio has intellisense thus simplifying a lot the construction of Design Time Data.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2012/10/image_thumb4.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2012/10/image4.png)

 ***Figure 2***: *You have full intellisense to create class*

 **This technique permits you to simply create an instance of your view model and populate its properties with data that will be available during design time**. Now it is time to instruct the designer that you want to use this specific design time data instance, and this is simply accomplished in the declaration of the Window

{{< highlight xml "linenos=table,linenostart=1" >}}


ow x:Class="LogVisualizer.Views.RawLoggerView"
        xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
        xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml" 
    xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006" 
        xmlns:kissMvvm="clr-namespace:LogVisualizer.KissMvvm"
        xmlns:d="http://schemas.microsoft.com/expression/blend/2008"
        mc:Ignorable="d"
        d:DataContext="{d:DesignData /DesignTimeData/RawLoggerViewModelSampleData.xaml}"

{{< / highlight >}}

This will  **instruct the designer to use the instance declared in the Design Time data file as the data context of the entire window during design time** and this will give you some interesting advantages.

The very first advantage of this approach is the ability to select a control, es a TextBox, then click on the little square pointed by the arrow in Figure 3 and choose to data Bind a property to the ViewModel. In figure 3 I’m going to bind the Text Property.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2012/10/image_thumb5.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2012/10/image5.png)

 ***Figure 3***: *Bind a property (in this exampe Text) to a property of the View Model.*

This will open a window that permits you to browse all properties of the View Model (Figure 4), and you can choose the property you want bind to the control property.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2012/10/image_thumb6.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2012/10/image6.png)

 ***Figure 4***: *Choose the View Model’s property to use for binding*

After you choose the value, you can immediately see the result on the designer.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2012/10/image_thumb7.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2012/10/image7.png)

 ***Figure 5***: *Design time data are immediately shown in the designer*

This approach gives you some advantages

- Less risk of mistyping name of the property entering the Binding syntax in the XAML designer by hand
- Gives you a visual list of all View Model properties that are available for binding
- Gives you visual feeling of the result of the binding

If you are interested on really advanced technique on binding in WPF I strongly suggest you to check [this series of posts of my friend Mauro](http://milestone.topics.it/2012/10/xaml-design-time-data-radicaldesign_19.html), where he is showing a really cool and advanced technique to deal with Design Time Data.

Alk.
