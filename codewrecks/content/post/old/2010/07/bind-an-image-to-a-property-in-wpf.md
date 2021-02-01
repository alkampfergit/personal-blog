---
title: "Bind an Image to a property in WPF"
description: ""
date: 2010-07-23T11:00:37+02:00
draft: false
tags: [WPF,XAML]
categories: [WPF]
---
The situation is the following: I have a class that has a Status property of type SingleAnalysisStatus enum, and I want to show a different png image, based on the status of the object.

The solution is to write a custom [IValueConverter](http://msdn.microsoft.com/en-us/library/system.windows.data.ivalueconverter.aspx) that convert from the enum to a valid resource file, but we need to pay specific attention. In WPF you can include images as resources in a very simple way, just include the images in the project and set the â€œbuild Actionâ€ to Resource, as shown in  **Figure 1**.

[![Untitled](https://www.codewrecks.com/blog/wp-content/uploads/2010/07/Untitled_thumb8.png "Untitled")](https://www.codewrecks.com/blog/wp-content/uploads/2010/07/Untitled10.png)

 ***Figure 1***: *include an image file as resource in a WPF application*

In this way you can simply use this syntax to assign a resource image to an object of type Image

{{< highlight csharp "linenos=table,linenostart=1" >}}
<Image
HorizontalAlignment="Left"
Height="100"
Width="100"
Source="/Images/NotMatch.png"/>
{{< / highlight >}}

You can simply specify the path of the image in the Source property of an Image Element, but to show a different image depending on the value of an enum requires a specific ValueConverter, and you need to be aware that this converter need to convert from the original type to a BitmapImage object, because the Source property of an &lt;image&gt; will not accepts string during binding. Here is how you can accomplish this.

{{< highlight csharp "linenos=table,linenostart=1" >}}
<Window.Resources>
<Converter:SingleAnalysisStatusConverter x:Key="statusconverter" />
<DataTemplate x:Key="ItemTemplate">
<DockPanel>
<Image HorizontalAlignment="Right" Height="24" Margin="0"
Source="{Binding Status, Converter={StaticResource statusconverter}}"
VerticalAlignment="Bottom" Width="24" Stretch="Fill" />
{{< / highlight >}}

In this snippet of code I'm showing how to bind the Source property of an Image to the Status property of the underling ViewModel, and thanks to the SingleAnalysisStatusConverter object I'm able to convert the status to a valid [BitmapImage](http://msdn.microsoft.com/en-us/library/system.windows.media.imaging.bitmapimage.aspx) object. This is the full code of the IValueConverter object.

{{< highlight csharp "linenos=table,linenostart=1" >}}
class SingleAnalysisStatusConverter: IValueConverter
{
#region IValueConverter Members
 
public object Convert(object value, Type targetType, object parameter, System.Globalization.CultureInfo culture)
{
if (!(value is SingleAnalysisStatus))
throw new NotImplementedException("SingleAnalysisStatusConverter can only convert from SingleAnalysisStatus");
 
String path = null;
switch ((SingleAnalysisStatus ) value)
{
case SingleAnalysisStatus.NotAnalyzed:
path = "Images/NotAnalyzed.png";
break;
case SingleAnalysisStatus.DuringAnalysis:
path = "Images/DuringAnalysis.png";
break;
case SingleAnalysisStatus.Match:
path = "Images/Match.png";
break;
case SingleAnalysisStatus.NotMatch:
path = "Images/NotMatch.png";
break;
case SingleAnalysisStatus.ErrorDownload:
path = "Images/DownloadError.png";
break;
default :
throw new NotSupportedException();
}
return new BitmapImage(new Uri("/AssemblyName;component/" + path, UriKind.Relative));
}
 
public object ConvertBack(object value, Type targetType, object parameter, System.Globalization.CultureInfo culture)
{
throw new NotImplementedException();
}
 
#endregion
 
}
{{< / highlight >}}

The key part is the line

*return new BitmapImage(new Uri("/AssemblyName;component/" + path, UriKind.Relative));*

that creates the BitmapImage passing an uri composed by the: assemblyname + semicolon + component/ + imagepath. With this simple converter I'm able to show different images based on content of a specific property.

Alk.
