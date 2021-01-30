---
title: "Repair Visual Studio template"
description: ""
date: 2010-06-07T16:00:37+02:00
draft: false
tags: [Visual Studio]
categories: [Tools and library]
---
Some minutes ago I installed Expression studio 4.0, while Iâ€™m working with a couple of solution in VS2008, when I close the solution and open another solution I see that I was not able anymore to work with test projects.

All test projects inside any solution appear as folder, and I was not able anymore to create a test project. I do not know if something get wrong during installation of Expression tools while I have a couple of VS instances opened or there was some problem on my machine that happened for any other reason :), but whenever you got problem with project templates in Visual Studio, such as missing project types, you can try to run

* **devenv /InstallVSTemplates** *

that restores all templates in Visual Studio, it worked for me :)

alk.
