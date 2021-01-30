---
title: "vsdbcmdexe overriding variable value"
description: ""
date: 2009-11-26T07:00:37+02:00
draft: false
tags: [Visual Studio Database Edition]
categories: [Visual Studio]
---
When you deploy a database project with the command line utility [vsdbcmd.exe](http://msdn.microsoft.com/en-us/library/dd193283.aspx) you may want to change the value of some variables of the project. Suppose youâ€™ve created a variable called Path1

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2009/11/image_thumb22.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2009/11/image22.png)

And you have used this variable to specify the location of the files

{{< highlight sql "linenos=table,linenostart=1" >}}
ALTER DATABASE [$(DatabaseName)]
    ADD FILE (NAME = [Northwind], FILENAME = '$(Path1)$(DatabaseName).mdf',{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

Now you want to decide at deploy time the physical location of your database. The main problem is that vsdbcmd.exe takes deploy variable from the Database.sqlcmdvars file, so if you want to change a value of a variable you have two options. The first is using some xpath knowledge to change the value in the Database.sqlcmdvars, since it is a simple xml file.

{{< highlight xml "linenos=table,linenostart=1" >}}
<?xml version="1.0" encoding="utf-8"?>
<SqlCommandVariables xmlns="urn:Microsoft.VisualStudio.Data.Schema.Project.SqlCmdVars">
  <Version>1</Version>
  <Properties>
    <Property>
      <PropertyName>Path1</PropertyName>
      <PropertyValue>C:\Temp\</PropertyValue>
    </Property>
   ...
</SqlCommandVariables>{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

With some Xpath knowledge you can change the value of the property Path1, suppose you change to v:\ (v is my ramdisk), then you run the vsdbcmd.exe and you will find that files are created indeed in the correct location

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2009/11/image_thumb23.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2009/11/image23.png)

If you do not like using XPath to change the configuration file, you can use a series of preconfigured files and swap before calling vsdbcmd.exe. Sadly the [documentation](http://msdn.microsoft.com/en-us/library/dd193283.aspx) states that you have an option to choose variable file

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2009/11/image_thumb24.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2009/11/image24.png)

But actually you get an error when you use it.

Alk.

Tags: [Visual Studio](http://technorati.com/tag/Visual%20Studio) [.Net](http://technorati.com/tag/.Net)
