---
title: "Strings with Null characters"
description: ""
date: 2008-04-25T23:00:37+02:00
draft: false
tags: [NET framework]
categories: [NET framework]
---
Sometimes.NET surprise me even if it is a really long time I work with it, some days ago I discovered that a string can contains Null characters. This seems strange to me because chars are value type, and a value type sould never assume value nothing, but it can for string.

I have an asp.net application written in Visual Basic, that takes some string from database and display them in simple literal control inside a template column of a gridview. It happens that the third page of the grid shows only the first 5 elements, and the rest of the lines does not gets rendered at all when I use an updatePanel. After some minutes of thinking I inspect the code and I see that a string that comes from the database has lenght 970 but the debugger and the UI shows only the first 262 chars.

After a brief investigation I discorvered that chars from 263 to 268 are null, and when the string gets rendered to HTML contains some strange chars that probably chrashes the javascript that does the partial rendering. The question is, *how can I detect a string for a null character?*

In VB I used the quick solution, iterate through all characters of the string and check if AscW(mystring.Chars(I)) is Zero. If I found a zero chars, I truncate all the data with a substring.

alk.

Tags: [.NET](http://technorati.com/tag/.NET)
