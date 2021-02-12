---
title: "Visual Studio 2010 Intellisense does not show ldquoParameter Infordquo"
description: ""
date: 2010-03-10T15:00:37+02:00
draft: false
tags: [Visual Studio]
categories: [Programming]
---
I installed on metal VS2010 RC, and when I tried to write the first line of code I see that intellisense failed to show parameter info.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2010/03/image_thumb1.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2010/03/image1.png)

This bring me back when I was young, and we have to remember all C stdlib functions because we used vi in linux to edit source file, but in 2010 I'm really bad without intellisense.

Ok, I remember very well that SqlConnection has 2 constructors, but for complex classes working without intellisense can be a pain. Since all other functions of Intellisense work as expected I go to Tools/options menu and check the *Text Editor* / *AllLanguages* setting, and I found this

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2010/03/image_thumb2.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2010/03/image2.png)

For some strange reason, in C# this option is disabled, so I simply re-enable for all languages, now everything works as expected.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2010/03/image_thumb3.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2010/03/image3.png)

Alk.

Tags: [Visual Studio](http://technorati.com/tag/Visual%20Studio)
