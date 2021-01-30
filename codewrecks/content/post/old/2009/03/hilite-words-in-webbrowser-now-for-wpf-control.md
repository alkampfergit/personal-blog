---
title: "Hilite words in webbrowser now for WPF control"
description: ""
date: 2009-03-11T04:00:37+02:00
draft: false
tags: [NET framework,WPF]
categories: [NET framework,WPF]
---
[Some days ago](http://www.codewrecks.com/blog/index.php/2009/02/13/highlight-words-in-webbrowser-control/), I blogged about how to hilite words in a webBrowser control for windows forms. Now I need to do the same thing on [WPF WebBrowser](http://blogs.msdn.com/llobo/archive/2008/06/12/wpf-webbrowser.aspx) control, but instead of doing direct modification of DOM, a [friend](http://www.nablasoft.com/guardian) suggested me a [Javascript script](http://javascript.about.com/library/blhilite2.htm) to hilite words in document. My original technique, discussed in [old post](http://www.codewrecks.com/blog/index.php/2009/02/13/highlight-words-in-webbrowser-control/), is not so good because it replaces text in the whole content of the document, and sometimes it breaks script etc. Now I need to put everything in WPF and here is how you can accomplish the task.

1. Inject the script into document
2. Inject CSS into document
3. Call function of injected Javascript in point 1 to hilite words.

All steps are done in the LoadCompleted event of the WebBrowser, here is the step 1

{{< highlight csharp "linenos=table,linenostart=1" >}}
void browser_LoadCompleted(object sender, System.Windows.Navigation.NavigationEventArgs e)
{
   HTMLDocumentClass doc = browser.Document as HTMLDocumentClass;
   IHTMLDocument2 doc2 = browser.Document as IHTMLDocument2;
   originalContent = doc2.body.innerHTML;

   //Questo crea lo script per fare hilight
   IHTMLScriptElement script = (IHTMLScriptElement)doc2.createElement("SCRIPT");
   script.type = "text/javascript";
   script.text = hilightScript;{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

To create the script you can use the [createElement](http://msdn.microsoft.com/en-us/library/aa752570%28VS.85%29.aspx) method of the IHTMLDocument2 class passing the string "SCRIPT" to create a script. The return value can be directly cast to IHTMLScriptElement, then you need to set up the script type and the full text of the script (stored in a constant string called hilightScript that contains the [original script](http://javascript.about.com/library/blhilite2.htm)). Then I need to pass to step 2

{{< highlight csharp "linenos=table,linenostart=1" >}}
IHTMLStyleSheet style = (IHTMLStyleSheet)doc2.createStyleSheet("", 0);
style.cssText = ".hl {color:#f00;background-color:#ff0;font-weight:bold;}";{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

This one is really simple, thanks to the createSyleSheet method of IHTMLDocument2 class, I create an IHTMLStyleSheed that has cssText property used to setup the whole css content in a single shot. The step 3 is more complex

{{< highlight csharp "linenos=table,linenostart=1" >}}
 1 IHTMLElementCollection nodes = doc.getElementsByTagName("head");
 2 foreach (IHTMLElement elem in nodes)
 3 {
 4    //Append script
 5    HTMLHeadElementClass head = (HTMLHeadElementClass)elem;
 6    head.appendChild((IHTMLDOMNode)script);
 7 }
 8 
 9 //Invoke script
10 var wholeScript = doc2.Script;
11 wholeScript.GetType().InvokeMember(
12 "hilite_injected", BindingFlags.InvokeMethod, null, wholeScript, new object[] { "passione,ragazzi" });{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

In line 1 I grab the HEAD of the document, then I do a foreach (the nodes collection has no indexer, so I need to iterate even if nodes has only 1 entry) to access the head of the document, I cast it to the real type HTMLHeadElementClass and finally in line 6 I append the script to the head. Now the javascript is fully injected into the document and it is part of the page. In line 11 I use the InvokeMember of the doc2.Script to invoke the injected javascript function into the browser control (how cool is to use reflection on a.NET object to invoke javascript function).

To do a simple test I navigate on [www.nablasoft.com](http://www.nablasoft.com) and since I asked script to hilite words: "Passione" and "Ragazzi", here is the result.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2009/03/image-thumb2.png)](https://www.codewrecks.com/blog/wp-content/uploads/2009/03/image2.png)

YATTA! the text gets hilited and everything works ok :).

alk.

Tags: [mshtml](http://technorati.com/tag/mshtml) [WebBrowser](http://technorati.com/tag/WebBrowser) [WPF](http://technorati.com/tag/WPF) [HTML Manipulation](http://technorati.com/tag/HTML%20Manipulation)
