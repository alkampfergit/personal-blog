---
title: "Parse a date in NET"
description: ""
date: 2007-06-28T07:00:37+02:00
draft: false
tags: [Uncategorized]
categories: [General]
---
Today I had a little bug in an application of mine, I have a routine that accepts a series of parameter through a comma separated string of values, this kind of interface to a function is not a good thing to do, expecially when DateTime variables are transmitted, but this is an old routine and worked well for a while, so I did not refactor.

The problem is arising now when the application build another function on top of this routine. Until now whenever I need to parse a DateTime from string I Symply use the current culture and all works well, but another functionality is requested, these string are to be saved in database and then reused, then here is the problem, a user with default English language insert a string in MM/dd/yyyy format, then save into the database a list of parameter like this “1/30/2007,3/20/2007”, later an Italian user retrieve the string, passed to the routine that split the string, and try to convert date with the Italian culture...ooooppssssssssss. L

After a couple of minutes of investigation I remembered an article that I read a lot of time ago...in.NET 2.0 DateTime type has not only the Parse() method, but also the [ParseExact](http://msdn2.microsoft.com/en-us/library/332de853.aspx)(), that has an overload version that accepts an array of string listing all supported formats....this is exactly what you need whenever a Multilanguage software should convert DAteTime values from/to string.

Private  
Shared  
ReadOnly ValidDateTimeFormats() As  
String = {“dd/MM/yyyy”, “MM/dd/yyyy”}  
...  
DateTime.ParseExact(value, ValidDateTimeFormats, Nothing, Globalization.DateTimeStyles.None)

Alk.
