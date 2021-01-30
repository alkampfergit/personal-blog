---
title: "First steps on WPF listview with template based on data"
description: ""
date: 2008-03-26T11:00:37+02:00
draft: false
tags: [WPF]
categories: [WPF]
---
I’m moving the first serious steps on WPF trying to apply in real situation, the feeling is really good, and databinding and trigger are really exceptional. Suppose you have such a class

{{< highlight chsarp "linenos=table,linenostart=1" >}}
public class DataItem {
    public String Name { get; set; }
    public Boolean IsTrue { get; set; }
}{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

Then you have a list of such objects, you bind them to DataContext of a list view and write this XAML

{{< highlight xml "linenos=table,linenostart=1" >}}
        <ListView x:Name="listView1" HorizontalContentAlignment="Stretch" ItemsSource="{Binding}">
            <ListView.Background>
                <LinearGradientBrush StartPoint="0,0" EndPoint="1,0" >
                    <GradientStop Offset="0" Color="White" />
                    <GradientStop Offset="1" Color="Yellow" />
                </LinearGradientBrush>
            </ListView.Background>

            <ListView.View>
                <GridView>
                    <GridViewColumn Header="Active" DisplayMemberBinding="{Binding Path=IsTrue}"/>
                    <GridViewColumn Header="Name" DisplayMemberBinding="{Binding Path=Name}" Width="100"/>
                </GridView>
            </ListView.View>
        </ListView>{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

With this really simple code you have this result.

[![image](http://www.nablasoft.com/Alkampfer/wp-content/uploads/2008/03/image-thumb4.png)](http://www.nablasoft.com/Alkampfer/wp-content/uploads/2008/03/image4.png)

Ok, this is not so exiting, to make things really more interesting I created a directory called Images, dropped two png and included as resources into the project. Now I want to display images based on value of the IsActive property of the data. This is simple in WPF, the solution is create a static resource of the window

{{< highlight xml "linenos=table,linenostart=1" >}}
 <Window.Resources>
        <DataTemplate x:Key="image">
            <Image x:Name="TheImage" />
            <DataTemplate.Triggers>
                <DataTrigger Binding="{Binding Path=IsTrue}" Value="true">
                    <Setter TargetName="TheImage" Property="Source" Value="Images/Computer.png" />
                </DataTrigger>
                <DataTrigger Binding="{Binding Path=IsTrue}" Value="false">
                    <Setter TargetName="TheImage" Property="Source" Value="Images/error.png" />
                </DataTrigger>
            </DataTemplate.Triggers>
        </DataTemplate>
    </Window.Resources>{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

The XAML is really simple, I declare a DataTemplate object with a key of “image”, this template contains a simple ImageControl, then I define a couple of triggers to change the property  **Source** of the Image based on the value of the object bound to the DataTemplate. Now you can use this static resources directly in your listview

{{< highlight xml "linenos=table,linenostart=1" >}}
            <ListView.View>
                <GridView>
                    <GridViewColumn Header="Active" CellTemplate="{StaticResource image}" />
                    <GridViewColumn Header="Active" DisplayMemberBinding="{Binding Path=IsTrue}"/>
                    <GridViewColumn Header="Name" DisplayMemberBinding="{Binding Path=Name}" Width="100"/>
                </GridView>
            </ListView.View>{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

As you can see I simply declare that the CellTemplate of the first column of the grid is the static resource defined in the windows. Thanks to the triggers here is the result.

[![image](http://www.nablasoft.com/Alkampfer/wp-content/uploads/2008/03/image-thumb5.png)](http://www.nablasoft.com/Alkampfer/wp-content/uploads/2008/03/image5.png)

This is really better than before, and without writing a single line of code.

Alk.

Technorati Tags: [WPF](http://technorati.com/tags/WPF),[Dynamic Binding](http://technorati.com/tags/Dynamic%20Binding)
