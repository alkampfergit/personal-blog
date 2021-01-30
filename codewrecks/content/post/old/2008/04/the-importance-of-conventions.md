---
title: "The importance of quotconventionsquot"
description: ""
date: 2008-04-30T06:00:37+02:00
draft: false
tags: [General]
categories: [General]
---
I like in C# not to have the open bracket in newline, it is not the default setting of Visual Studio but I was used to this scheme since I worked with C++ in linux, so I’m used with it. This is a “convention” and seems not to be so important…until you work in a team

1) The most important problem with different indentation or layout scheme, is that when you press the magic CTRL+K CTRL+D you reformat the source code with *your layout scheme*, when you use winmerge or similar tool to find differencies between the various version in a source control you find  often that all the file is changed…because of the layout..so bad :(, this create panic whenevere a merge is needed

2) When everyone use the same layout everyone is more confident with the code. The indentation really makes code more clear.

3) It helps the team discussing on convetions, you start with layout conventions, then you move to Naming Conventions, Comment Conventions and so on. The layout is a good starting point to estabilish something.

4) make sure that all the conventions are written to a file and that every new team had read the file and everyone in the team have easy access to it.

It is very important that a team agrees to a common layout scheme.

Alk.

Tags: [Coding Layout](http://technorati.com/tag/Coding%20Layout) [Visual Studio Settings](http://technorati.com/tag/Visual%20Studio%20Settings)
