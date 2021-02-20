---
title: "Syntax vs Semantic"
description: ""
date: 2007-05-12T23:00:37+02:00
draft: false
tags: [Languages]
categories: [Languages]
---
Yesterday I was reading a [post](http://blogs.ugidotnet.org/duz/archive/2007/05/11/77956.aspx) of a friend of mine. In this post my friend complains that these two snippet of code produces very different result.

‘VB code: returns 1.2  
Public Function TestDiv() As Double  
Dim a As Int32 = 12  
Dim b As Int32 = 10  
Return a / b  
End Function  
//C# code: returns 1  
public static Double TestDiv() {  
Int32 a = 12;  
Int32 b = 10;  
return a / b;  
}

This example opens up a little discussion on witch of the two behavior is the more “correct one”  and makes me thinks about programming languages. A programming language is mainly composed by Syntax and Semantics, but it is surprising that a lot of people consider only the Syntax part when they switch from a language to another, ignoring semantics issues. The preceding examples is a perfect situation in which a programmer translate VB code into C# but forget to thing about how the languages interprets the code. But the question is, why languages have different semantics? Why C# returns 1 from the preceding function when a value of 1.2 would be more intuitive? Let’s make some thinkings...

Visual Basic.NET is very different from the older version (VB6 and previous version), but when the redmontonians creates is, they should maintain base semantics when possible. Visual Basic is a language born to be simple, its purpose is to permit to everyone to write a program. The result is that Visual Basic does not requires an intimate knowledge of the art o programming, so when a people write previous snippet, Visual Basic use floating point division even if the programmer ask to divide two integer values. The semantic of Visual Basic is to use the most detailed operation (floating point division) to shield the programmer from the gritty details of the processors.

C# is born from Java and C++, so people programming in these languages are used to know low level details about processors and virtual machines. C# enforces type safety, so when the compiler sees a division from two integers, it use integer division. This is the most logical semantic, *if you divide two integer use integer division*. Moreover the floating point division is slower in execution and this enforces C# compiler to have this semantic. The good thing is that both languages have Syntax that permits to choose which operator to use.

‘VB code: returns 1  
Public Function TestDiv() As Double  
Dim a As Int32 = 12  
Dim b As Int32 = 10  
Return a \ b  
End Function  
//C# code: returns 1.2  
public static Double TestDiv() {  
Int32 a = 12;  
Int32 b = 10;  
return (float) a / b;  
}

Visual basic has operator  \ , integer division, while C# requires only a cast. The C# approach is cleaner and according to me semantically more intuitive. If you divide two integer use integer division, if I tell the compiler to treat one of the number as float use the floating point division. Visual Basic on the other side introduces a whole new operator, only to express the concept of *Integer Division*, a solution that is less intuitive respect of C#.

The conclusion is that when moving from a language to another, be sure to keep in mind that is not only a change of Syntax, but be sure to take into account the semantic of new language.

Alk.
