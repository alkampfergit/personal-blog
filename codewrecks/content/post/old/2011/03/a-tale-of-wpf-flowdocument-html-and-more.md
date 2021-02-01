---
title: "A tale of WPF flowDocument Html and more"
description: ""
date: 2011-03-23T17:00:37+02:00
draft: false
tags: [WPF]
categories: [WPF]
---
I have a WPF interface where I need to show an image embedded in a text, but the main problem is that the text is in HTML. First of all I found the [HtmlToXamlConverter](http://blogs.msdn.com/b/wpfsdk/archive/2006/05/25/606317.aspx) that can convert an HTML fragment of text into XAML Paragraph. This is a good starting point, but I want to create something reusable (such an interface is used in various part of the software)

I decided to write a custom control that inherits from [FlowDocumentScrollViewer](http://msdn.microsoft.com/en-us/library/ms610538%28v=VS.90%29.aspx) and has another Dependency property used to specify the HTML text to show.

{{< highlight csharp "linenos=table,linenostart=1" >}}
public class HtmlComposableFlowDocument : FlowDocumentScrollViewer
{
 
public String HtmlDocument
{
get { return (String)GetValue(HtmlDocumentProperty); }
set { SetValue(HtmlDocumentProperty, value); }
}
 
// Using a DependencyProperty as the backing store for HtmlDocument.  This enables animation, styling, binding, etc...
public static readonly DependencyProperty HtmlDocumentProperty =
DependencyProperty.Register("HtmlDocument", typeof(String), typeof(HtmlComposableFlowDocument),
new UIPropertyMetadata("", OnHtmlDocumentChange));
{{< / highlight >}}

Now My goal is writing this XAML Code, and having my Html text wraps the image.

{{< highlight csharp "linenos=table,linenostart=1" >}}
<Controls:HtmlComposableFlowDocument
HtmlDocument="{Binding Description, FallbackValue = 'FAILDESC'}"
FontSize="13.333"
Height="330" >
<FlowDocument>
<ParagraphFontSize="9" Foreground="#FF00204E">
<Figure HorizontalAnchor="ContentRight" BaselineAlignment="TextTop"
Width="200" Height="150"  Margin="0,0,0,5">
<BlockUIContainer>
<Image Source="{Binding Picture}"
Stretch="UniformToFill"
Width="180"
Height="150"
HorizontalAlignment="Right"/>
</BlockUIContainer>
</Figure>
</Paragraph>
</FlowDocument>
</Controls:HtmlComposableFlowDocument>
{{< / highlight >}}

As you can see I'm using my control exactly like a FlowDocumentScrollViewer, but I've added the HtmlText using HtmlDocument property. To make html text wraps the image I need to do some work with the flowdocument

{{< highlight csharp "linenos=table,linenostart=1" >}}
private List<Inline> _addedElements = new List<Inline>();
private static void OnHtmlDocumentChange(DependencyObject d, DependencyPropertyChangedEventArgs e)
{
HtmlComposableFlowDocument obj = (HtmlComposableFlowDocument)d;
string htmlString = (String)e.NewValue;
if (obj.Document == null)
{
obj.Document = new FlowDocument();
obj.Document.Blocks.Add(new Paragraph());
}
Paragraph original = (Paragraph)obj.Document.Blocks.FirstBlock;
foreach (Inline addedElement in obj._addedElements)
{
original.Inlines.Remove(addedElement);
}
obj._addedElements.Clear();
try
{
string xaml = HtmlToXamlConverter.ConvertHtmlToXaml(htmlString, false);
FlowDocument flowDocument = new FlowDocument();
using (MemoryStream stream = new MemoryStream((new UTF8Encoding()).GetBytes(xaml)))
{
TextRange text = new TextRange(flowDocument.ContentStart, flowDocument.ContentEnd);
text.Load(stream, DataFormats.Xaml);
}
Paragraph loaded = (Paragraph)flowDocument.Blocks.Single();
foreach (Inline inline in loaded.Inlines.ToList())
{
loaded.Inlines.Remove(inline);
inline.FontSize = 14;
obj._addedElements.Add(inline);
original.Inlines.Add(inline);
}
}
catch (Exception ex)
{
Run run = new Run(htmlString);
run.FontSize = 14;
original.Inlines.Add(run);
}
}
{{< / highlight >}}

First of all if the original document is null I create a flow document and add an empty paragraph. In lines 11-16 I removed element added previously. This is due to the fact that my HtmlText property is bound to the VM and changes, so each time it changes value this routine gets called and add the HTML text converted to WPF. This forces me to remove every Inline that I could possibly have added previously.

Lines 19-26 are used to convert the html text into a new flowDocument, then in lines 28-35 I simply take the first paragraph from the flowDocument resulting from the conversion from HTML to XAML, cast into a paragraph and then add all the Inlines inside the document, thus adding all the HTML converted text. As you can see each inline is added to the \_addedElements collection and is used in lines 11-16 to remove these elements in subsequent change of the HTmlText property.

All conversion routine is enclosed in a try..catch, and the fallback action is to show all HTML content.

The result is quite cool. (I've blurred the image because it contains production data)

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2011/03/image_thumb18.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2011/03/image14.png)

 ***Figure 1***: *The result of the custom control, text around the image.*

The cool part is that the image part is inserted by designer, so you can give margin, orientation, and the rest of the text was automatically converted from HTML and inserted in the Paragraph. As you can see some of the text is blod, because HTML tag &lt;b&gt; is correctly converted into a Run with FontWeight bold.

alk.
