---
title: "Display complex information in TFS 2010 Build log"
description: ""
date: 2010-11-05T11:00:37+02:00
draft: false
tags: [TFS Build]
categories: [Tfs]
---
If you read [this post](http://blogs.msdn.com/b/jpricket/archive/2009/12/21/tfs-2010-displaying-custom-build-information-in-visual-studio.aspx) you learn how to show custom informations in a build, and this is one of the coolest stuff you can do to improve reporting from the buil. In the original example Jason shows how to show informations of a standard object called PlatformConfiguration.

This is very useful if you need to track some custom and complex information during a build from a Custom Action, and you want it to be showed with a specific interface in the log, like a superwarning :) or some information that need to be really evident in the log. First of all create a class that will contains all the data you want to show.

[![SNAGHTMLb3780f](https://www.codewrecks.com/blog/wp-content/uploads/2010/11/SNAGHTMLb3780f_thumb.png "SNAGHTMLb3780f")](https://www.codewrecks.com/blog/wp-content/uploads/2010/11/SNAGHTMLb3780f.png)

 ***Figure 1***: *Custom information that will be appended to the Build log during the execution of a Custom Action*

Now you can write information in your Custom Action code with this code.

[![SNAGHTMLb43bcb](https://www.codewrecks.com/blog/wp-content/uploads/2010/11/SNAGHTMLb43bcb_thumb.png "SNAGHTMLb43bcb")](https://www.codewrecks.com/blog/wp-content/uploads/2010/11/SNAGHTMLb43bcb.png)

 ***Figure 2***: *Log a complex object from Custom Action code*

Now the only problem is that you need to write a Visual Studio plug-in to visualize the data, as described in [this post](http://blogs.msdn.com/b/jpricket/archive/2009/12/21/tfs-2010-displaying-custom-build-information-in-visual-studio.aspx). If you are asking yourself, why you should use this complex object instead of three calls to standard logging method to log that three information (Date, Message and Value) you should understand that with this technique you can specify how this object will be shown on the build report.

I want this log to be really visible (because it is a SuperWarning) so I write this visualizer

[![SNAGHTMLb62bf3](https://www.codewrecks.com/blog/wp-content/uploads/2010/11/SNAGHTMLb62bf3_thumb.png "SNAGHTMLb62bf3")](https://www.codewrecks.com/blog/wp-content/uploads/2010/11/SNAGHTMLb62bf3.png)

 ***Figure 3***: *How to visualize a complex log*

The key factory here is that this code does not need to make a reference to the original object used for the log, because all property are passed as string in the *node.Fields* array. Now if you use this plugin you can see that you are able to visualize complex data.

[![SNAGHTMLb792c0](https://www.codewrecks.com/blog/wp-content/uploads/2010/11/SNAGHTMLb792c0_thumb.png "SNAGHTMLb792c0")](https://www.codewrecks.com/blog/wp-content/uploads/2010/11/SNAGHTMLb792c0.png)

 ***Figure 4***: *The plugin visualizes the comples log with the custom format*

Thanks to WPF flexibility in configuration I'm able to create a super warning like message that the reader could not miss in the log :). If you had logged that three info with standard call, you would have seen them as other log and it would be less visible, with custom visualizer you really create a good warning.

Compared with the old TFS Build 2008 with MSBuild and text log files, you should admit that TFS build 2010 is a real step forward.

Alk.
