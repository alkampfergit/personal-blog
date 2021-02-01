---
title: "WPF and wrapping text inside elements of a ListView"
description: ""
date: 2008-11-08T01:00:37+02:00
draft: false
tags: [WPF]
categories: [WPF]
---
TextBlock have the possibility to wrap, but sometimes you can get surprised by its behaviour. When I first began to work in WPF I started to use ListView to show complex object, because of the rich possibility to format the output with great flexibility. One day I created this little listview.

{{< highlight xml "linenos=table,linenostart=1" >}}
<ListView x:Name="GroupsView" ItemsSource="{Binding}" >
    <ListView.ItemTemplate>
        <DataTemplate>
            <StackPanel Orientation="Horizontal">
                <TextBlock  TextWrapping="Wrap" Margin="2,0,2,0" Text="{Binding Path=LogIdentifier}" VerticalAlignment="Center"  FontSize="14"  />
                <TextBlock Margin="2,0,2,0" Text="Count:" FontWeight="Bold" VerticalAlignment="Center" FontSize="14" />
                <TextBlock Margin="2,0,2,0" Text="{Binding Path=Messages.Count}" VerticalAlignment="Center"  FontSize="14" />
            </StackPanel>
        </DataTemplate>
    </ListView.ItemTemplate>
</ListView>{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

It is a simple list and each element is composed by three textblock, the first should be the long one and I want it to wrap when the form is resized, the other two are small and should stay to the right. When I launched the form the result is not the desidered one, the first text does not wrap , nor the Count: is aligned to the right. The first error is that you should use DockPanel when you want elements to stay somewhere (right in this situation) and you want one of the element to fill remaining space, then I moved to this solution.

{{< highlight xml "linenos=table,linenostart=1" >}}
<ListView x:Name="GroupsView" ItemsSource="{Binding}" >
    <ListView.ItemTemplate>
        <DataTemplate>
            <DockPanel >
                <TextBlock  TextWrapping="Wrap" Margin="2,0,2,0" Text="{Binding Path=LogIdentifier}" VerticalAlignment="Center"  FontSize="14"  />
                <TextBlock DockPanel.Dock="Right" Margin="2,0,2,0" Text="Count:" FontWeight="Bold" VerticalAlignment="Center" FontSize="14" />
                <TextBlock DockPanel.Dock="Right" Margin="2,0,2,0" Text="{Binding Path=Messages.Count}" VerticalAlignment="Center"  FontSize="14" />
            </DockPanel>
        </DataTemplate>
    </ListView.ItemTemplate>
</ListView>{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

You can be still surprised that the result is not the desidered one, the first textblock does not gets wrapped, and â€œcount: Xâ€ text is still not aligned to the right. To understand why the layout is arranged in such a way you should consider how the various container constrain dimension for their content. In [this post](http://social.msdn.microsoft.com/Forums/en-US/wpf/thread/d4bf491c-bd72-4bad-8dc1-57dbb2e6ad24/) you can find a good description. We have to face two problems, the first is that we want the content of our ListView to have X size equal to that of the listview itself, this can be accomplished with  **HorizontalContentAlignment="Stretch"** attribute, that instructs the ListView to stretch the X size of its content on the horizontal size of the list itself. Then you should instruct the ListView not to show horizontal scrollbar. When scrollbar are enabled the listview grabs the â€œdesidered sizeâ€ of the controls, then it renders scrollbars accordingly, thus avoiding the word wrapping. To disable scrollbar you can simply use the attribute  **ScrollViewer.HorizontalScrollBarVisibility="Disabled"**. Finally you should notice that the order of the elements in the DockPanel is wrong. The dockPanel starts aligning from the first control to the last, and if the last has no DockPanel.Dock specified it is considered to fill remaining space. I need to work from right to left, first element is the number of count, then the Count: string, both with right alignment, finally the text that I wanted to wrap with no Dock specified.

{{< highlight xml "linenos=table,linenostart=1" >}}
<ListView x:Name="GroupsView" ItemsSource="{Binding}" 
         HorizontalContentAlignment="Stretch"
         ScrollViewer.HorizontalScrollBarVisibility="Disabled">
    <ListView.ItemTemplate>
        <DataTemplate>
            <DockPanel >
                <TextBlock DockPanel.Dock="Right" Margin="2,0,2,0" Text="{Binding Path=Messages.Count}" VerticalAlignment="Center" HorizontalAlignment="Right"  FontSize="14" />
                <TextBlock DockPanel.Dock="Right" Margin="2,0,2,0" Text="Count:" FontWeight="Bold" VerticalAlignment="Center" HorizontalAlignment="Right" FontSize="14" />
                <TextBlock TextWrapping="WrapWithOverflow" Margin="2,0,2,0" Text="{Binding Path=LogIdentifier}" VerticalAlignment="Center"  FontSize="14"  />
            </DockPanel>
        </DataTemplate>
    </ListView.ItemTemplate>
</ListView>{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

Finally I got what I wanted.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2008/11/image-thumb5.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2008/11/image5.png)

I'm doing this post because this morning I woke up early, and wrote again the same wrong XAML (errare umanum est â€¦), when I launch the application I though â€œmmm I solved this long time agoâ€¦â€ and begin crawling in my projects, then I preferred to do a post, so the next time I can search in my blog. :D

Alk.

Tags: [WPF](http://technorati.com/tag/WPF) [.NET Framework](http://technorati.com/tag/.NET%20Framework)

<script type="text/javascript">var dzone_url = 'http://www.codewrecks.com/blog/index.php/2008/11/08/wpf-and-wrapping-text-inside-elements-of-a-listview/';</script><script type="text/javascript">var dzone_title = 'WPF and wrapping text inside elements of a ListView';</script><script type="text/javascript">var dzone_blurb = 'WPF and wrapping text inside elements of a ListView';</script><script type="text/javascript">var dzone_style = '2';</script><script language="javascript" src="http://widgets.dzone.com/widgets/zoneit.js"></script> 

[![DotNetKicks Image](http://www.dotnetkicks.com/Services/Images/KickItImageGenerator.ashx?url=http://www.codewrecks.com/blog/index.php/2008/11/08/wpf-and-wrapping-text-inside-elements-of-a-listview/&amp;bgcolor=0080C0&amp;fgcolor=FFFFFF&amp;border=000000&amp;cbgcolor=D4E1ED&amp;cfgcolor=000000)](http://www.dotnetkicks.com/kick/?url=http://www.codewrecks.com/blog/index.php/2008/11/08/wpf-and-wrapping-text-inside-elements-of-a-listview/)
