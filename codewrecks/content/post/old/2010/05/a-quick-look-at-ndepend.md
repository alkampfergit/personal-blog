---
title: "A quick look at NDepend"
description: ""
date: 2010-05-03T12:00:37+02:00
draft: false
tags: [NDepend]
categories: [Tools and library]
---
[NDepend](http://www.ndepend.com/) is a must have tool for people that manages seriously.NET projects, because it give you an overwhelming amount of information and metrics with few clicks. A complete tour of NDepend is really difficult to do, but I want to highlight what you got when you analyze a complex project, because NDepend can really save you a lot of troubles :).

After you load an entire project you can immediately see errors and warning

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2010/05/image_thumb.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2010/05/image.png)

in this picture you can see that the assembly Castle.Core is referenced by several assemblies, but in different version. This is a very interesting information, because in complex project it can happen that references becomes corrupted, and different assemblies references different version of the very same library. These kind of errors usually shows up only during runtime when the program crash looking for a specific assembly.

Another killer feature of NDepend is the ability to do query against code. In CQL Queries panel you can find some common queries against your code, subdivided in areas.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2010/05/image_thumb1.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2010/05/image1.png)

In this picture I've highlighted the CodeQuality/Type Metrics queries and I've selected Types with too many field. This opens the following query

{{< highlight csharp "linenos=table,linenostart=1" >}}
WARN IF Count > 0 IN SELECT TOP 10 TYPES
WHERE NbFields > 20
AND !IsEnumeration
ORDER BY NbFields DESC
{{< / highlight >}}

This is a query expressed with a specific NDepend syntax. You can find a list of all the metrics [here](http://www.ndepend.com/Metrics.aspx), and you can create your query to quickly identifies class that satisfy specific conditions. Some warning are most useful than other, I like very much all those one contained in.NET Framework usage, that can spot wrong usage of the framework such as throwing the wrong exception type etc. The good stuff about CQL is that the query are completely customizable and you can find a lot of details [here](http://www.ndepend.com/CQL.htm) ([http://www.ndepend.com/CQL.htm](http://www.ndepend.com/CQL.htm "http://www.ndepend.com/CQL.htm"))

Once the analysis is done a report is created in HTML format, so everyone can look at it with no problem. At the very beginning of the project there is a quick report with some general metrics.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2010/05/image_thumb2.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2010/05/image2.png)

These number can quickly give an idea of the size of the project. Then if you scroll down you can find these numbers for each one of analyzed assembly. Then you have the NDEpend View, where each class and namespace are represented as white bowl.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2010/05/image_thumb3.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2010/05/image3.png)

This kind of graph can quickly identify the relative size of the various assemblies namespaces and classes. Then it comes the amazing [Assemblies Abstractness vs intability](http://www.hanselman.com/blog/ExitingTheZoneOfPainStaticAnalysisWithNDepend.aspx) that gives a quick view on how much your classes are coupled togheter. This is a very complex graph to understand, but it can be read in this way. Lower left part of the graph is composed by assembly that are considered â€œStableâ€ in the way that a lot of other types depends on them ant it does not use interfaces or abstract types. Code in that part of the graph cannot be modified because a lot of code have a strong dependance to it.

Code in upper right part is code that is very abstract, very extensible but no code depends on it, so it is Useless. Generally the graph is subdivided into green orange and red zone, and you usually want your code to be located in the green part.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2010/05/image_thumb4.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2010/05/image4.png)

In project I've analyzed I have a couple of assemblies in the zone of pain (I do not worry about them, because they are the Entities of my project and I know that they are there :). All the other projects are going quite well because I've used DI and IOC extensively, so I have loose coupling between types.

After this graph NDepends lists for each one of the assembly the list of dependencies, both Depends on and Is referenced by. Then you can find the resul of all CQL queries that contains warning of code.

In the end NDepend can really give you a good insight view on your project, and just with few click :)

alk.
