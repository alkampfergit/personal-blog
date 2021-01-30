---
title: "Mapping a boolean field to char in nhibernate"
description: ""
date: 2008-05-08T02:00:37+02:00
draft: false
tags: [Nhibernate]
categories: [Nhibernate]
---
When you work with legacy database is not infrequent that boolean value are mapped to char(1) field in databse, with Y/N or 0/1 or some other chars. In the literature there are a lot of solution, you can find for example a discussion [here](http://forum.hibernate.org/viewtopic.php?t=980891&amp;highlight=boolean+char). When you use a user type to handle this kind of situation when you build HQL query you cannot use true or false in condition, for example

Select o from Orders where o.IsProcessed = false

This usually lead to a SQL error because you are trying to compare a char(1) column with the value false. The solution is to use this setting in the setting file.

{{< highlight xml "linenos=table,linenostart=1" >}}
<add key="hibernate.query.substitutions" value="true 1, false 0" />{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

This permits to substitue the value true with the literal 1 and false with the literal 0,  but you can use whatever constant you want.

Alk.

Tags: [NHibernate](http://technorati.com/tag/NHibernate) [Boolean To Char Mapping](http://technorati.com/tag/Boolean%20To%20Char%20Mapping)
