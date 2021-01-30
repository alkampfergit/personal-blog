---
title: "Running NUnit and xUnit tests in TFS11 build"
description: ""
date: 2012-03-05T06:00:37+02:00
draft: false
tags: [Nunit,Testing,TFS11,Unit Testing]
categories: [Team Foundation Server,Testing]
---
I’ve blogged in the past various solution to run NUnit tests during a TFS build, and now it is time to make it again for TFS11, but this time it is incredibly simple, because the new Test Runner supports multiple frameworks, so it works *almost* automatically.

You can read from [Peter Provost blog](http://www.peterprovost.org/blog/post/Visual-Studio-11-Beta-Unit-Testing-Plugins-List.aspx) that actually we have three plugin for UTE (Unit Test Explorer) available: Nunit, xUnit and HTML/JAvascript, they are simple.vsix file (Visual Studio Extension), that you can download, run, and voilà, your xUnit and NUnit tests are runnable from Visual Studio.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2012/03/image_thumb.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2012/03/image.png)

 ***Figure 1***: *The new UTE is able to run Unit Tests from multiple framework, because it is extendible*

Now if you create a build against this solution, you probably will be disappointed by the fact that the build only runs MStest ignoring tests supported by an external plugin.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2012/03/image_thumb1.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2012/03/image1.png)

 ***Figure 2***: *Build result shows that only 6 test were run, xUnit and NUnit tests are ignored*

[This blog post](http://blogs.msdn.com/b/aseemb/archive/2012/03/03/how-to-make-your-discoverer-executor-extension-visible-to-ute.aspx) explain the reason, if you are on 64 bit machine, the vsix installer is not able to make the Extension visible to build controller, so you need to do a little extra step. First of all locate the folder of the two extensions under the plugin for the current user

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2012/03/image_thumb2.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2012/03/image2.png)

 ***Figure 3***: *UTE plugins are located in the standard plugin folder for Visual Studio*

This location may vary, in my system it installed only for current user so they are on my profile folder, if you do not find the extension there you can simply search for the dll NUnit.VisualStudio.TestAdapter.dll into your Hard Disk. Once you found xUnit and NUnit UTE plugin folder, you should copy all dll inside a source controlled folder.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2012/03/image_thumb3.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2012/03/image3.png)

 ***Figure 4***: *All UTE plugin assemblies are now in a source controlled folder*

Finally go to Team Explorer –&gt; Build –&gt; Actions –&gt; Manage Build Controllers and specify that all custom assemblies are located inside that folder

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2012/03/image_thumb4.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2012/03/image4.png)

 ***Figure 5***: *Configure the test controller specifying the location of all the assemblies that contains build extension*

Now you can queue another build, and this time all tests should be run.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2012/03/image_thumb5.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2012/03/image5.png)

 ***Figure 6***: *Now all 16 tests were run*

As you can see, with TFS and VS11 running unit test from various Unit Test Frameworks is really easy.

Alk.
