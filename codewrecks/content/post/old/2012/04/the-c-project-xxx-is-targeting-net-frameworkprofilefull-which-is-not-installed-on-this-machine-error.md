---
title: "The C project xxx is targeting NET FrameworkhellipProfileFull which is not installed on this machine error"
description: ""
date: 2012-04-27T08:00:37+02:00
draft: false
tags: [Visual Studio]
categories: [NET framework]
---
This morning I need to work on an old Visual Studio 2008 project, and since I do not have VS2008 in my machine I decided to convert to VS2010, all projects converts well, but one of them have this error during conversion

[![SNAGHTML7a5ec4](https://www.codewrecks.com/blog/wp-content/uploads/2012/04/SNAGHTML7a5ec4_thumb.png "SNAGHTML7a5ec4")](https://www.codewrecks.com/blog/wp-content/uploads/2012/04/SNAGHTML7a5ec4.png)

 ***Figure 1***: *The strange error during project conversion*

I never had such a problem in this installation, moreover the project was a WPF 3.5 project, and there also another WPF 3.5 project in the same solution that works perfectly. So I decided to open the project file to understand what can be wrong.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2012/04/image_thumb3.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2012/04/image3.png)

 ***Figure 2***: *The property of the project file that caused the problem*

As you can see in figure 2 I Have a TargetFrameworkSubset in the project that refuse to convert and I do not have the same property in the other WPF project that converted with no problem. Once that property was removed, I was able to reload the project and work with it with no problem.

Gian Maria.
