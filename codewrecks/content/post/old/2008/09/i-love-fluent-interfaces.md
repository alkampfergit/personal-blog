---
title: "I love fluent interfaces"
description: ""
date: 2008-09-04T06:00:37+02:00
draft: false
tags: [Software Architecture]
categories: [Software Architecture]
---
I’m developing a little library that basically does these steps

1) open a docx file  
2) Find a particular bookmark in the file  
3)Add some content at bookmark position  
4) Save the updated file.

This is a typical call

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2008/09/image-thumb.png)](http://www.codewrecks.com/blog/wp-content/uploads/2008/09/image.png)

I like very much this kind of syntax, since we chain every method we always have intellisense that suggest us what to call, if you read the code you can easily check that we add two simple cell with text, then we add a cell with complex text, then another paragraph and finally another table, here is the result on the final document.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2008/09/image-thumb1.png)](http://www.codewrecks.com/blog/wp-content/uploads/2008/09/image1.png)

Fluent interfaces like these fully benefit from intellisense and are really simple to use.

alk.

Tags: [fluent interface](http://technorati.com/tag/fluent%20interface)
