---
title: "Location of your vsix files in experimental hive during plugin development"
description: ""
date: 2012-08-23T19:00:37+02:00
draft: false
tags: [Plugin,Visual Studio]
categories: [Visual Studio]
---
When you are developing Visual Studio plugin, your project is usually  **configured to launch a special instance of Visual Studio** under the Visual Studio debugger (excellent example of dogfooding), this special instance is called experimental HIVE.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2012/08/image_thumb1.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2012/08/image1.png)

 ***Figure 1***: *Configuration of a standard VSIX project to test your addin*

As you can see the project is configured to start Visual Studio as external program to be debugged and  **it is started with the option /rootsuffix Exp to start in Experimental Hive**. This permits to test plugin in a configuration of Visual Studio that is isolated from your standard instance, think as an example if you develop a plugin that makes Visual Studio instable and you cannot open Visual Studio due to this addin.

If you want to remove or look at current configuration of experimental hive you can go to folder

*C:\Users\username\AppData\Local\Microsoft\VisualStudio\*

You should see all configuration folder for the various editions of Visual Studio, those that ends with Exp are related to experimental hive.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2012/08/image_thumb2.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2012/08/image2.png)

 ***Figure 2***: *Folders related to experimental hive.*

You can now enter in experimental hive folder and in extensions folder you should see all of your plugin that are under development, now you can remove them if you want to restore everything to the original value.

Alk.
