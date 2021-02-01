---
title: "WPF Swap the entire content in a column based on content"
description: ""
date: 2008-03-27T11:00:37+02:00
draft: false
tags: [WPF]
categories: [WPF]
---
In [previous post](http://www.nablasoft.com/Alkampfer/?p=176), I demonstrated how to change the content of a grid based on the content of a property of bound object, now I want to take that example further. In the old example I change the source of an image, but now I want to set a complete different template based on content, to make this happens first of all you have to change the DataTemplate in ControlTemplate

{{< highlight xml "linenos=table,linenostart=1" >}}
    <Window.Resources>
        <ControlTemplate x:Key="Ct1">
            <Image x:Name="TheImage" Source="Images/error.png" />
        </ControlTemplate>
        <ControlTemplate x:Key="Ct2">
            <StackPanel>
                <TextBlock Text="Yes Is True!!" />
                <TextBlock Text="This is another different template!!" />
            </StackPanel>
        </ControlTemplate>
    </Window.Resources>{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

As you can see I create a template with an image, and another template with a complete different content, a stackpanel with two textblock. Now the interesting part is on the grid.

{{< highlight xml "linenos=table,linenostart=1" >}}
                <GridView x:Name="theGrid">
                    <GridViewColumn x:Name="firstCol" Header="Active" >
                        <GridViewColumn.CellTemplate>
                            <DataTemplate>
                                <Control x:Name="cnt" Template="{StaticResource Ct1}" />
                                <DataTemplate.Triggers>
                                    <DataTrigger Binding="{Binding Path=IsTrue}" Value="true">
                                        <Setter TargetName="cnt" Property="Template" Value="{StaticResource Ct2}" />
                                    </DataTrigger>
                                </DataTemplate.Triggers>
                            </DataTemplate>
                        </GridViewColumn.CellTemplate>

                    </GridViewColumn>
                    <GridViewColumn Header="Active" DisplayMemberBinding="{Binding Path=IsTrue}"/>
                    <GridViewColumn Header="Name" DisplayMemberBinding="{Binding Path=Name}" Width="100"/>{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

Since we want to change the content of the GridViewColumn we simply declare the DataTemplate inside a CellTemplate of the GridViewColumn object, here we drop a single control named *cnt*and with default Template of Ct1. Then we can insert a DataTemplate trigger to simply change the Template property of the control, actually swapping the template at runtime based on property of the bound object, here is the result.

[![image](http://www.nablasoft.com/Alkampfer/wp-content/uploads/2008/03/image-thumb6.png)](http://www.nablasoft.com/Alkampfer/wp-content/uploads/2008/03/image6.png)

You can now completely change the template based on object property.

Alk.
