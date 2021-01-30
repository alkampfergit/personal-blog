---
title: "Playing with label in TFS"
description: ""
date: 2009-08-05T01:00:37+02:00
draft: false
tags: [TeamFoundationServer]
categories: [Team Foundation Server]
---
I just received a question in a [old post](http://www.codewrecks.com/blog/index.php/2009/06/22/creating-a-build-with-tfs/), the question is if we can generate builds against any applied label on source code in TFS. Tfs build are configured to always retrieve by default the latest code from source control, but you can configure it with no problem.

All you need is to override the BeforeGet target, and set the  **SkipGet** property to true, in this way you can have complete control on the process of getting the source to compile, you can even grab source from other type of repository, like subversion. With this technique you can rebuild a specific label whenever you want.

But the real interesting stuff you can do is getting the source code associated with a label. When a build is triggered it labels the source code with the build number, so you can always get the source code that generates that build. To obtain this you can simply to a Get Specific Version

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2009/08/image-thumb10.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2009/08/image10.png)

Now you must select to get a specific version by label (step 1), then ask to browse all labels (step2) and finally press the find button (step3) to have a list of every build associated to this source control

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2009/08/image-thumb11.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2009/08/image11.png)

Selecting a specific label will revert your local source to the one used during the build, so you can open the solution and do whatever you want. This is especially useful if a tester had signaled a bug in a specific build, and you want to replicate it with the exact source code used for the build.

You can do the same code from command prompt with [tf get itemspec](http://msdn.microsoft.com/en-us/library/fx7sdeyf.aspx) command, so you can [automate it inside a script](http://simplelifeuk.wordpress.com/2009/01/26/msbuild-task-get-the-latest-code-from-tfs-and-build/), this permits you to grab in any time the exact source code that generate a build, so you will be able to replicate bugs, or inspect the actual code that is running into customer machine, just knowing the build label.

If you want to play nicely with label you can give a look at [Team Foundation Sidekick](http://www.attrice.info/downloads/index.htm) it permits you to search, browse labels and look at what version control each file is respect to the label. Remember always [that tfs labels are different from SourceSafe](http://blogs.msdn.com/bharry/archive/2005/11/18/494439.aspx) from sidekick you can verify that a single label does not correspond to a point in time.

alk.

Tags: [Team Foundation Server](http://technorati.com/tag/Team%20Foundation%20Server)
