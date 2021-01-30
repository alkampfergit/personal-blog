---
title: "Manipulate a FlowDocument in WPF"
description: ""
date: 2011-06-20T14:00:37+02:00
draft: false
tags: [WPF]
categories: [WPF]
---
[Sample Code is Here.](http://www.codewrecks.com/files/wpfflowdocument.zip)

This is the scenario: I have a [FlowDocument](http://msdn.microsoft.com/en-us/library/ms601064.aspx) in a FlowDocumentScrollViewer as in Figure 1.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2011/06/image_thumb20.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2011/06/image20.png)

 ***Figure 1***: *Initial scenario, a simple flow document.*

My goal is to be able to highlight some words in the document and show some detailed info about highlighted word to the user. It turns out after some experiments that the code is quite simple. In the first part of the snippet I search content inside the Paragraph.

{{< highlight csharp "linenos=table,linenostart=1" >}}
Paragraph p = (Paragraph)document.Document.Blocks.FirstBlock;
originalRunText = ((Run)p.Inlines.FirstInline).Text;
String word = "consectetur";
 
var textSearchRange = new TextRange(p.ContentStart, p.ContentEnd);
Int32 position = textSearchRange.Text.IndexOf(word, StringComparison.OrdinalIgnoreCase);
{{< / highlight >}}

The code works because I already know that my [FlowDocument](http://msdn.microsoft.com/en-us/library/ms601064.aspx) has only one [Paragraph](http://msdn.microsoft.com/en-us/library/ms522790.aspx) that in turn contains a single [Run](http://msdn.microsoft.com/en-us/library/ms522796.aspx), so I can easily grab the original Text (it will be used to restore the original test and remove the highligh), in line 5 I create a TextRange that span the whole paragraph, then I use the IndexOf function to find the text in the range. Now I can proceed to text modification

{{< highlight csharp "linenos=table,linenostart=1" >}}
if (position < 0) return;
 
TextPointer start;
start = textSearchRange.Start.GetPositionAtOffset(position);
var end = textSearchRange.Start.GetPositionAtOffset(position + word.Length);
 
var textR = new TextRange(start, end);
textR.Text = "";
{{< / highlight >}}

After a simple check to verify that we found the text to highlight, I create a range that comprehend the whole match and set Text value to an empty string to completely remove the text. This is done because I will highlight the text inserting a completely new Run.

{{< highlight csharp "linenos=table,linenostart=1" >}}
ToolTip tt = new ToolTip();
 
tt.Background = Brushes.LightYellow;
tt.Content = new Label() {Content = "Tooltip of HighLighted word"};
 
Run newRun = new Run(word, start);
newRun.FontSize = 30;
newRun.ToolTip = tt;
{{< / highlight >}}

I created a tooltip, but the important part is in line 6 where I create another run with the word I want to highlight setting as start location the location where I found the word, I set the font size to 30 to highlight it (you can change whatever property you want) and assign the tooltip to the run. Here is the result.

[![SNAGHTML1adb227](https://www.codewrecks.com/blog/wp-content/uploads/2011/06/SNAGHTML1adb227_thumb.png "SNAGHTML1adb227")](https://www.codewrecks.com/blog/wp-content/uploads/2011/06/SNAGHTML1adb227.png)

 ***Figure 2***: *The code will highlight a chosen word, and we also have a cool tooltip to show advanced info*

The restore button simply clear all the paragraph content and insert again the original text in a single Run.

{{< highlight csharp "linenos=table,linenostart=1" >}}
Paragraph p = (Paragraph)document.Document.Blocks.FirstBlock;
p.Inlines.Clear();
p.Inlines.Add(new Run(originalRunText));
{{< / highlight >}}

Quick and simple. [Code is Here](http://www.codewrecks.com/files/wpfflowdocument.zip).

alk.
