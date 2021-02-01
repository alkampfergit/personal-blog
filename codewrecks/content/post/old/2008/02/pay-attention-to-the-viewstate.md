---
title: "Pay Attention to the viewState"
description: ""
date: 2008-02-11T10:00:37+02:00
draft: false
tags: [ASPNET]
categories: [ASPNET]
---
In  a project of mine I have a page that permit the user to search into database for object that satisfies a series of criteria. I have a function that returns a list of SMResult object, each of them store the id of the object, and some other information, such as the percentage of match and so on.

In the first version I have a user control with a property that accept a IList&lt;SMResult&gt;, this control simply shows the objects that are contained into the list. This control store the list into the viewstate because he needs the information between various postback. The problem is that the database grow bigger and bigger, the function can return even 10.000 result, but I simply show to the user the first 500…but the list of result stored into the viewstate is not trimmed. This create a huge 640kb page argh… Simply trimming the Result List to 500 elements drop the page to 120 kb.

The rule is…..always take a look at how big your viewstate is when you store object into it.

alk.
