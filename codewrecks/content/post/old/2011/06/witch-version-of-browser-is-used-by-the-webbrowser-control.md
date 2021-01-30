---
title: "Witch version of browser is used by the WebBrowser control"
description: ""
date: 2011-06-06T12:00:37+02:00
draft: false
tags: [WPF]
categories: [WPF]
---
This question seems to have a simple answer, the *WebBrowser control*uses the version of Internet Explorer currently installed on the system, but you could be surprised running a simple program with a WebBrowser control and navigating to a site like [www.chisono.it](http://www.chisono.it)

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2011/06/image_thumb6.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2011/06/image6.png)

This answer can surprise you, because I have IE9 installed, but the WebBrowser control seems to use the IE7 engine, and you can verify running an acid test ([http://acid3.acidtests.org/](http://acid3.acidtests.org/ "http://acid3.acidtests.org/")) that this is indeed not only a problem of UserAgent, but the rendering engine is not of IE9

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2011/06/image_thumb1.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2011/06/image1.png)

Clearly the test failed to run, and this is a confirmation that the WebBrowser is actually running an IE7 engine. The real reason behind this is explained in [this msdn article](http://msdn.microsoft.com/en-us/library/ee330730.aspx) that clearly states that the Registry Key

 **HKEY\_LOCAL\_MACHINE (or HKEY\_CURRENT\_USER)**  **SOFTWARE**  **Microsoft**  **Internet Explorer**  **Main**  **FeatureControl**  **FEATURE\_BROWSER\_EMULATION** Is responsible to determine the level of emulation for applications. If have an application called WebBrowserWinform.exe and you want it to run the WebBrowser as IE9 you should add this key.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2011/06/image_thumb2.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2011/06/image2.png)

And now you can run again the program to verify with acid test that rendering engine used by the WebBrowserControl is now the correct one.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2011/06/image_thumb3.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2011/06/image3.png)

Ok, this is the standard result for IE9 and if you like you can also check [www.chisono.it](http://www.chisono.it) to have a confirmation of UserAgent string

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2011/06/image_thumb4.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2011/06/image4.png)

You can also use wildcard, as an example, I want every program that uses a WebBrowser control to use the IE9 version for current user, so I decided to add this key.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2011/06/image_thumb5.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2011/06/image5.png)

This gives me a good default to work with ![Smile](https://www.codewrecks.com/blog/wp-content/uploads/2011/06/wlEmoticon-smile.png).

alk.
