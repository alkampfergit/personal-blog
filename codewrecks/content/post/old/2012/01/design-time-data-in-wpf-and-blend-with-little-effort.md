---
title: "Design time data in WPF and Blend with little effort"
description: ""
date: 2012-01-20T18:00:37+02:00
draft: false
tags: [Blend,WPF]
categories: [WPF]
---
The power of WPF binding really shines when you use design time data to have a live preview of the aspect of your UI without the need to press F5 to load actual data. Design time data is a cool feature you can have with little effort, suppose you have a simple windows and you want to show a list of customers, taken from the northwind datadabase inside a Listbox, personlizing the DataTemplate.

I start with  simple ViewModelBase, that is really far to be a real Base View Model to implement a full MVVM solution, but it serves me to show how to use design time data without scare people telling them to implement complex patterns or similar stuff.

{{< highlight csharp "linenos=table,linenostart=1" >}}
public abstract class ViewModelBase : MarkupExtension, INotifyPropertyChanged
{
 
public event PropertyChangedEventHandler PropertyChanged;
 
protected virtual void OnPropertyChanged(String propertyName)
{
 
var temp = PropertyChanged;
if (temp != null)
{
temp(this, new PropertyChangedEventArgs(propertyName));
}
}
 
private DependencyObject syncRoot = new DependencyObject();
 
protected Boolean IsInDesignMode
{
get { return DesignerProperties.GetIsInDesignMode(syncRoot); }
}
{{< / highlight >}}

This is really simple base class that implements INotifyPropertyChanged and inherits from MarkupExtension, it has also an IsInDesign mode property to detect if the code is running inside a designer.

{{< highlight csharp "linenos=table,linenostart=1" >}}
protected abstract void CommonInit();
 
protected abstract void RuntimeInit();
 
protected abstract void DesignTimeInit();
 
protected ViewModelBase()
{
this.CommonInit();
if (!IsInDesignMode)
{
this.RuntimeInit();
}
}
 
public override object ProvideValue(IServiceProvider serviceProvider)
{
this.DesignTimeInit();
return this;
}
{{< / highlight >}}

Then I defined three abstract methods, the first is called CommonInit() and is used to do common initialization, then the RuntimeInit() is called to do all initialization I do not want to do when the viewmodel is used inside the designer, finally the DesignTimeInit() is called when the object is constructed inside the Designer. The trick is that the constructor call the RuntimeInit() only when we are outside the designer and the DesignTimeInit() is simply called inside the ProvideValue() virtual method of the base MarkupExtension class

Then I create a MainWindowViewModel inheriting from this class, add an ObservableCollection&lt;Customers&gt; to show data and implemented the initialization methods, the RuntimeInit() loads data from database.

{{< highlight csharp "linenos=table,linenostart=1" >}}
protected override void RuntimeInit()
{
using (NorthWind context = new NorthWind())
{
foreach (var customer in context.Customers)
{
LoadedCustomers.Add(customer);
}
}
}
{{< / highlight >}}

Then in the DesignTimeInit() I create some fake objects that will be used by the designer, you can do it simple using Fizzware NBuilder library.

{{< highlight csharp "linenos=table,linenostart=1" >}}
protected override void DesignTimeInit()
{
for (int i = 0; i < 10; i++)
{
Customers customerDummy = FizzWare.NBuilder.Builder<Customers>.CreateNew().Build();
LoadedCustomers.Add(customerDummy);
}
}
{{< / highlight >}}

Now I fire blend and open the solution, create a windows then add the design time data context to the first Grid control

{{< highlight csharp "linenos=table,linenostart=1" >}}
<Grid d:DataContext="{sampleproject:MainWindowViewModel}">
{{< / highlight >}}

This will call the ProvideValue of the MarkupExtension class, so the object will be constructed with some dummy design data, then I drop a ListBox inside the window and bind its ItemsSource property with designer

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2012/01/image_thumb3.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2012/01/image3.png)

 ***Figure 1***: *Bind with designer*

The cool part is that the designer correctly recognize the ViewModel inside the DataContext and shows me the list of properties that can be bound to the ItemsControl property. Now I right click the ListBox and ask blend to edit the ItemTemplate, then create a simple layout with a border and a 2×2 grid.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2012/01/image_thumb4.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2012/01/image4.png)

 ***Figure 2***: *The layout for the DataTemplate of the ListBox*

Now that I created the grid with four cells, I need to bind the label of the second column to the right properties of the Customers object, so I simply select the label, then ask to DataBind the Content:

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2012/01/image_thumb5.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2012/01/image5.png)

 ***Figure 3***: *Thanks to Design Time Data, blend designer can use reflection to understand the properties of the Customers Object, so we can easily choose the property to bind*

The cool part is that the interface in the designer immediately reflects the result with the Design Time Data

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2012/01/image_thumb6.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2012/01/image6.png)

 ***Figure 4***: *Designer uses design time data to render the interface directly inside the designer*

This is a killer feature because permits you to have a real look at how the UI will be rendered with data.

[Code sample is here](http://www.codewrecks.com/Files/DesignDataTemplate.zip).

Gian Maria
