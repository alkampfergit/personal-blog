---
title: "WPF and Dependency property default objects"
description: ""
date: 2010-04-29T13:00:37+02:00
draft: false
tags: [WPF]
categories: [WPF]
---
WPF is a completely new stuff respect to winform, and sometimes you can get surprised by its behaviour. Today I had a bug in a simple application, it seems that closing and opening a form, data is persisted between instances, and it seems that a dependency property is behaving like static variable. This is the situation exposed in simple way, take a parameter filter object like this

{{< highlight csharp "linenos=table,linenostart=1" >}}
public class Filters
{
public String Name { get; set; }
public String Surname { get; set; }
}
{{< / highlight >}}

Simple class with two properties, then create a wpf windows with this simple code behind.

{{< highlight csharp "linenos=table,linenostart=1" >}}
public partial class FilterPage : Window
{
public FilterPage()
{
InitializeComponent();
}
 
public Filters Filters
{
get { return (Filters)GetValue(FiltersProperty); }
set { SetValue(FiltersProperty, value); }
}
 
// Using a DependencyProperty as the backing store for Filters.  This enables animation, styling, binding, etc...
public static readonly DependencyProperty FiltersProperty =
DependencyProperty.Register(
"Filters",
typeof(Filters),
typeof(MainWindow),
new UIPropertyMetadata(new Filters()));
}
{{< / highlight >}}

In the real situation we have a MVVM pattern where the MV descend from ContentElement and can declare dependency properties. The XAML of the windows is this one.

{{< highlight csharp "linenos=table,linenostart=1" >}}
<Window x:Class="testWPF.FilterPage"
xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
Title="FilterPage" Height="300" Width="300" x:Name="this">
<StackPanel>
<TextBox Text="{Binding ElementName=this,Path=Filters.Name}"/>
<TextBox Text="{Binding ElementName=this,Path=Filters.Surname}"/>
</StackPanel>
</Window>
{{< / highlight >}}

Where you have two textbox simply binding to the dependency property, now create a windows, type something inside one of the textbox, then close it,then reopen it and you will find that the original value is still there. It seems that the value stored in the dependency property is static, and this is really true because you are using  **the default value of the property**.

A DependencyProperty is made by a static definition and a run time behavior that permits to set and get it from an object, but do not forget that the declaration of the DP is  **static** and this means that the default value you pass with the  **UIPropertyMetadata** object  **is static too**. This means that the default value of a DP is shared between all instances of the object that uses it and the above code is wrong because the form is using the default value of the DP to bind to textbox. To make this work as you can expect, you need to assign a valid Filters object in the constructor of the windows avoiding to use the shared default instance.

{{< highlight csharp "linenos=table,linenostart=1" >}}
public FilterPage()
{
Filters = new Filters();
InitializeComponent();
}
{{< / highlight >}}

Now everything works as expected.

Alk.
