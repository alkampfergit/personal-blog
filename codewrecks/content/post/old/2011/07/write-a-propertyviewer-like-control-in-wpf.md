---
title: "Write a PropertyViewer like control in WPF"
description: ""
date: 2011-07-14T07:00:37+02:00
draft: false
tags: [WPF]
categories: [WPF]
---
In WPF there is no [PropertyViewer](http://msdn.microsoft.com/en-us/library/microsoft.sqlserver.management.controls.propertyviewer.aspx) control, but if your need is simply to show a read-only list of all properties of an object, for dump purpose, you can obtain this with few lines of code. First of all write a special IValueConverter.

{{< highlight csharp "linenos=table,linenostart=1" >}}
[ValueConversion(typeof(Object), typeof(ObservableCollection<PropertyInfo>))]
public class PropertyViewerConverter : IValueConverter
{
public class PropertyInfo
{
public String PropertyName { get; private set; }
 
public String PropertyValue { get; private set; }
 
public PropertyInfo(string propertyName, string propertyValue)
{
PropertyName = propertyName;
PropertyValue = propertyValue;
}
}
 
public object Convert(object value, Type targetType, object parameter, System.Globalization.CultureInfo culture)
{
var retvalue = new ObservableCollection<PropertyInfo>();
if (value != null)
{
var properties = value.GetType().GetProperties(BindingFlags.Public | BindingFlags.Instance);
foreach (var propertyInfo in properties)
{ PropertyInfo info;
try
{
object pvalue = propertyInfo.GetValue(value, new object[] { }) ?? "Null";
info = new PropertyInfo(propertyInfo.Name, pvalue.ToString());
}
catch (Exception ex)
{
 
info = new PropertyInfo(propertyInfo.Name, "Exception " + ex.Message);
}
retvalue.Add(info);
}
}
return retvalue;
}
 
public object ConvertBack(object value, Type targetType, object parameter, System.Globalization.CultureInfo culture)
{
throw new NotImplementedException();
}
}
{{< / highlight >}}

The code is straightforward, the converter accepts an object and return an ObservableCollection of PropertyInfo, where propertyinfo is a simple class declared in the converter to hold name and value of the property. You can use this converter in a really simple way.

{{< highlight csharp "linenos=table,linenostart=1" >}}
<ListView ItemsSource="{Binding SearchParam, Converter={StaticResource pvc}}">
<ListView.ItemTemplate>
<DataTemplate>
<StackPanel Orientation="Horizontal" >
<Label Content="{Binding PropertyName}" Width="200"/>
<Label Content="{Binding PropertyValue}" />
</StackPanel>
</DataTemplate>
</ListView.ItemTemplate>
</ListView>
{{< / highlight >}}

In the above code I used a Listview bound to a property of the viewmodel called SearchParam that is a complex object with many properties, and thanks to the Converter Iâ€™m able to obtain a list of propertyname-propertyvalue that I can show simply with two labels.

Clearly if you need a real property editor you can check [Wpf Property Grid control](http://wpfpropertygrid.codeplex.com/), or [WPF property grid](http://wpg.codeplex.com/), both of them are open source.

Alk.

Tags: [Wpf](http://technorati.com/tag/Wpf)
