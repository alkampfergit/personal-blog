---
title: "Disable Javascript error in WPF WebBrowser control"
description: ""
date: 2010-08-31T06:00:37+02:00
draft: false
tags: [Javascript,WPF]
categories: [WPF]
---
I work with WebBrowser control in WPF, and one of the most annoying problem I have with it, is that sometimes you browse sites that raise a lot of javascript errors and the control become unusable. Thanks to my friend Marco Campi, yesterday I solved the problem. Marco pointed me a [link](http://andylangton.co.uk/articles/javascript/disable-javascript-errors/) that does not deal with WebBrowser control, but uses a simple javascript script to disable error handling in a web page.

{{< highlight csharp "linenos=table,linenostart=1" >}}
<script type="text/javascript">   1: 
 
function noError(){return true;}
window.onerror = noError;
 
</script>
{{< / highlight >}}

This solution is really simple, and seems to me the right way to solve the problem. The key to the solution is handle the [Navigated](http://msdn.microsoft.com/en-us/library/system.windows.controls.webbrowser.navigated%28VS.90%29.aspx) event raised from the WebBrowser control. First of all I have my WebBrowser control wrapped in a custom class to add functionalities, in that class I declare this constant

{{< highlight csharp "linenos=table,linenostart=1" >}}
private const string DisableScriptError =
@"function noError() {
return true;
}
window.onerror = noError;";
{{< / highlight >}}

This is the very same script of the previous article, then I handle the Navigated event

{{< highlight csharp "linenos=table,linenostart=1" >}}
void browser_Navigated(object sender, System.Windows.Navigation.NavigationEventArgs e)
{
InjectDisableScript();
{{< / highlight >}}

Actually Iâ€™m doing a lot of other things inside the Navigated event handler, but the very first one is injecting into the page the script that disable javascript error.

{{< highlight csharp "linenos=table,linenostart=1" >}}
private void InjectDisableScript()
{
HTMLDocumentClass doc = Browser.Document as HTMLDocumentClass;
HTMLDocument doc2 = Browser.Document as HTMLDocument;
 
 
//Questo crea lo script per la soprressione degli errori
IHTMLScriptElement scriptErrorSuppressed = (IHTMLScriptElement)doc2.createElement("SCRIPT");
scriptErrorSuppressed.type = "text/javascript";
scriptErrorSuppressed.text = DisableScriptError;
 
IHTMLElementCollection nodes = doc.getElementsByTagName("head");
 
foreach (IHTMLElement elem in nodes)
{
//Appendo lo script all'head cosi Ã¨ attivo
 
HTMLHeadElementClass head = (HTMLHeadElementClass)elem;
head.appendChild((IHTMLDOMNode)scriptErrorSuppressed);
}
}
{{< / highlight >}}

This is the code that really solves the problem, the key is creating a IHTMLScriptElement with the script and injecting into the Head of the page, this effectively disables the javascript errors. Iâ€™ve not fully tested with a lot of sites to verify that is able to intercept all errors, but it seems to work very well with a lot of links that gave us a lot of problems in the past.

Alk.

Tags: [WPF](http://technorati.com/tag/WPF)

Tags: [Javascript](http://technorati.com/tag/Javascript)
