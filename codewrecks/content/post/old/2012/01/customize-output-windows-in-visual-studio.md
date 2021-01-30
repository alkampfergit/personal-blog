---
title: "Customize output windows in Visual Studio"
description: ""
date: 2012-01-09T18:00:37+02:00
draft: false
tags: [MEF,Plugin,Visual Studio]
categories: [Visual Studio]
---
I really like WPF for showing directly in the Visual Studio Output folder all binding errors, but one annoying stuff is that the output windows is usually crowded with all sort of stuff, so you have an hard life identifying the binding errors from all the other output contained in there. Since Visual Studio 2010 use WPF to render the output windows and use MEF for extension, modifying the aspect of the content of VS2010 is really simple. So I’ve created in few minutes a simple addin to hilite the databinding error in output windows, the example is based on the [Diff Classifier SDK](http://code.msdn.microsoft.com/windowsdesktop/Diff-Classifier-e87ed723) sample, that explains how to use the text classification feature of VS2010

First of all create a new Visual Studio Package project

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2012/01/image_thumb.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2012/01/image.png)

 ***Figure 1***: *Creating a Visual Studio Package*

Now you should add a couple of classes to the project that actually does the coloring for you.

[![SNAGHTML2180854](http://www.codewrecks.com/blog/wp-content/uploads/2012/01/SNAGHTML2180854_thumb.png "SNAGHTML2180854")](http://www.codewrecks.com/blog/wp-content/uploads/2012/01/SNAGHTML2180854.png)

 ***Figure 2***: *The CustomClassifierProvider will provide the entry point for modifying aspect of output window*

The OutputClassifierProvider implements the [IClassifierProvider](http://msdn.microsoft.com/en-us/library/dd885586.aspx) interface, used to create a classifier for a text buffer; basically its purpose is creating a classifier capable to format text, and the [ContentType](http://msdn.microsoft.com/en-us/library/dd821104.aspx) attribute specifies that it formats text for “output” window. Since VS 2010 uses MEF behind the scene to implements part of the plugin extension point, you should simply add the Export attribute telling MEF that this class exports the IClassifierProvider interface.

Then you need to go to the source.extension.vsixmanifest file and add the project as content for MEF exporting like shown in Figure 3.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2012/01/image_thumb1.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2012/01/image1.png)

 ***Figure 3***: *Remember to add the whole assembly as MEF Component*

To have this, simply press the “Add content” button and you can specify everything in the windows shown in  ***Figure 4***: [![SNAGHTML221549f](http://www.codewrecks.com/blog/wp-content/uploads/2012/01/SNAGHTML221549f_thumb.png "SNAGHTML221549f")](http://www.codewrecks.com/blog/wp-content/uploads/2012/01/SNAGHTML221549f.png)

 ***Figure 4***: *Adding the project as MEF Component.*

Now you only need to write the class that actually does the formatting, I called this “OutputClassifierProvider” and it is very simple. It simply implements the [IClassifier](http://msdn.microsoft.com/en-us/library/dd820929.aspx) interface, thus it can give classification to text in Visual Studio, here is the first part of the class.

{{< highlight csharp "linenos=table,linenostart=1" >}}
using System;
using System.Collections.Generic;
using Microsoft.VisualStudio.Text;
using Microsoft.VisualStudio.Text.Classification;
using System.ComponentModel.Composition;
using Microsoft.VisualStudio.Utilities;
using System.Windows.Media;
 
public class OutputClassifier: IClassifier
{
IClassificationTypeRegistryService _classificationTypeRegistry;
 
internal OutputClassifier(IClassificationTypeRegistryService registry)
{
this._classificationTypeRegistry = registry;
}
 
#region Public Events
 
public event EventHandler<ClassificationChangedEventArgs> ClassificationChanged;
 
#endregion
{{< / highlight >}}

The real work is done into the GetClassificationSpans method.

{{< highlight csharp "linenos=table,linenostart=1" >}}
public IList<ClassificationSpan> GetClassificationSpans(SnapshotSpan span)
{
ITextSnapshot snapshot = span.Snapshot;
 
List<ClassificationSpan> spans = new List<ClassificationSpan>();
 
if (snapshot.Length == 0)
return spans;
 
var text = span.GetText();
 
if (text.StartsWith("System.Windows.Data Error", StringComparison.OrdinalIgnoreCase))
{
IClassificationType type = _classificationTypeRegistry.GetClassificationType("output.wpfbindingalert");
spans.Add(new ClassificationSpan(span, type));
} else if (text.IndexOf("error", StringComparison.OrdinalIgnoreCase) >= 0)
{
IClassificationType type = _classificationTypeRegistry.GetClassificationType("output.alert");
spans.Add(new ClassificationSpan(span, type));
}
 
return spans;
}
{{< / highlight >}}

Basically I simply check if the text inside the span starts with “system.windows.data error” and if true I add the classification output.wpfbindingalert, and if contains the text error somewhere I add the classification output.alert, but what is a classification? If you go further down the class code you can find the definition of those two classification

{{< highlight csharp "linenos=table,linenostart=1" >}}
[Export]
[Name("output.alert")]
internal static ClassificationTypeDefinition outputAlertDefinition = null;
 
...
 
[Export(typeof(EditorFormatDefinition))]
[ClassificationType(ClassificationTypeNames = "output.info")]
[Name("output.info")]
internal sealed class OutputInfoFormat : ClassificationFormatDefinition
{
public OutputInfoFormat()
{
this.ForegroundColor =  Colors.Green;
this.IsBold = true;
}
}
{{< / highlight >}}

As you can see it is based on a simple static ClassificationTypeDefinition property then a class that inherit from ClassificationFormatDefinition and the game is done. Now you can press F5, start Visual Studio in Experimental Hive, open a wpf project with binding errors, run and look at you new colored output folder.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2012/01/image_thumb2.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2012/01/image2.png)

 ***Figure 5***: *Binding errors are now hilited in the output folder.*

It is amazing how simple is to extend VS 2010 thanks to MEF.

[Code is downloadable here.](http://www.codewrecks.com/files/alkampfervsix.zip)

Gian Maria.
