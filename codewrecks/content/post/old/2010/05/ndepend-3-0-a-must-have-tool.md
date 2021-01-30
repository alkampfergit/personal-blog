---
title: "NDepend 30 a must have tool"
description: ""
date: 2010-05-20T08:00:37+02:00
draft: false
tags: [NDepend]
categories: [Tools and library]
---
Iâ€™m exploring the new capabilities of NDepend 3.0, and the very first interesting stuff is that Iâ€™m now able in VS2010 to add a NDepend project to the solution, so Iâ€™m able to manage ndepend project properties inside from VS.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2010/05/image_thumb13.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2010/05/image13.png)

I can drag and drop project inside the windows to add and remove project from the analysis, and this is very productive. After you run the analysis you can navigate into the result, as an example you can choose from the NDepend menu the CQL explorer

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2010/05/image_thumb14.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2010/05/image14.png)

The CQL language is one of the feature I like most, because they immediately points out possible problems in the code. The query that are included with a base project are good, but the best stuff is that you have intellisense to modify them

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2010/05/image_thumb15.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2010/05/image15.png)

As an example if I run the query to identify the top 10 types that have more than 20 methods I found a lot of Dataset classes, So I modify the CQL query adding this

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2010/05/image_thumb16.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2010/05/image16.png)

I decided to exclude every class that have the string dataset in the name or namespace, and report classes. Now I can save the query and find the real types that can give me problem :). And this is only the surface of what NDepend can do for you.

Alk.
