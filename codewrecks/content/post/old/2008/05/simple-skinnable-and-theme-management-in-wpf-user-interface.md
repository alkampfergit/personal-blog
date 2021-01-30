---
title: "Simple skinnable and Theme management in WPF user interface"
description: ""
date: 2008-05-22T03:00:37+02:00
draft: false
tags: [Uncategorized]
categories: [General]
---
A skinnable interface is the gotha of the user interface, the developer use standard control and set the behaviour, the designer skin it with some tool and creates a beautiful user interface. In WPF this is possible thanks to XAML and styles, but it is possible to simple include in an application a series of skin and load at runtime??. The answer is Yes, it is possible.

Let’s Start with a simple page with a combo and a textblock

{{< highlight xml "linenos=table,linenostart=1" >}}
<Window.Resources>
        <ResourceDictionary>
            <ResourceDictionary.MergedDictionaries>
                <ResourceDictionary Source="Themes/Main.xaml" />
            </ResourceDictionary.MergedDictionaries>
        </ResourceDictionary>
    </Window.Resources>
    <StackPanel Orientation="Vertical">
        <ComboBox Height="23" Name="cmbStyle" VerticalAlignment="Top" HorizontalAlignment="Left" Width="120" DisplayMemberPath="ThemeName"
                     SelectionChanged="cmbStyle_SelectionChanged"/>
        <TextBlock Height="37" HorizontalAlignment="Left" Name="textBlock1" VerticalAlignment="Top" 
                  Style="{DynamicResource StdText}">
            This is a simple skinnable text
        </TextBlock>
    </StackPanel>{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

The key part is that the resources are defined in an external resource file (A dictionary of resources), placed in Themes/Main.xaml, and the textblock simply declare that his Style is equal to a DynamicResource called StdText, that resource is in the external file, here is the full listing of Themes/Main.xaml

{{< highlight xml "linenos=table,linenostart=1" >}}
<ResourceDictionary xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
    xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml">
    <Style x:Key="StdText">
    </Style>

</ResourceDictionary>{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

Nothing special, the style is empty :D, now look at the structure of the project

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2008/05/image-thumb7.png)](https://www.codewrecks.com/blog/wp-content/uploads/2008/05/image7.png)

The project include some subfolder of the Themes directory, all these directory contains a file called Main.xaml, and in these files I store the style for the theme, here is an example of the Themes/Green/Main.xaml file

{{< highlight xml "linenos=table,linenostart=1" >}}
<ResourceDictionary xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
    xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml">
    <Style x:Key="StdText">
        <Setter Property="Control.FontSize" Value="22" />
        <Setter Property="Control.FontWeight" Value="Normal" />
        <Setter Property="Control.Foreground" Value="Green" />
        <Setter Property="Control.FontFamily" Value="Arial" />
    </Style>
</ResourceDictionary>{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

Ok this is nothing special, I simply set the font to green foreground and changes other properties. Thanks to the WPF concept of Style, I can change really every property of the text object. All these themes files are not included in the compilation, build action is set to *none* and I simply tells the compiler to copy to output directory if the file are changed. Now here is the code in the main program that scans Themes directory to find all subdirectories that contains a file called Main.xaml.

{{< highlight sql "linenos=table,linenostart=1" >}}
cmbStyle.ItemsSource =
    from dir in System.IO.Directory.GetDirectories("Themes")
    where System.IO.File.Exists(Path.Combine(dir, "Main.Xaml"))
    select new ThemeData()
               {
                   ThemeName = Path.GetFileName(dir), 
                    ThemeFile=Path.Combine(dir, "Main.Xaml")
    };{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

Well, a simple linq query permits me to scan all subdirectory of Themes, takes only the subdirectory that contain a Main.xaml File. All the result are stored in a simple class called ThemeData that contains the theme name (the name of the subdirectory) and the file name. Now here is the code to handle change of selection in the combobox, where I set the new theme

{{< highlight CSharp "linenos=table,linenostart=1" >}}
private void cmbStyle_SelectionChanged(object sender, SelectionChangedEventArgs e)
{
    if (cmbStyle.SelectedIndex == -1) return;
    using (FileStream fs = new FileStream(((ThemeData) cmbStyle.SelectedValue).ThemeFile, FileMode.Open))
    {
        ResourceDictionary dic = (ResourceDictionary)XamlReader.Load(fs);
        Resources.MergedDictionaries.Clear();
        Resources.MergedDictionaries.Add(dic);
    }
}{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

Really simple, I load the file in a stream, deserialize with XamlReader, and substitute to the original dictionary. Here is the result

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2008/05/image-thumb8.png)](https://www.codewrecks.com/blog/wp-content/uploads/2008/05/image8.png)

The combo automatically enlists all subdirectories that contain a main.xaml file, if you change the theme

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2008/05/image-thumb9.png)](https://www.codewrecks.com/blog/wp-content/uploads/2008/05/image9.png)

Et voilÃ , the theme is changed ;). If you like it, you can close visual studio, go to the debug directory and manually create another theme, run the program again  **without recompiling** and the new theme is already active (because it is selected runtime). This permits a user to change the appearance of the program once the program is deployed.

Alk.

Tags: [WPF](http://technorati.com/tag/WPF) [Skin](http://technorati.com/tag/Skin) [Themes](http://technorati.com/tag/Themes)

<!--dotnetkickit-->
