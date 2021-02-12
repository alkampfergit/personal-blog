---
title: "Work with castle and NHibernate trunk"
description: ""
date: 2010-02-26T17:00:37+02:00
draft: false
tags: [Castle,Nhibernate]
categories: [Castle,Nhibernate]
---
Working with open source software is fun, but sometimes can be difficult. Take as example castle and Nhibernate, since castle references nh with the NHIntegration facility, and at the same time NH references castle for Dynamic Proxy.

A good way to survive this chaos, is working with the trunk, as I usually do, but compiling everything can be quite complex, but we are lucky because we have a project called [Horn](http://github.com/dagda1/horn_src) that does everything for you.

First of all you need to install [nsysgit](http://code.google.com/p/msysgit/downloads/list) first of all you need to grab the latest source of horn with the comand *git clone [git://github.com/dagda1/horn\_src.git](git://github.com/dagda1/horn_src.git "git://github.com/dagda1/horn_src.git")*. Once you get the source, you need to modify a source file called /src/horn.console/program.cs, in this file there is a function called GetRootFolderPath that ends with a line like

{{< highlight csharp "linenos=table,linenostart=1" >}}
var ret = new DirectoryInfo(rootFolder);
{{< / highlight >}}

This line needs to be modified with the following line

{{< highlight csharp "linenos=table,linenostart=1" >}}
var ret = new DirectoryInfo(@"d:\osdevelop\horn_src\" + PackageTree.RootPackageTreeName);
{{< / highlight >}}

clearly the D:\osdevelop\horn\_src is my physical path where git extracted horn source code. Now you can go project root and run the HornBuild.bat. If the compilation is successful the horn library was compiled correctly, so you can go to /src/build/net-3.5/debug and you should find a program called horn.exe. Go to this location with a command line and type

{{< highlight csharp "linenos=table,linenostart=1" >}}
horn -install:castle.facilities.nhibernateintegration
{{< / highlight >}}

with this command horn try to build everything needed for castle facilities nhibernate integration, so horn contacts all various repositories of all the needed libraries, it downloads the latest source and compiles everything. IF everything is gone good, you can simply go to the directory.horn\result and find all the dll's :) without worrying about order of compilation, source repositories etc etc.

Alk.

Tags: [NHibernate](http://technorati.com/tag/NHibernate)

Tags: [Castle](http://technorati.com/tag/Castle)
