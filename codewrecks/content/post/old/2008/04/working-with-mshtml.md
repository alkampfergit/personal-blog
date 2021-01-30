---
title: "Working with MSHTML"
description: ""
date: 2008-04-25T22:00:37+02:00
draft: false
tags: [NET framework]
categories: [NET framework]
---
If you need to parse an html content, the MSHTML library can be a viable solution, it is quite simple to use even if it has some peculiarity, the first thing to do is to load data from a source, maybe you have the HTML content on a string, (perhaps you downloaded the page with a WebRequest), here is the code to load all the content of a page and then take only the content of the page, whitout all the html and script tags

{{< highlight csharp "linenos=table,linenostart=1" >}}
IHTMLDocument2 theDoc = new HTMLDocumentClass();
try {
    theDoc.write(new object[] { fullContent });
    theDoc.close();
    return theDoc.body.innerText;
}
finally {
    ReleaseObject(theDoc);

}{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

The most important thing is that, even if the object is really a  **HTMLDocumentClass** object, you need to cast to  **IHTMLDocument2** object, if you forget this, you cannot load the document with the write method, because it will complain to you that you do not pass a safearray. Remember to always release the object With  **Marshal.ReleaseComObject**.

To load an HTMLfile that was saved on disk is a more difficult tastk. For some reason that I ignore, you need to load the file on a thread different from the principal one, it seems that the load function needt to interact with the windows message pump, so you cannot invoke it on the main GUI thread. The solution is not difficult, first of all create a new function that accept an object, so you can schedule for execution in another thread with the ThreadPool

{{< highlight chsarp "linenos=table,linenostart=1" >}}
private void LoadFile(Object doc) {
    IPersistFile persistFile = (IPersistFile)doc;
    HTMLDocumentClass theDoc = (HTMLDocumentClass)doc;
    persistFile.Load(new FileInfo("page1.html").FullName, 0);
    while (theDoc.readyState == "loading") {
       Thread.Sleep(300);
    }
}{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

This is really a simple function, simple cast the document object to a  **IPersistFile** interface and you can now access the  **Load()** method. This is the main code, for example in the handler of a button.

{{< highlight csharp "linenos=table,linenostart=1" >}}
currentdoc = new HTMLDocumentClass();
ThreadPool.QueueUserWorkItem(this.LoadFile, currentdoc);{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

Ok, this example is far to be a complete example, first of all you need to pass the fileName to the LoadFile function, this can be done simply creating a class holding a reference to the Doc object and contains the FileName as string, than you can pass this object to the function, second, you maybe need to raise an event in LoadFile telling when the loading is complete, you react to this event to access the content of the file and then access the document object.

alk.

Tags: [MSHTML](http://technorati.com/tag/MSHTML) [Html Parser](http://technorati.com/tag/Html%20Parser)
