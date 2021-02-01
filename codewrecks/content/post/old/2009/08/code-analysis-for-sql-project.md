---
title: "Code analysis for Sql Project"
description: ""
date: 2009-08-06T23:00:37+02:00
draft: false
tags: [CodeAnalysis]
categories: [Visual Studio]
---
I'm not a fanatic of Code Analysis, at least I know that it is quite impractical trying to remove all warning of fxcop analysis, but I strongly advice you to run code analysis on your code, and give it a shot from time to time. First of all is a good way to find potential bug, then you will always learn new and more standard way to write your code.

The good stuff about VSTS Db edition is that it contains code analysis even for your DB.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2009/08/image-thumb14.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2009/08/image14.png)

As an example of typical warning you get here is some example.

{{< highlight csharp "linenos=table,linenostart=1" >}}
Design : Data loss might occur when casting from VarChar(19) to DateTime.{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

Someone had designed a function where a datetime is passed and the function returns a varchar, but varchar(19) seems not to be big enough to contain the date.

{{< highlight sql "linenos=table,linenostart=1" >}}
Microsoft.Design : The shape of the result set produced by a SELECT * statement will change if the underlying table or view structure changes.{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

This one also is an important warning, since this code is into a table valued function, using a SELECT \* will change the shape of the returned table, so it is really better to specify all the field you needs and no more. Warning are subdivided by area, previous 2 are from Microsoft.Design, others are devoted to performance

{{< highlight csharp "linenos=table,linenostart=1" >}}
Microsoft.Performance : Nullable columns can cause final results to be evaluated as NULL for the predicate.{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

But there are more really interesting warning like this one.

{{< highlight csharp "linenos=table,linenostart=1" >}}
Microsoft.Performance : A column without an index that is used as an IN predicate test expression might degrade performance.{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

Since a Database Project contains everything about the Db, Visual Studio is able to spot problematic areas regarding missing index. The analysis is indeed quite deep

{{< highlight csharp "linenos=table,linenostart=1" >}}
Microsoft.Performance : A column in an expression to be compared in a predicate might cause a table scan and degrade performance.{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

While you surely not want to remove all of this warning, some of them are really interesting because they can spot potential problems in your database design.

Alk.

Tags: [Code Analysis](http://technorati.com/tag/Code%20Analysis) [Visual Studio Team System](http://technorati.com/tag/Visual%20Studio%20Team%20System)
