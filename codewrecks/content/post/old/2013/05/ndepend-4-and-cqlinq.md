---
title: "NDepend 4 and CQLinq"
description: ""
date: 2013-05-07T18:00:37+02:00
draft: false
tags: [NDepend]
categories: [Tools and library]
---
You already know that [I’m a fan of NDepend](http://www.codewrecks.com/blog/index.php/2010/11/03/ndepend-to-the-resque/) because  **it is a really useful tool to have a deep insight on your code and especially to spot out troublesome areas in your project**.

With version 4 it added a really cool capability called [CQLinq](http://www.ndepend.com/doc_cqlinq_features.aspx) or Code Query Linq; an amazing feature that permits you to query your code using LINQ stile queries. Basically after I’ve analyzed a solution I got presented with a simple dialog that asked me what I’m interested to do primarily with the result of the analysis.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2013/05/image_thumb.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2013/05/image.png)

This feature is really amazing because you can query your code to find almost everything. It would be really long to show you every capability of CQLinq, you can read about it in [official documentation](http://www.ndepend.com/doc_cqlinq_syntax.aspx), but I want to give you just a taste of what you can achieve with it.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2013/05/image_thumb1.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2013/05/image1.png)

Here I’m  **simply selecting all the methods that contains more than 30 lines of code and in the select part I’m interested in the number of comment lines**. Long methods are painful, but if you find a method of 40 lines with 30 lines of comment you are in trouble, because if a developer put so much comment in long method, surely there is some weird logic in it.

CQLinq is full of interesting features, as an example if you select from JustMyCode.Methods you are actually selecting only your code, and not code generated from UI Designer. This will permit you to focus primary on your code and avoiding to have the result of the query polluted by Designer generated code.

 **NDepend designer fully support intellisense** and this really helps you to achieve the result in really little time, the result is immediately shown below the query as soon as the query compiles, and if you made some mistake you are immediately presented with a simple list of compiling errors that makes you understand what is wrong with the query.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2013/05/image_thumb2.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2013/05/image2.png)

As usual I think that NDepend is a must-to-have tool especially if you need to find problem in legacy code. I strongly suggest you to check out all the possibility on [official documentation page](http://www.ndepend.com/doc_cqlinq_features.aspx), to have an idea of the capability of the tool.

You can also download a trial of the product to try out by yourself in your project.

Gian Maria.
