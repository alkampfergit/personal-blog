---
title: "First Visual studio 2010 addin"
description: ""
date: 2010-05-22T09:00:37+02:00
draft: false
tags: [Addin,Visual Studio]
categories: [Visual Studio]
---
[**<font size="1">Code Downloadable Here</font>**](http://www.codewrecks.com/files/myaddin1.zip) **<font size="1">.</font>** Visual Studio is really a complex and big product, but it is amazing to see how simple it is to write an addin to extend its functionality. First of all we have a dedicated project type for writing an add-in from inside Visual Studio (dogfooding)

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2010/05/image_thumb18.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2010/05/image18.png)

Choosing the Visual Studio Add-in a Wizard helps you to decide the type of the addin.The wizard asks for the language to use, and some information, like if the addin should be loaded at startup and if it must be listed under the tools menu. After you created the project you can go to project properties and verify that, in the debug pane, the project is setup to start devenv.exe as â€œstart External Programâ€

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2010/05/image_thumb19.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2010/05/image19.png)

The default arguments are the  **/resetaddin MyAddin1.Connect** , but I also added the [/rootsuffix Exp](http://msdn.microsoft.com/en-us/library/bb166560%28VS.80%29.aspx) to start with the [Experimental Registry Hive](http://msdn.microsoft.com/en-us/library/bb166560%28VS.100%29.aspx). This is needed to prevent that the addin you are developing will mess with normal settings of Visual Studio. Now you can simply press F5 and you should see another instance of Visual Studio that will opens up, and your new command should be listed in the tools menu. No modification is made to the standard Visual Studio settings, so you are sure that you cannot damage VS during development of your addin.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2010/05/image_thumb20.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2010/05/image20.png)

The good point is that you obtained this without a single line of code and with no effort. Now I want to execute some code just to understand how to interact with the VS IDE.

I want to develop an addin that simply iterate through all solution projects and files and dump all names to the output console.

The code for doing this is really simple, you need to locate the connect.cs class, and write code inside the Exec method.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2010/05/image_thumb21.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2010/05/image21.png)

As you can see it is really simple to interact with VS IDE; thanks to \_applicationObject I can interact with the solution and enumerate projects, but I can also obtain a reference to the â€œGeneralâ€ pane of the output windows, to write string to the output console. Now I can simply dump solution name, then iterate into all the projects dumping project name and project Items. The DumpFiles method is a really simple recursive method to iterate into all project contents.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2010/05/image_thumb22.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2010/05/image22.png)

The really amazing stuff is that you can setup a breakpoint in code, press F5, go to the newly opened Visual Studio instance (Experimental Hive), load a solution, invoke your command and theh breakpoint will be hit in the original instance of VS :) you are debugging Visual Studio with the Visual Studio debugger, with all the features enabled, like for example [Intellitrace](http://msdn.microsoft.com/en-us/library/dd264915.aspx) or pinning variable values to the windows, or doing whatever you can do in a standard debugging session.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2010/05/image_thumb23.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2010/05/image23.png)

The ability to use intellitrace is AMAZING because it helps you a lot to understand what is happening and  **what is happened** inside VS. In the above screenshot I put a breakpoint into the function that output file name and traverse project tree, then I continue my debug session pressing F5 or F10, but with intellitrace I can simply look at variable values for each execution of the recursive iteration, as well as looking at events. In that example I can see that visual studio is actually accessing physical solution files :) but I can move in the past to understand the values of the Item object in each interation.

When the function finishes to execute I can verify in the debugged VS that the addin really did what I'm expecting, so i take a look to the output windows in the General pane. In this example I'm dumping the content of a [Database Project](http://msmvps.com/blogs/deborahk/archive/2010/05/02/vs-2010-database-project-an-introduction.aspx) where I imported the Northwind structure and a simple empty C# project.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2010/05/image_thumb24.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2010/05/image24.png) [![image](https://www.codewrecks.com/blog/wp-content/uploads/2010/05/image_thumb25.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2010/05/image25.png) [![image](https://www.codewrecks.com/blog/wp-content/uploads/2010/05/image_thumb26.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2010/05/image26.png)

As you can see, with very few lines of code you are able to write an addin that explores solutions files, and with a fantastic Debugging Experience.

[**<font color="#800000" size="2">Code Downloadable Here</font>**](http://www.codewrecks.com/files/myaddin1.zip) **<font color="#800000" size="2">.</font>** Alk.
