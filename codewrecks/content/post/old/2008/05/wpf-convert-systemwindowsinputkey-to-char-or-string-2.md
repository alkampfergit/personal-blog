---
title: "WPF convert SystemWindowsInputKey to char or string"
description: ""
date: 2008-05-06T00:00:37+02:00
draft: false
tags: [WPF]
categories: [WPF]
---
Today I spent half an hour trying to solve a really stupid problem. I have a WPF windows where I have to intercept all char input from the keyboard and handle a char at a time. This is to work with a barcode reader with a keyboard connection.

I begin to intercept the event KeyPress, but the problem is that this event gives information about the Key pressed, that is a particular enumeration roughly corresponding to the data coming from the WM\_CHAR windows message. I spent a lot of time trying to convert this value into char, but with a lot of problem.

First of all the Key property of the KeyEventArgs object is an enum, so if you press the letter d or D its value is always capital D, and you have to check if shift is pressed to check for the capitalization. Then I need to intercept the characther ^, but when I press it the key value is  **Oem6** , o my god, how I can convert this value to the real digit?

After a trip with the KeyConverter class that does not solve my problem I found that windows has another event that solve my problem, the  **TextInput**. If you intercept that event you have a TextCompositionEventArgs that has a Text property exactly containing what I  need.

I’m quite surprised that it took me half an hour to find a solution to such a simple problem, I’d like to find a reference into the msdn documentation.

Alk.

Tags: [WPF](http://technorati.com/tag/WPF) [KeyPress](http://technorati.com/tag/KeyPress)
