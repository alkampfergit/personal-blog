---
title: "Disable Javascript errors in WPF Web Browser Control take2"
description: ""
date: 2011-11-17T15:00:37+02:00
draft: false
tags: [WPF]
categories: [WPF]
---
I’ve dealt with this problem [some time ago](http://www.codewrecks.com/blog/index.php/2010/08/31/disable-javascript-error-in-wpf-webbrowser-control/) and the solution I posted worked well, but requires you to manipulate the content of the page, injecting script on the DOM. If you want to get rid of annoying messagebox with javascript error, there is another solution based on simply setting the Silent property on the AXIWebBrowser2 COM control.

The full solution [was described here](http://www.brentlamborn.com/post/WPF-Web-Browser-ScriptErrorsSupressed.aspx) by Brent Lamborn and is a pretty good solution that does not require you to manipulate the content of the DOM. The Silent property of the AXIWebBrowser2 control is probably the same Property that you can set through the *ScriptErrorSuppressed*property of the winform version of WebBrowser control.

I wonder why this property was not ported to the WPF version of the control.

Gian Maria.
