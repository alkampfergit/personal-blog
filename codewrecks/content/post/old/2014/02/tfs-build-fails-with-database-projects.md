---
title: "Tfs build fails with Database Projects"
description: ""
date: 2014-02-28T11:00:37+02:00
draft: false
tags: [TFS Build]
categories: [Tfs]
---
If you have a TFS Builds that fails with an error like this one, even if you have installed Visual Studio 2013 on your build server.

*<font face="Consolas">The imported project &#8220;C:\Program Files (x86)\MSBuild\Microsoft\VisualStudio\v11.0\SSDT\Microsoft.Data.Tools.Schema.SqlTasks.targets&#8221; was not found. Confirm that the path in the &lt;Import&gt; declaration is correct, and that the file exists on disk</font>*

The reason could be that you miss Sql Server Data Tools, you only need to download them in all servers with Build Agents and install it. Now the build should runs without problems.

Gian Maria.
