---
title: "Blame on me for old vb code net 10 completely not CLS"
description: ""
date: 2010-05-20T14:00:37+02:00
draft: false
tags: [NET framework]
categories: [NET framework]
---
Today Iâ€™m converting a project written in VB to C#, since it is composed by simple classes that manages reporting in RTF, I supposed that this will be a simple process. This project uses a RTF library I wrote in Visual Basic in 2002, that was simply compiled for.NET 2.0 some times ago.

The problem is that the library is really not [CLS](http://blogs.msdn.com/brada/archive/2004/03/20/93341.aspx) compliant and when I converted this project, (that contains 54 classes) I got ~ 2000 compilation errors. This because the library uses a lot of not CLS features, and converting library to C# caused me a lot of troubles.

First, I used indexed properties with parameter, something like this.

{{< highlight csharp "linenos=table,linenostart=1" >}}
T.RowProperty(0).BackgroundColor = &H808080
{{< / highlight >}}

This is a property called RowProperty that require an Integer parameter, clearly when the project was converted in C# the result is this one :)

{{< highlight csharp "linenos=table,linenostart=1" >}}
b.RowProperty[0].BackgroundColor = 0x808080;
{{< / highlight >}}

That is not valid code, it raises the error

{{< highlight csharp "linenos=table,linenostart=1" >}}
Property, indexer, or event 'RowProperty' is not supported by the language; try directly calling accessor method 'Nablasoft.RTF.RTFTableGenerator.get_RowProperty(int)
{{< / highlight >}}

The quickest solution is to do a search and replace, and many thanks to visual studio that supports find and replace with regular expressions.[![image](http://www.codewrecks.com/blog/wp-content/uploads/2010/05/image_thumb17.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2010/05/image17.png)

This permits to me to change every occurrence of.RowProperty[index] with.get\_RowProperty(index). There are also a lot of failing call to method with default parameter, not supported in C# 3.5â€¦

This remind me that every Assembly MUst always be marked with the [CLSCompliantAttribute](http://msdn.microsoft.com/en-us/library/system.clscompliantattribute.aspx) and make sure that it is CLS compliant to avoid problem using it with different languages :(

Alk.
