---
title: "WPF binding capabilities always surprised me"
description: ""
date: 2011-02-16T11:00:37+02:00
draft: false
tags: [WPF]
categories: [WPF]
---
WPF has really powerful binding feature and sometimes can save you a lot of time. I have a project where the DAL returned me a series of object properties in Dictionary&lt;String,String&gt; objects, and in a MVVM world I should create a suitable UI object with a  property for each dictionary entry, to implement INotifyPropertyChanged etc etc.

But since data does not change outside of the ui, I really do not need to implement the notification, and since the dictionary has a lot of elements (&gt; 30) writing the ui objects will be really annoying. The solution is really simple, you can bind directly to a DictionaryProperty.

Suppose you have this class called Data

{{< highlight csharp "linenos=table,linenostart=1" >}}
class Data
{
public Data()
{
Values = new Dictionary<string, string>();
Objects = new Dictionary<string, Data2>();
}
 
public Dictionary<String,String> Values { get; set; }
 
public Dictionary<String, Data2> Objects { get; set; }
}
 
class Data2
{
public String Prop { get; set; }
public String OtherProp { get; set; }
 
public Data2(string prop, string otherProp)
{
Prop = prop;
OtherProp = otherProp;
}
}
{{< / highlight >}}

IT has a dictionary&lt;String, STring&gt; and another one with a complex object as value, now suppose this is the Datacontext of a View

{{< highlight csharp "linenos=table,linenostart=1" >}}
public MainWindow()
{
InitializeComponent();
Data data = new Data();
data.Values.Add("TEST", "value for test");
data.Values.Add("TEST3", "value for test3");
data.Objects.Add("obj1", new Data2("prop", "otherprop"));
data.Objects.Add("obj2", new Data2("PROP", "OTHERPROP"));
DataContext = new BetterDataContext(data.Values, data.Objects);
}
{{< / highlight >}}

you can write this XAML.

{{< highlight csharp "linenos=table,linenostart=1" >}}
<TextBlock Text="{Binding Values[TEST]}" />
<TextBlock Text="{Binding Values[TEST3]}" />
 
<TextBlock Text="{Binding Objects[obj1].Prop}" />
<TextBlock Text="{Binding Objects[obj1].OtherProp}" />
 
<TextBlock Text="{Binding Objects[obj2].Prop}" />
<TextBlock Text="{Binding Objects[obj2].OtherProp}" />
 
<TextBox Text="{Binding Values[TEST]}" />
<TextBox Text="{Binding Values[TEST3]}" />
 
<TextBox Text="{Binding Objects[obj1].Prop}" />
<TextBox Text="{Binding Objects[obj1].OtherProp}" />
 
<TextBox Text="{Binding Objects[obj2].Prop}" />
<TextBox Text="{Binding Objects[obj2].OtherProp}" />
{{< / highlight >}}

I bound textbox and simple Textblock to the dictionary, and here is the result.

[![SNAGHTMLee0e56](https://www.codewrecks.com/blog/wp-content/uploads/2011/02/SNAGHTMLee0e56_thumb.png "SNAGHTMLee0e56")](https://www.codewrecks.com/blog/wp-content/uploads/2011/02/SNAGHTMLee0e56.png)

This is really cool, I'm able to bind to a dictionary, and if the value of the dictionary is a complex object, changing the value of a property gets immediately reflected in other controls bound to the same property, clearly, objects bound to a String value, could not benefit of this feature, and if you change the value in the textbox, Changes in data are not reflected to other control.

Alk.
