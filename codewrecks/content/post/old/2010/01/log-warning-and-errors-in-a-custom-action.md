---
title: "Log warning and errors in a custom action"
description: ""
date: 2010-01-18T20:00:37+02:00
draft: false
tags: [Continuous Integration,TFS Build]
categories: [Team Foundation Server]
---
Some time ago [I blogged about](http://www.codewrecks.com/blog/index.php/2010/01/14/logging-in-custom-build-action-for-tfs-build-2010/) logging in custom action for TFS build 2010, I left out some details. Suppose you want to create a warning or an error and not a simple message, you need to create a specialized version of the LogWarning that logs a real warning.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2010/01/image_thumb22.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2010/01/image22.png)

You can do the same with errors.

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2010/01/image_thumb23.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2010/01/image23.png)

These two methods permit you to log warnings and errors during a custom build action execution, let's see how they affect the output. First of all you can verify that when you log an error the build partially succeeds

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2010/01/image_thumb24.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2010/01/image24.png)

The error and warning are reported in the detailed report with their right icons

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2010/01/image_thumb25.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2010/01/image25.png)

And they are also reported in the â€œView Summaryâ€ of the build

[![image](https://www.codewrecks.com/blog/wp-content/uploads/2010/01/image_thumb26.png "image")](https://www.codewrecks.com/blog/wp-content/uploads/2010/01/image26.png)

Next time I'll explain you how to wrap a msbuild Custom Task in a custom action.

Alk.

Tags: [Tfs](http://technorati.com/tag/Tfs)
