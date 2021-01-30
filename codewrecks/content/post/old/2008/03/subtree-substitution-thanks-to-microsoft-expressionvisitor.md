---
title: "Subtree substitution thanks to microsoft ExpressionVisitor"
description: ""
date: 2008-03-05T01:00:37+02:00
draft: false
tags: [NET framework]
categories: [NET framework]
---
Previous part: [Part1](http://www.nablasoft.com/Alkampfer/?p=141), [Part2](http://www.nablasoft.com/Alkampfer/?p=145), [Part3](http://www.nablasoft.com/Alkampfer/?p=149).

One of the most important feature of the microsoft ExpressionVisitor I’ve told you before is the ability to substitute expression. Let’s for example see how the VisitBinary is implemented.

{{< highlight chsarp "linenos=table,linenostart=1" >}}
 1 protected virtual Expression VisitBinary(BinaryExpression b)
 2 {
 3     Expression left = this.Visit(b.Left);
 4     Expression right = this.Visit(b.Right);
 5     Expression conversion = b.Conversion == null ? null : this.Visit(b.Conversion);
 6     if (left != b.Left || right != b.Right || conversion != b.Conversion)
 7     {
 8         if (b.NodeType == ExpressionType.Coalesce && b.Conversion != null)
 9             return Expression.Coalesce(left, right, conversion as LambdaExpression);
10         else
11             return Expression.MakeBinary(b.NodeType, left, right, b.IsLiftedToNull, b.Method);
12     }
13     return b;
14 }{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

As you can notice, in the line 6 the code is checking if the subtree returned from the left or right branch evaluation are different from the original one, if yes it simply substitute the expression. This is important because we can build visitor that actually replaces part of the tree making traversal simplier. One of the most interesing application is given in this [looooong tutorial](http://blogs.msdn.com/mattwar/archive/2007/10/09/linq-building-an-iqueryable-provider-part-viii.aspx). Here the author use extensively this feature to build a mini linq to sql provider.

The rule of thumb is, it is not necessary to walk the Expression Tree only one time, it is possibile to traverse it multiple times, each time modify to deal in each pass with a simplier tree.

alk.

Technorati Tags: [Expression Tree](http://technorati.com/tags/Expression%20Tree),[LINQ](http://technorati.com/tags/LINQ),[IQueryable](http://technorati.com/tags/IQueryable)
