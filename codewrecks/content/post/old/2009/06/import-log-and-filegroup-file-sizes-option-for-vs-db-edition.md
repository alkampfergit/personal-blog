---
title: "Import log and filegroup file sizes option for Vs Db edition"
description: ""
date: 2009-06-26T05:00:37+02:00
draft: false
tags: [NET framework]
categories: [NET framework]
---
In [previous post](http://www.codewrecks.com/blog/index.php/2009/06/26/vs-database-edition-pay-attention-to-file-size-when-you-import-db/) I deal with file size in VS DB edition. To avoid this problem, (as my friend [Lorenzo](http://www.geniodelmale.info/) pointed me out), when you import the database structure, with the Database Project wizard, you must not select the â€œImport log and filegroup file sizeâ€.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2009/06/image-thumb41.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2009/06/image41.png)

If you deselect this option the import wizard does not check the actual file size of the database that is being imported.

alk.

Tags: [Visual Studio Database Edition](http://technorati.com/tag/Visual%20Studio%20Database%20Edition)
