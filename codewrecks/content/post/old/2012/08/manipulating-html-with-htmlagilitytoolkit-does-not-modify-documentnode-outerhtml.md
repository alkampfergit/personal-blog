---
title: "Manipulating Html with HtmlAgilityToolkit does not modify DocumentNodeOuterHtml"
description: ""
date: 2012-08-14T07:00:37+02:00
draft: false
tags: [Html]
categories: [EverydayLife]
---
[**Html Agility Pack**](http://htmlagilitypack.codeplex.com/) **is a real good library to manipulate Html with.NET code** , I used it for years and it is really good. To modify HTML you have a real convenient API where you can choose nodes with XPath and then manipulate with Remove() AddChild() etc etc. One of the caveat of manipulating the Document is that usually a lot of people goes through this path.

1. Load the document (from disk or in memory string)
2. Manipulate nodes
3. Get updated content from DocumentNode.OuterHtml property

This seems to be the correct path, because DocumentNode.OuterHtml is the property that contain the full html content of the page, but if you go through this path you will probably be surprised that  **modifying internal nodes, does not affect the OuterHtml property of the DocumentNode element**. The problem arise from the fact that *latest version of Html Agility Pack does heavy caching on that property and it gets updated only on specific conditions*. This can lead to unexpected behavior,  **sometimes the OuterHtml property reflects the modification, in other situation it does not**. The annoying stuff is that if you play the code inside the debugger with a lot of variables in Wacth, probably you will find that the property is updated, but when you run the program outside the debugger the behavior is different.

This is done to the fact that OuterHtml property is not meant to be used that way,  **when you modify content of a document with Html Agility Pack you need to get the updated content with the method Save** , that permits you to save updated content in a file, or in a memory stream to recreate a string in memory if you need to.

Gian Maria.
