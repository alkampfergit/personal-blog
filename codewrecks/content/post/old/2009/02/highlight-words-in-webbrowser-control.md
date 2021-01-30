---
title: "Highlight words in webbrowser control"
description: ""
date: 2009-02-13T11:00:37+02:00
draft: false
tags: [NET framework,General]
categories: [NET framework,General]
---
In windows forms the WebBrowser control permits to include a fully funcional browser into your application. The interesting things is that you can interact with the html of the site with no problem. As an example you can load a page and highlight some words into the text, here is the result of loading [www.nablasoft.com](http://www.nablasoft.com) and I want to highlight "laureati" and "passione".

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2009/02/image-thumb3.png)](https://www.codewrecks.com/blog/wp-content/uploads/2009/02/image3.png)

As you can see I’ve highlighted the two words, the code is really simple.

{{< highlight CSharp "linenos=table,linenostart=1" >}}
private void button1_Click(object sender, EventArgs e)
{
   webBrowser1.Navigate("http://www.nablasoft.com/");
   webBrowser1.DocumentCompleted += webBrowser1_DocumentCompleted;
}

void webBrowser1_DocumentCompleted(object sender, WebBrowserDocumentCompletedEventArgs e)
{
   IHTMLDocument2 doc2 = webBrowser1.Document.DomDocument as IHTMLDocument2;
   StringBuilder html = new StringBuilder(doc2.body.outerHTML);

   var words = new[] { "laureati", "passione" };
   foreach (String key in words)
   {
      String substitution = "<span style='background-color: rgb(255, 255, 0);'>" + key + "</span>";
      html.Replace(key, substitution);
   }

   doc2.body.innerHTML = html.ToString();
}{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

First of all you need to wait that the document finished to load before you can interact with the content, this is simple because you can use the event DocumentCompleted. To access content you should refer the MSHTML COM Library in your project since the webbrowser uses the mshtml internally. To highlight words I simply grab all content, surround the keywords with a simple span with a background style and then replace the whole html text again…really simple.

alk.

Tags: [MSHTML](http://technorati.com/tag/MSHTML) [.NET Framework](http://technorati.com/tag/.NET%20Framework)
