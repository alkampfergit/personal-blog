---
title: "Visual Studio Database edition How to find objects that reference other objects"
description: ""
date: 2009-06-23T06:00:37+02:00
draft: false
tags: [NET framework,General]
categories: [NET framework,General]
---
Another feature of Visual Studio Database Edition I cannot live without, is the possibility to find all objects that references a specific table or stored procedure etc. To see a dependency for an object simply click on the SchemaView and then you can right click on a table, and choose â€œView Dependenciesâ€

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2009/06/image-thumb30.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2009/06/image30.png)

This command will open a menu that shows all objects that references this specific object, as well as all database objects that are referenced by this object. This function is of invaluable use when you need to change or modify something, and gives you an invaluable sight on dependency between database structure.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2009/06/image-thumb31.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2009/06/image31.png)

In this specific situation I removed some old features from the code, and I want also to remove all objects in database that are related to those features. Since I know that these feature are related to three tables, I can simply check all dependencies of those tables, that and verify that I'm not breaking anything. When I'm sure I can remove tables files from the solution.

After table files are deleted, I return in the Schema view. Now I can open the â€œOrphaned Objectsâ€ to view all object that are orphan.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2009/06/image-thumb32.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2009/06/image32.png)

This is an invaluable help because you immediately view all objects that are now orphan because I deleted some tables. As you can see in â€œorphaned Objectsâ€ you can view only keys, constraints, etc, and you do not see stored or view. If you watch in schema view to stored procedure section you can find that each stored that references one of those removed table is marked as â€œwarningâ€

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2009/06/image-thumb33.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2009/06/image33.png)

If I build the project I obtain a lot of errors, because I have stored and views that reference missing tables.

I simply check again each stored and view, some of them are to be deleted, and some other needs only modifications. Thanks to database edition I know when I have finished work because until I have a single object that references missing object the project will not compile. Finally I fire my database tests to verify that everything is still working.

If something went wrong (because at a certain point you find that you should not removed those tabled because they are still used somewhere), you can simply undo everything and starts again the process. The great advantage working with Database Edition is that you works only with  local files, and you can commit changes to databases only when you are really sure that everything is ok. Now database can be managed like other code, you modify it, you test it, and until you does not check in, nothing gets really changed.

alk.

Tags: [Visual Studio Database Edition](http://technorati.com/tag/Visual%20Studio%20Database%20Edition)
