---
title: "C anonymous delegates and template pattern"
description: ""
date: 2007-06-05T01:00:37+02:00
draft: false
tags: [Languages]
categories: [Languages]
---
Yesterday I blogged on a slightly modified version of Ayende code posted [here](http://ayende.com/Blog/archive/2007/05/27/Reflections-on-the-Naked-CLR.aspx), this makes me reflect on template pattern of the GOF. Template pattern is one of the most useful pattern, and is used when you have a common block of code that is to be repeated in may part with a little customization. In the GOF the intent of the pattern is

*Define the skeleton of an algorithm in an operation, deferring some steps to subclasses. Template method lets subclasses redefine certain steps of an algorithm without changing the algorithm’s structure.*

The original description of the pattern explicitly states that the implementation is made by a template class (usually abstract) and then a series of subclasses, each for a different variation of the algorithm that is to be implemented. C# anonymous delegates are a great way to implement a template pattern even with a static class, without the need to use subclasses or inheritance. The post from Ayende is a great example of this. In his code Ayende creates a base method that accepts a delegate with all the common infrastructure to execute ad Ado.NET DbCommand. In the base static function he creates connection, starts a transaction and creates a command that will be attached to an open connection, then he calls the delegates passed as an argument. With anonymous delegate the caller is able to specify a block of code that logically will be substituted into the inner part of the Template static method. This kind of implementation can also be done in C++ with function pointer, but is definitively not so readable as counterpart in C#.

Alk.
