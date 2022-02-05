---
title: "GeckoFX for c strange behavior"
description: ""
date: 2011-01-28T14:00:37+02:00
draft: false
tags: ["Programming"]
categories: ["Programming"]
---
Today I faced a very strange problem with GeckoBrowser, after navigating a page I simply need to grab all the HTML of the page to analyze it. I try to access the * **GeckoBrowser.Document.TextContentv** *property but it is always null.

I searched on the web and found [this discussion](http://geckofx.org/viewtopic.php?id=805) but it does not work, because the DocumentElement.InnerHtml throws a nullreferenceexception, how sad. In that post a user suggest to download the text manually, but saving bandwidth is one of the requirements, so I really need to use the HTML already downloaded by Gecko Browser.

After some inspection of the GeckoBrowser class I found this code that works, it is not optimal because it requires a save and a read to disk, but in my situation is more acceptable than use bandwidth to download the code again.

{{< highlight csharp "linenos=table,linenostart=1" >}}
String tempFile = Path.ChangeExtension(
Path.GetTempFileName(), ".html");
GeckoBrowser.SaveDocument(tempFile);
String content = File.ReadAllText(tempFile);
File.Delete(tempFile);
{{< / highlight >}}

The solution is to use the SaveDocument function that seems to save correctly all the content of the page. This solution is not really performant because it needs to access disk, but surely it save bandwidth, and is usually quicker respect downloading again the whole content with a WebRequest, and moreover it does not have problem of site with login etc etc.

Alk.
