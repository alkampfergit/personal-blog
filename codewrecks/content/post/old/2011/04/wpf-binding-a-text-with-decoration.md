---
title: "WPF binding a text with decoration"
description: ""
date: 2011-04-19T13:00:37+02:00
draft: false
tags: [WPF,XAML]
categories: [WPF]
---
Suppose you need to show some decorated text in a MVVM WPF application, something like

2,  **9** , <strike>16 </strike>Dicembre 2011

And all the decorations are inserted by some business logic, for example bold if a value is greater than X, strikethrough if the value is less than Y, or similar logic. I want the interface as clean as possible, and moreover I do not know in advance how many numbers will be in the string.

A possible solution is using a [flowDocument capable to show HTML content](http://www.codewrecks.com/blog/index.php/2011/03/23/a-tale-of-wpf-flowdocument-html-and-more/) based on the the [Html to Xaml converter](http://msdn.microsoft.com/en-us/library/aa972129.aspx) that permits me to create a little HTML string in the VM that can be displayed on the UI with a simple control. The original Html2Xaml converter do not support the strikethrough, but it is really simple to modify it to support this kind of decoration.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2011/04/image_thumb8.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2011/04/image8.png)

 ***Figure 1***: *How to detect striketrhough HTML tag in the converter.*

Simply locate where it check for bold tag and add support for s and strike tag. Now add another case in the section where the formattings of the new XAML tag are applied.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2011/04/image_thumb9.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2011/04/image9.png)

 ***Figure 2***: *Add formatting to the new XAML element created.*

Do not forget to add a constant for the XAML style

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2011/04/image_thumb10.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2011/04/image10.png)

 ***Figure 3***: *Constants for XAML element formatting.*

Now I can simply bind on the right VM property

{{< highlight csharp "linenos=table,linenostart=1" >}}
<Controls:HtmlComposableFlowDocument Grid.Row="4" Grid.Column="1"
VerticalScrollBarVisibility="Disabled" Margin="-13,-13,0,0"
HtmlDocument="{Binding property}">
{{< / highlight >}}

I can test the VM for rendering the right HTML fragment (passing to VM test data and check the HTML property), and I can also immediately verify the result on the designer.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2011/04/image_thumb11.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2011/04/image11.png)

As you can verify using a flowDocument to show formatted text is really simple and avoid the need to use multiple XAML controls bound to different properties.

alk.
