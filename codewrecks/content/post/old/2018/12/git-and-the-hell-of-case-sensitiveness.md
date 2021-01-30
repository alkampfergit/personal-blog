---
title: "Git and the Hell of case sensitiveness"
description: ""
date: 2018-12-29T09:00:37+02:00
draft: false
tags: [Git]
categories: [Git]
---
If you know how git works, you are perfectly aware that, even if you work in operating systems with case insensitive file system, all commit are case sensitive. Sometimes if you change the case of a folder, then commit modification of files inside that folder, you will incur into problems,  **because if casing of the path changes, the files are different for the Git Engine (but not for operating systems like windows).** In the long run you will face some annoying problems, like git showing that some of the files are modified (while you didn’t touch them) and you are unable to undo changes or work with those files. This problem will become really annoying during rebase operations.

> Having files with only case differences is one of the most annoying problem with Git Repositories in Windows

Luckily enough,  **Azure DevOps has an option for Git Repository where you can have the engine prevent commits that contains file names with only case differences, to avoid this problem entirely**.

[![image](http://www.codewrecks.com/blog/wp-content/uploads/2018/12/image_thumb-10.png "image")](http://www.codewrecks.com/blog/wp-content/uploads/2018/12/image-10.png)

 ***Figure 1***: *Options for Cross platform compatibility can solve most headaches*

The first option completely blocks pushes that contains files not compatible across platform and is the option that we are looking for, because it will block you from pushing code that will lead to case sensitiveness problems.

The other two options are equally needed, because the second one will prevent you from pushing path with forbidden names or incompatible characters (remember that this is different between Windows and Linux). Finally the third one will block pushes that contains path with unsupported length, a problem that is really nasty for Windows Users.

In the end, if you have case sensitiveness problem in your repository and you already pushed your code, because you did not have these option enabled, I can suggest you a **nice tool available in GitHub that find all problems in the repository and fix them, it is called** [**Git Unite**](https://github.com/tawman/git-unite). You can clone the project, compile in visual studio then just launch from command line giving path of a local git repository as single arguments and it will do everything automatically.

Gian Maria
