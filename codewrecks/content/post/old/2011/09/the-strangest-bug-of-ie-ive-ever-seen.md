---
title: "The strangest bug of IE Irsquove ever seen"
description: ""
date: 2011-09-07T14:00:37+02:00
draft: false
tags: [ASPNET]
categories: [ASPNET]
---
We have a web application written in asp.net and we experienced really strange problem after recent modification. We have a strange behavior in IE9 with redirects and after some inspection we found a really strange fact (that almost make us lost 2 hours of work). To recreate this situation simply create a new page in an asp.net site, and put this code in it.

{{< highlight csharp "linenos=table,linenostart=1" >}}
<form id="form1" runat="server">
<div>
<label id="queuecount"  />
<asp:ImageButton ID="ImageButton1" runat="server" />
<a href="http://www.microsoft.com">microsoft</a>
</div>
</form>
{{< / highlight >}}

Now simply run this page with fiddler opened, you should see a simple broken image and a standard anchor tag. Now click on the link and look at what happened with fiddler.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2011/09/image_thumb.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2011/09/image.png)

Internet explorer issue the request to [www.microsoft.com](http://www.microsoft.com), but immediately after he request the original asp.ner page in POST. The order of the two requests varies, sometimes the test.aspx POST is done before requesting the link, and the user navigates to [www.microsoft.com](http://www.microsoft.com), but if the order is reversed (as appears in the above image) the user remains on the original page wondering on what is happening.

Using Firefox, Opera or Chrome do not produce any strange result, it seems only a bug of Internet Explorer. If you remove the HTML label tag or the image button everything works correctly, but it seems that if you have a label and an imagebutton, a simple anchor link in the page causes an unnecessary postback to the same page.

Gian Maria.
