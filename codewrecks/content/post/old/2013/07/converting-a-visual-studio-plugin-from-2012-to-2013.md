---
title: "Converting a Visual Studio plugin from 2012 to 2013"
description: ""
date: 2013-07-29T16:00:37+02:00
draft: false
tags: [Plugin]
categories: [Visual Studio]
---
I’ve some little utilities for Visual Studio, born as a Macro and then converted to Plugin. Now that VS 2013 preview is out, I want to  **convert that addin to support the new version of Visual Studio** , so I can use my utilities even in VS 2013.

The whole conversion process is really straightforward, first of all I create a branch of the original VS2012 version of the plugin, just to be able to compile again with VS 2012. This is nothing more than having a backup of the project.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2013/07/image_thumb43.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2013/07/image43.png)

 ***Figure 1***: *2013 version is just a branch of the 2012 version*

Now if you  **open project file with VS 2013 it will ask to convert the project** , just choose yes and you are done, the project is converted for VS 2013. Unfortunately if you compile the project and try to install the.vsix file you will find that it does not install on VS 2013. You should simply  **edit the source.extension.vsixmanifest file telling that the addin supports newer version of VS** [![image](https://www.codewrecks.com/blog/wp-content/uploads/2013/07/image_thumb44.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2013/07/image44.png)

 ***Figure 2***: *Choose supported version of VS where this addin can be installed*

Now you can simple uninstall the old version from your VS 2012 version and simply install the new version, that now supports from VS 2010 to VS2013. If if double click the vsix file I can install the addin on all installed and supported versions.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2013/07/image_thumb45.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2013/07/image45.png)

 ***Figure 3***: *Your converted addin now support both 2012 and 2013 preview*

Working with Visual Studio SDK is really simple, and the upgrade procedure is a further confirmation of this fact. You can simply open the addin with the new Visual Studio Version, change supported version list and your addin is ready to be used in the new version.

Gian Maria.
