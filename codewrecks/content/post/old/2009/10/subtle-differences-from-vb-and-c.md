---
title: "Subtle differences from VB and C"
description: ""
date: 2009-10-15T04:00:37+02:00
draft: false
tags: [NET framework]
categories: [NET framework]
---
For those who works like me with both languages, sometimes we can encounter some subtle differences between VB and C#. Take this code in VB

{{< highlight csharp "linenos=table,linenostart=1" >}}
Module Module1

    Private Function NormalizeRank(ByVal userRank As Integer) As Integer
        Return CType(Math.Ceiling(Math.Min(userRank / 20, 5.0)), Integer)
    End Function

    Sub Main()

        For value As Integer = 0 To 101
            Console.WriteLine("{0} normalized is {1}", value, NormalizeRank(value))
        Next

    End Sub

End Module{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

Is a very stupid piece of code that is supposed to take a value in the range 0..100 and normalize in the new interval [0..5], if the user pass a value higher than 100 the result must be 5. We expect value from 1 to 20 to be transformed into 1, values from 21 to 40 to be transformed to 2 and so on. If you run this code you find that the result is expected one. Now suppose you need to translate this function to C#, probably the first thing you can write is this one.

{{< highlight csharp "linenos=table,linenostart=1" >}}
private static Int32 Normalize(Int32 rank)
{
    return (Int32)Math.Ceiling(Math.Min(rank / 20, 5.0));
}

static void Main(string[] args)
{
    for (int value = 0; value < 101; value++)
    {
        Console.WriteLine("{0} normalized is {1}", value, Normalize(value));
    }
}{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

If you think that this is correct, try to run the code, and find this result.

{{< highlight csharp "linenos=table,linenostart=1" >}}
0 normalized is 0
1 normalized is 0
2 normalized is 0
3 normalized is 0
4 normalized is 0
5 normalized is 0
6 normalized is 0
7 normalized is 0
8 normalized is 0
9 normalized is 0
10 normalized is 0
11 normalized is 0
12 normalized is 0
13 normalized is 0
14 normalized is 0
15 normalized is 0
16 normalized is 0
17 normalized is 0
18 normalized is 0
19 normalized is 0
20 normalized is 1
21 normalized is 1
22 normalized is 1
23 normalized is 1
24 normalized is 1{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

If you wonder why the normalization of a number like 2 is zero you need to think to the meaning of the operator / in both languages. In Visual Basic it means â€œFloating point divisionâ€ while in C# the type of the operation is determined by the operands. so *2 / 20 in vb is 0.1 while 2 / 20 in C# is 0.*To solve this problem you need to write something like this

{{< highlight csharp "linenos=table,linenostart=1" >}}
private static Int32 Normalize(Int32 rank)
{
    return (Int32)Math.Ceiling(Math.Min(rank / 20.0, 5.0));
}{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

Now since 20.0 is a double, the compiler will emit a floating point division.

Alk.

Tags: [C#](http://technorati.com/tag/C#)
