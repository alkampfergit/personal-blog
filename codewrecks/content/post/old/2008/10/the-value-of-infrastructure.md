---
title: "The value of infrastructure"
description: ""
date: 2008-10-14T11:00:37+02:00
draft: false
tags: [General]
categories: [General]
---
The infrastructure of a project is really important for a lot of reasons, first of all it should make possible to accomplish standard tasks with simple code avoiding duplication. Lets do a little example. In.NET if you want to issue a simple query to a database you really have to do a lot of things. First of all you need to create a Connection object, then create a Command object, populate the command with query and parameter, open the connection and execute the command. This seems to me quite complicate code to issue a simple SQL statement, and to avoid resource leak you need to correctly dispose the command and connection objects because both of them are IDisposable.

If this still seems not too complicated you should realize that if you work with SqlConnection or OracleConnection you are actually binding yourself to a specific database, and if someday you need to change db provider you will have hard days.

A possible solution is to build a little infrastructure that helps you to manage issuing queries to the database without worrying of the provider type and without the need of disposing anything. With a little effort you can build a little DataAccess static class that permits to issue query with fluent interface.

{{< highlight sql "linenos=table,linenostart=1" >}}
DataAccess.OnDb("main")
   .CreateQuery("insert into AnEntity (id, name, value) values ({pid}, {pname}, {pvalue})")
   .SetInt32Param("pid", newId)
   .SetStringParam("pname", "xxx")
   .SetInt32Param("pvalue", 108)
   .ExecuteNonQuery();{{< / highlight >}}

<!-- Code inserted with Steve Dunn's Windows Live Writer Code Formatter Plugin.  http://dunnhq.com -->

Here it is, the OnDb() method permits me to choose the db I want to issue the query against. Since in many projects of mine I deal with multiple database, I simply abstract the configuration with a IConfigurationRepository interface, I simply build a concrete class that look into application configuration file, and when I write DataAccess.OnDb(*Dbname*) I mean that I want to issue a query on the database identified by the connection string named DbName. With this approach I can set multiple connection string in app.config and I can choose between them with great easy. After the OnDb I can call CreateQuery method, used to specify the SQL query I want to execute, all the parameters are in the form {parametername} so the query can work with oracle that want :parametername or Sql Server that needs @parametername. Then some methods to populate the parameters, and finally a call to ExecuteNonQuery actually executes the query and returns the result.

With this approach I centralized the execution of all queries, I'm database vendor independent, it is not possible that I forget to call dispose on anything. This type of infrastructure permits to write simple code, minimizing the chances of errors.

Alk.

Tags: [.NET Framework](http://technorati.com/tag/.NET%20Framework) [Infrastructure Code](http://technorati.com/tag/Infrastructure%20Code) [Data Access](http://technorati.com/tag/Data%20Access)

<script type="text/javascript">var dzone_url = 'http://www.codewrecks.com/blog/index.php/2008/10/14/the-value-of-infrastructure/';</script><script type="text/javascript">var dzone_title = 'The value of infrastructure';</script><script type="text/javascript">var dzone_blurb = 'The value of infrastructure';</script><script type="text/javascript">var dzone_style = '2';</script><script language="javascript" src="http://widgets.dzone.com/widgets/zoneit.js"></script> 

[![DotNetKicks Image](http://www.dotnetkicks.com/Services/Images/KickItImageGenerator.ashx?url=http://www.codewrecks.com/blog/index.php/2008/10/14/the-value-of-infrastructure/&amp;bgcolor=0080C0&amp;fgcolor=FFFFFF&amp;border=000000&amp;cbgcolor=D4E1ED&amp;cfgcolor=000000)](http://www.dotnetkicks.com/kick/?url=http://www.codewrecks.com/blog/index.php/2008/10/14/the-value-of-infrastructure/)
