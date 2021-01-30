---
title: "Microsoft html parser"
description: ""
date: 2008-05-13T14:00:37+02:00
draft: false
tags: [General]
categories: [General]
---
When working with HTML the microsoft HTML parser can be useful, but surely is not a simple beast to deal on. I have no great familiarity, but I was astonished on the interface in my first try.

Situation 1: You have a string with the HTML content, here is the code to load the html into the object

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2008/05/image-thumb2.png)](http://www.codewrecks.com/blog/wp-content/uploads/2008/05/image2.png)

This is really simple, but pay attention, the object has to be casted to *IHTMLDocument2*, if you cast to HTMLDocumentClass the above method does not work.

Situation 2: Suppose now that you have the content in a file, the situation is much more difficult. Here is the method

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2008/05/image-thumb3.png)](http://www.codewrecks.com/blog/wp-content/uploads/2008/05/image3.png)

Ok, this is a much more code, but the most important fact is that you cannot invoke that function in main thread. The problem is that IPersistFile seems to need a working messag pump (windows application) and clearly you cannot invoke that method in the event of the button, if you try to make a similar tentative the method will block. Then do not forget to use the  **fullName** of the file, not relative one. OK! This seems to me a strange thing, even because I need to cast the HTMLDocumentClass to IPersistFile interface, but the worst has to come. After some search in the internet I found the following method to load the content of an URL to the object

Situation 3: Load the content from the web (This seems to me the most common thing to do with such a control)

First of all we need to declare some COM stuff to make all castle works

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2008/05/image-thumb4.png)](http://www.codewrecks.com/blog/wp-content/uploads/2008/05/image4.png)

Ok, this can be intimidating, but you can find such a declaration somewhere in the net, but you know… dealing with COM in.NET is not always that easy, so you must be prepared to use some platform invoke specific attributes, and then here is the code to load code from web.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2008/05/image-thumb5.png)](http://www.codewrecks.com/blog/wp-content/uploads/2008/05/image5.png)

First of all, you need to invoke this method in another thread, the same of situation number two. But the really strange thing is the need to cast the HTMLDocumentClass to *IPersistStreamInit* and the need to call the method *InitNew().*If you forget to do this, the document will remain in readyState == "loading" and the document will never loaded, no error message, no clue, just the document will remain in loading state :(.

It seems to me that this object will cause really a great confusion, maybe it is time to give some managed interface to do the same thing (or maybe I do not know :D :D :D please someone tells me that a simplier way to parse html actually exists :D )

Alk.

Technorati Tags: [mshtml](http://technorati.com/tags/mshtml)

<!--dotnetkickit-->
