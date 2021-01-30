---
title: "Loading dictionary of resources runtime in WPF"
description: ""
date: 2008-05-18T02:00:37+02:00
draft: false
tags: [Uncategorized]
categories: [General]
---
This morning I had a little task, I’going to a Customer to install a simple WPF application in a touch screen. The problem is: I do not know how the customer want to format the form: font, color and so on. The problem is that I do not want to setup a procedural code to change these setting runtime, I only want to change the first time, then all goes on forever with that settings.

First of all I define a MainResources.xaml file with this content

{{< highlight xml "linenos=table,linenostart=1" >}}
 1 <ResourceDictionary xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
 2     xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
 3     xmlns:UILogic="clr-namespace:Proximo.Planner.Gui.Presentation.UILogic;assembly=Proximo.Planner.Gui">
 4     <Style x:Key="StdText"> 
 5         <Setter Property="Control.FontSize" Value="30" />
 6         <Setter Property="Control.FontWeight" Value="Normal" />
 7         <Setter Property="Control.Foreground" Value="White" />
 8         <Setter Property="Control.FontFamily" Value="Arial" />
 9     </Style>
10     <Style x:Key="AltBackground" TargetType="{x:Type ListViewItem}">
11         <Setter Property="Background">
12             <Setter.Value>
13                 <Binding RelativeSource="{RelativeSource Self}">
14                     <Binding.Converter>
15                         <UILogic:BackgroundConverter EvenBrush="Black" OddBrush="DarkGray" />
16                     </Binding.Converter>
17                 </Binding>
18             </Setter.Value>
19         </Setter>
20     </Style>
21 </ResourceDictionary>{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

As you can see this is an extract of the actual file, the important things are

1) all the formatting are defined with style

2) Look at line 3, since I use a custom IValueConverter I need to import the UILogic namespace specifying the assembly, we will see shortly why the standard declaration is not good.

Now all the windows imports this dictionary

{{< highlight xml "linenos=table,linenostart=1" >}}
<Window.Resources>
    <ResourceDictionary>
        <ResourceDictionary.MergedDictionaries>
            <ResourceDictionary Source="MainResources.xaml" />
        </ResourceDictionary.MergedDictionaries> 
    </ResourceDictionary>
</Window.Resources>{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

This way to proceed has a big problem, the resources are compiled into the assembly, so if I want to change the style I need to change MainResources.xaml, recompile the application, and then redeploy in the customer computer….this sounds to me too work, especially if the customer want to do some variation, “font yellow, no better white, font 22 no better 24, lets try 28, no….it is better 22…..” can you imagine the frustration if I need to recompile for each little variation?

The solution is to load the dictionary runtime, here is why in the line 3 I need to specify the assembly  *xmlns:UILogic=”clr-namespace:Proximo.Planner.Gui.Presentation.UILogic; assembly=Proximo.Planner.Gui”*because with dynamic loading the loader needs to know the assembly where my custom converter live in. Here is the code to load this file at RunTime

{{< highlight csharp "linenos=table,linenostart=1" >}}
using (FileStream fs = new FileStream("MainResources.xaml", FileMode.Open))
{
    ResourceDictionary dic = (ResourceDictionary) XamlReader.Load(fs);
    Resources.MergedDictionaries.Clear();
    Resources.MergedDictionaries.Add(dic);
}{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

Wow…really simple isnt it? I simply use  **XamlReader.Load()** method to load and compile XAML file at runtime, then I casted to ResourceDictionary, the root object of the XAML, then I simply replaced MergedDictionaries of the main Resources object.

Alk.

Tags:

Tags: [WPF](http://technorati.com/tag/WPF) [XamlReader](http://technorati.com/tag/XamlReader) [Runtime Style](http://technorati.com/tag/Runtime%20Style)

<!--dotnetkickit-->
