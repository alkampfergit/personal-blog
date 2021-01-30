---
title: "Unable to expose Symbol Server with IIS"
description: ""
date: 2014-06-01T13:00:37+02:00
draft: false
tags: [Symbols]
categories: [Team Foundation Server]
---
Sadly enough, I verified in these years that many people using TFS ignore what a symbol server is. For all those readers that does not know what a symbol server is, I suggest to  **read my previous article that explains** [**how to manage a symbol server on Azure or on-premises VM with TFS and IIS**](http://www.codewrecks.com/blog/index.php/2013/07/04/manage-symbol-server-on-azure-or-on-premise-vm-and-tf-service/).

Recently I’ve got some feedback from people that were not able to setup everything correctly when is time to expose Symbol Server with IIS. TFS indexes sources correctly and everything is ok if they use a network share, but when the server is exposed with IIS it seems not working.

First of all you need to understand that  **there is nothing magical behind a symbol server is a simple directory with a predetermined files structure.** From a pratical point of view, Visual Studio reads a Guid in the Dll (or exe) to identify the specific version of the file and then try to get corresponding.pdb file from all available symbol servers using naming convention. If you want some more details, there is a really [good blog post by Ed Blankenship](http://www.edsquared.com/2011/02/12/Source+Server+And+Symbol+Server+Support+In+TFS+2010.aspx) that explains everything with great details.

To troubleshoot why your symbol server is not working you can simply use [Fiddler](http://www.telerik.com/fiddler), (a web proxy used for debugging) that can intercepts all the call that Visual Studio issues to various symbol servers. **From fiddler you will be able to verify if Visual Studio is really calling your IIS site and the exact response from the server**. One of the most common error is forgetting to tell IIS to serve.pdb extension with correct MIME type. In default configuration IIS returns a 404 if you try to download a.pdb file. You can enable directory browsing and then simply try to download one of the.pdb files of your server from a standard browser, if it got downloaded correctly your symbol server works correctly, but if the browser got a 404 is time to go on the server, and add the correct MIME type for.pdb extension.

Just go to IIS management console and open MIME Types.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2014/06/image_thumb.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2014/06/image.png)

Then verify if.pdb is listed as a known extension, if not press add and add.pdb extension with a  MIME type of application/octet-stream.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2014/06/image_thumb1.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2014/06/image1.png)

Everything should work now.

Gian Maria.
