---
title: "Create web deploy package during a tfs 2010 build"
description: ""
date: 2010-06-07T14:00:37+02:00
draft: false
tags: [TFS Build]
categories: [Team Foundation Server]
---
Web projects in VS2010 has a great flexibility when it is time to deploy to the server, and it has a great option to generate a Deploy Package with a single click

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2010/06/image_thumb8.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2010/06/image8.png)

But if you build a web project with a tfs2010 build you can verify that in the drop folder you simply have the published web site that contains only all the files, and not package to install

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2010/06/image_thumb9.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2010/06/image9.png)

To generate the deploy package during a build you need to set to true a couple of msbuild properties

* **/p:CreatePackageOnPublish=true /p:DeployOnBuild=true** *

These two properties ask to MSBuild to generate the build deployment package during the build. You can put them in the MSBuild Arguments part of the build definition, it is really simple

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2010/06/image_thumb10.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2010/06/image10.png)

If you run this build, you can verify from msbuild log that the package was generated.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2010/06/image_thumb11.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2010/06/image11.png)

The good part is that if you look at the drop folder you can notice that the build automatically copied the Package into the output.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2010/06/image_thumb12.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2010/06/image12.png)

This is good because you will end with an installable web site always available in the drop folder.

alk.
