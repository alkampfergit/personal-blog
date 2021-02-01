---
title: "Red Gate Tools Sql Dependency Tracker"
description: ""
date: 2010-04-30T11:00:37+02:00
draft: false
tags: [Sql Server]
categories: [Tools and library]
---
I must admit that I really loves tools from [RedGate](http://www.red-gate.com) and recently I've discovered the [Sql Dependency Tracker](http://www.red-gate.com/products/SQL_Dependency_Tracker/index.htm), an exceptional tool to manage dependencies between objects in a database.

This tool is really great because with a few click you can have different graphs that represents dependency relation between objects in the database. I'm working on a legacy database, and I have two very old view that were replaced by another indexed view, that performs better and has better column names. We ported almost everything, but I need to know if some stored procedure or object still uses the old views. I simply open the Sql Dependency Tracker and immediately I found this graph

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2010/04/image_thumb30.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2010/04/image30.png)

That actually shows me that seven stored proceudures still reference one of these two old view. If you zoom in you can easily find details about the procedure, and you can also look at the code.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2010/04/image_thumb31.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2010/04/image31.png)

Another useful option is the ability to organize the result in different view, this is the Hierarchic on the northwind database

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2010/04/image_thumb32.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2010/04/image32.png)

The circular view give immediately a good idea on how objects are related toghether.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2010/04/image_thumb33.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2010/04/image33.png)

You can as an example look at how table view and stored procedure on a legacy database are organized.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2010/04/image_thumb34.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2010/04/image34.png)

This is a really interesting images, because it shows that there is an inner circle of core objects, surrounded by some other areas of the project.

You can also colorize different objects with different color, and with baloon view I can immediately spot central object of databases

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2010/04/image_thumb35.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2010/04/image35.png)

look at the above picture, there is clearli an object that is so related to others that is immediately visible :)

This tools is really useful also to familiarize with a new complex database because it permits to have a quick look on how objects are organized.

alk.
