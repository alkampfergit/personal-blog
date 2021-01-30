---
title: "Expression Tree Visualizer"
description: ""
date: 2008-04-10T01:00:37+02:00
draft: false
tags: [LINQ]
categories: [LINQ]
---
Microsoft created for you an expression tree visualizer, it is contained into the [C# Samples](http://code.msdn.microsoft.com/csharpsamples/Release/ProjectReleases.aspx?ReleaseId=8) pack and it is very useful. The only thing that I do not like very much is that it give you too much information, and it is quite confused to really understand how the expression is formed. To address the problem I created another visualizer based on my expression tree dumper I made last month. You can install both visualizer as you can see from this picture

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2008/04/image-thumb1.png)](https://www.codewrecks.com/blog/wp-content/uploads/2008/04/image1.png)

If you use the original expression tree visualizer even this simple expression X == 10 gaves a lot of information (left picture), my visualizer gaves a sketch of the expression, as well as the order of the node if you traverse the tree in postorder (Right picture). As you can see my visualizer shows only the relevant information and the structure of expression is more clear.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2008/04/image4-thumb.png)](https://www.codewrecks.com/blog/wp-content/uploads/2008/04/image4.png)

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2008/04/image-thumb2.png)](https://www.codewrecks.com/blog/wp-content/uploads/2008/04/image2.png)

You can find the code in this subversion repository [[http://nablasoft.googlecode.com/svn/trunk/Linq/ExpressionTree](http://nablasoft.googlecode.com/svn/trunk/Linq/ExpressionTree "https://nablasoft.googlecode.com/svn/trunk/Linq/ExpressionTree")]

Alk.

Tags: [Expression Tree](http://technorati.com/tag/Expression%20Tree) [Visualizers](http://technorati.com/tag/Visualizers) [LINQ](http://technorati.com/tag/LINQ)
