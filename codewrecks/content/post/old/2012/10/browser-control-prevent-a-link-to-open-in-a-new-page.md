---
title: "Browser control prevent a link to open in a new page"
description: ""
date: 2012-10-17T19:00:37+02:00
draft: false
tags: [Html,WebBrowser,WPF]
categories: [WPF]
---
Working with BrowserControl in.NET can be annoying, especially because it is a really complex control and it is a real browser inside your application. As an example  **one of the most common problem is how to prevent a page to open links in a new window**. Lot of sites have anchor tags with attribute *Target=”\_blank”, that opens the link on a new tab*, leaving the original tab with the original content (es. forum, blog search result, etc).

One of the most common need for an integrated browser control inside own application is permitting to the user to surf the web and offer them some specific functionality, es: *highlighting text inside the browser, extract part of the content, manipulate content, extract content etc etc*, and  **when an anchor link has a Target=”\_blank” it will open in an entire new regular browser windows, and you have absolutely no control over it**. The result is an annoyed user, because he need to copy the link from the new page, and paste back into your application to work with the link. So a standard question arise: “how can I cope with links that are configured to open themselves on a new page?”

A simple solution is  **manipulate the content of the HTML document simply changing all anchor tags that have a Target attribute and set it to \_self**. With this simple trick all the links will continue to open on the same window of browser control, without opening a new window. All you need to do is trap the event LoadCompleted.

{{< highlight csharp "linenos=table,linenostart=1" >}}


cntBrowser.LoadCompleted += browser_LoadCompleted;

{{< / highlight >}}

This is code that works for the WPF version of the Browsercontrol, but it should work with no problem even for original Winform control. Now in the Loadcompleted you need to manage the content of the browser.

{{< highlight csharp "linenos=table,linenostart=1" >}}


HTMLDocument doc2 = cntBrowser.Document as HTMLDocument;
foreach (IHTMLElement item in doc2.links)
{
var targetAttributeValue = item.getAttribute("target");
if (targetAttributeValue != null)
{
	Debug.WriteLine(item.getAttribute("href") as string + " changed href from " + targetAttributeValue as string + " to _self");
	item.setAttribute("target", "_self");
}
}

{{< / highlight >}}

code is really simple,  **cast the Document property of the browser contorl to HTMLDocument class, then iterate in all the links of the document and if the target attribute is present substitute its value with “\_self”**. This will actually change the content of the page, and each link that is originally created with Target=”\_blank” or any other value will become Target=”\_self”.

If you use the *GeckoWebBrowser* control you can use the very same trick, the code is just a little bit different.

{{< highlight csharp "linenos=table,linenostart=1" >}}


if (GeckoBrowser.Document != null && GeckoBrowser.Document.Body != null)
{
    foreach (var anchor in GeckoBrowser.Document.GetElementsByTagName("a"))
    {
        var targetAttributeValue = anchor.GetAttribute("target");
        if (!String.IsNullOrEmpty(targetAttributeValue))
        {
            Debug.WriteLine(anchor.GetAttribute("href") as string + " changed href from " + targetAttributeValue as string + " to _self");
            anchor.SetAttribute("target", "_self");
        }
    }
}

{{< / highlight >}}

Now each link will open in web browser control, even if it was originally planned to be opened in a new window.

Alk.
